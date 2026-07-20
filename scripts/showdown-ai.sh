#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUNTIME_DIR="$ROOT_DIR/.runtime"
SHOWDOWN_PID_FILE="$RUNTIME_DIR/showdown.pid"
BOT_PID_FILE="$RUNTIME_DIR/foul-play.pid"
LAUNCHER_PID_FILE="$RUNTIME_DIR/launcher.pid"
SHOWDOWN_LOG="$RUNTIME_DIR/showdown.log"
BOT_LOG="$RUNTIME_DIR/foul-play.log"
LAUNCHER_LOG="$RUNTIME_DIR/launcher.log"
PORT=8000
LAUNCHER_PORT=3000

mkdir -p "$RUNTIME_DIR"

pid_is_running() {
    local pid_file="$1"
    [[ -f "$pid_file" ]] || return 1
    local pid
    pid="$(cat "$pid_file")"
    [[ "$pid" =~ ^[0-9]+$ ]] || return 1
    kill -0 "$pid" 2>/dev/null
}

stop_pid() {
    local pid_file="$1"
    local label="$2"
    if ! pid_is_running "$pid_file"; then
        rm -f "$pid_file"
        return 0
    fi

    local pid
    pid="$(cat "$pid_file")"
    echo "Stopping $label (PID $pid)..."
    kill "$pid" 2>/dev/null || true
    for _ in {1..20}; do
        if ! kill -0 "$pid" 2>/dev/null; then
            rm -f "$pid_file"
            return 0
        fi
        sleep 0.25
    done
    kill -9 "$pid" 2>/dev/null || true
    rm -f "$pid_file"
}

normalized_bot_username() {
    if [[ -n "${FOUL_PLAY_USERNAME:-}" ]]; then
        printf '%s' "$FOUL_PLAY_USERNAME"
        return
    fi

    local seed base digest
    seed="${GITHUB_USER:-${GITHUB_ACTOR:-${CODESPACE_NAME:-localcodespace}}}"
    base="$(printf '%s' "$seed" | tr -cd '[:alnum:]' | tr '[:upper:]' '[:lower:]' | cut -c1-10)"
    [[ -n "$base" ]] || base="local"
    digest="$(printf '%s' "$seed" | sha256sum | cut -c1-6)"
    printf 'FP%s%s' "$base" "$digest"
}

client_url() {
    if [[ -n "${CODESPACE_NAME:-}" ]]; then
        printf 'https://%s-%s.app.github.dev/client.html' "$CODESPACE_NAME" "$LAUNCHER_PORT"
    else
        printf 'http://localhost:%s/client.html' "$LAUNCHER_PORT"
    fi
}

keep_showdown_port_private() {
    [[ -n "${CODESPACE_NAME:-}" ]] || return 0
    command -v gh >/dev/null 2>&1 || return 0
    gh codespace ports visibility "$PORT:private" -c "$CODESPACE_NAME" >/dev/null 2>&1 || true
    echo "Codespaces port $PORT is kept private; browser traffic is proxied through port $LAUNCHER_PORT."
}

start_showdown() {
    if pid_is_running "$SHOWDOWN_PID_FILE"; then
        echo "Pokemon Showdown is already running."
        return
    fi

    cd "$ROOT_DIR"
    bash scripts/ensure-codespaces-config.sh

    echo "Starting Pokemon Showdown..."
    nohup node pokemon-showdown start --no-security >"$SHOWDOWN_LOG" 2>&1 &
    echo $! > "$SHOWDOWN_PID_FILE"

    for _ in {1..180}; do
        if curl -fs -o /dev/null "http://127.0.0.1:$PORT/" 2>/dev/null; then
            return 0
        fi
        if ! pid_is_running "$SHOWDOWN_PID_FILE"; then
            echo "Pokemon Showdown exited during startup." >&2
            tail -n 100 "$SHOWDOWN_LOG" >&2 || true
            return 1
        fi
        sleep 1
    done

    echo "Pokemon Showdown did not become ready on port $PORT." >&2
    tail -n 100 "$SHOWDOWN_LOG" >&2 || true
    return 1
}

start_bot() {
    if pid_is_running "$BOT_PID_FILE"; then
        echo "foul-play is already running."
        return
    fi

    if [[ ! -x "$ROOT_DIR/.venv/bin/python" ]]; then
        echo "Python environment is missing. Run: bash scripts/codespaces-setup.sh" >&2
        return 1
    fi

    local bot_username format
    bot_username="$(normalized_bot_username)"
    format="${FOUL_PLAY_FORMAT:-gen9randombattle}"

    local -a args
    args=(
        "$ROOT_DIR/.venv/bin/python" run.py
        --websocket-uri "ws://127.0.0.1:$PORT/showdown/websocket"
        --ps-username "$bot_username"
        --bot-mode accept_challenge
        --pokemon-format "$format"
        --search-time-ms "${FOUL_PLAY_SEARCH_TIME_MS:-500}"
        --search-parallelism "${FOUL_PLAY_SEARCH_PARALLELISM:-1}"
        --search-threads "${FOUL_PLAY_SEARCH_THREADS:-1}"
        --run-count "${FOUL_PLAY_RUN_COUNT:-1000000}"
        --log-level "${FOUL_PLAY_LOG_LEVEL:-INFO}"
    )
    if [[ -n "${FOUL_PLAY_PASSWORD:-}" ]]; then
        args+=(--ps-password "$FOUL_PLAY_PASSWORD")
    fi

    echo "Starting foul-play as $bot_username..."
    cd "$ROOT_DIR/foul-play"
    nohup "${args[@]}" >"$BOT_LOG" 2>&1 &
    echo $! > "$BOT_PID_FILE"
    sleep 2

    if ! pid_is_running "$BOT_PID_FILE"; then
        echo "foul-play exited during startup." >&2
        tail -n 120 "$BOT_LOG" >&2 || true
        return 1
    fi
}

start_launcher() {
    if pid_is_running "$LAUNCHER_PID_FILE"; then
        echo "Launcher is already running."
        return
    fi

    local bot_username format
    bot_username="$(normalized_bot_username)"
    format="${FOUL_PLAY_FORMAT:-gen9randombattle}"

    echo "Starting launcher and same-origin Showdown client proxy..."
    cd "$ROOT_DIR"
    nohup env \
        "BOT_USERNAME=$bot_username" \
        "BOT_FORMAT=$format" \
        "LAUNCHER_PORT=$LAUNCHER_PORT" \
        "SHOWDOWN_PORT=$PORT" \
        node scripts/launcher-server.js >"$LAUNCHER_LOG" 2>&1 &
    echo $! > "$LAUNCHER_PID_FILE"

    for _ in {1..30}; do
        if curl -fs -o /dev/null "http://127.0.0.1:$LAUNCHER_PORT/health" 2>/dev/null; then
            return 0
        fi
        if ! pid_is_running "$LAUNCHER_PID_FILE"; then
            echo "Launcher exited during startup." >&2
            tail -n 100 "$LAUNCHER_LOG" >&2 || true
            return 1
        fi
        sleep 1
    done

    echo "Launcher did not become ready on port $LAUNCHER_PORT." >&2
    tail -n 100 "$LAUNCHER_LOG" >&2 || true
    return 1
}

show_status() {
    local bot_username format
    bot_username="$(normalized_bot_username)"
    format="${FOUL_PLAY_FORMAT:-gen9randombattle}"

    if pid_is_running "$SHOWDOWN_PID_FILE"; then
        echo "Pokemon Showdown: running (PID $(cat "$SHOWDOWN_PID_FILE"))"
    else
        echo "Pokemon Showdown: stopped"
    fi
    if pid_is_running "$BOT_PID_FILE"; then
        echo "foul-play: running (PID $(cat "$BOT_PID_FILE"))"
    else
        echo "foul-play: stopped"
    fi
    if pid_is_running "$LAUNCHER_PID_FILE"; then
        echo "Launcher/proxy: running (PID $(cat "$LAUNCHER_PID_FILE"))"
    else
        echo "Launcher/proxy: stopped"
    fi
    echo "Bot username: $bot_username"
    echo "Format: $format"
    echo "Client: $(client_url)"
}

start_all() {
    start_showdown
    keep_showdown_port_private
    start_bot
    start_launcher
    echo
    show_status
}

stop_all() {
    stop_pid "$BOT_PID_FILE" "foul-play"
    stop_pid "$LAUNCHER_PID_FILE" "launcher/proxy"
    stop_pid "$SHOWDOWN_PID_FILE" "Pokemon Showdown"
    keep_showdown_port_private
    echo "Stopped. The Showdown server port remains private."
}

show_logs() {
    echo "===== Pokemon Showdown ====="
    tail -n 100 "$SHOWDOWN_LOG" 2>/dev/null || echo "No Showdown log yet."
    echo
    echo "===== foul-play ====="
    tail -n 140 "$BOT_LOG" 2>/dev/null || echo "No foul-play log yet."
    echo
    echo "===== launcher/proxy ====="
    tail -n 100 "$LAUNCHER_LOG" 2>/dev/null || echo "No launcher log yet."
}

case "${1:-start}" in
    start) start_all ;;
    stop) stop_all ;;
    restart) stop_all; start_all ;;
    status) show_status ;;
    logs) show_logs ;;
    *)
        echo "Usage: bash scripts/showdown-ai.sh {start|stop|restart|status|logs}" >&2
        exit 2
        ;;
esac
