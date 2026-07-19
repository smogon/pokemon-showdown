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

codespaces_host() {
    if [[ -n "${CODESPACE_NAME:-}" ]]; then
        printf '%s-%s.app.github.dev' "$CODESPACE_NAME" "$PORT"
    else
        printf 'localhost:%s' "$PORT"
    fi
}

client_url() {
    local host
    host="$(codespaces_host)"
    if [[ -n "${CODESPACE_NAME:-}" ]]; then
        printf 'https://play.pokemonshowdown.com/testclient-new.html?~~%s:443' "$host"
    else
        printf 'https://play.pokemonshowdown.com/testclient-new.html?~~%s' "$host"
    fi
}

make_server_port_public() {
    [[ -n "${CODESPACE_NAME:-}" ]] || return 0
    command -v gh >/dev/null 2>&1 || return 0

    for _ in {1..15}; do
        if gh codespace ports visibility "$PORT:public" -c "$CODESPACE_NAME" >/dev/null 2>&1; then
            echo "Codespaces port $PORT is public while the server is running."
            return 0
        fi
        sleep 2
    done

    echo "Warning: could not make port $PORT public automatically." >&2
    echo "Open the PORTS tab and change port $PORT visibility to Public." >&2
}

make_server_port_private() {
    [[ -n "${CODESPACE_NAME:-}" ]] || return 0
    command -v gh >/dev/null 2>&1 || return 0
    gh codespace ports visibility "$PORT:private" -c "$CODESPACE_NAME" >/dev/null 2>&1 || true
}

render_launcher() {
    local bot_username format url escaped_url
    bot_username="$(normalized_bot_username)"
    format="${FOUL_PLAY_FORMAT:-gen9randombattle}"
    url="$(client_url)"
    escaped_url="${url//&/&amp;}"

    mkdir -p "$RUNTIME_DIR/launcher"
    cat > "$RUNTIME_DIR/launcher/index.html" <<HTML
<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pokemon Showdown AI</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 0 auto; padding: 32px 20px; line-height: 1.65; }
    .card { border: 1px solid #d0d7de; border-radius: 14px; padding: 22px; }
    .button { display: inline-block; padding: 12px 18px; border-radius: 10px; background: #0969da; color: white; text-decoration: none; font-weight: 700; }
    code { background: #f6f8fa; padding: 2px 6px; border-radius: 6px; word-break: break-all; }
    .note { color: #57606a; }
  </style>
</head>
<body>
  <h1>Pokemon Showdown AI</h1>
  <div class="card">
    <p>Showdownサーバーとfoul-play Botは起動済みです。</p>
    <p><strong>Bot名:</strong> <code>$bot_username</code><br>
       <strong>対戦形式:</strong> <code>$format</code></p>
    <p><a class="button" href="$escaped_url">Showdownを開く</a></p>
    <ol>
      <li>Showdownで自分の名前を設定します。</li>
      <li><code>$bot_username</code> を検索して、<code>$format</code> で対戦を申し込みます。</li>
      <li>Botが自動で受諾します。</li>
    </ol>
    <p class="note">利用中はCodespacesの8000番ポートを公開しています。停止タスクを実行すると非公開へ戻します。</p>
  </div>
</body>
</html>
HTML
}

start_showdown() {
    if pid_is_running "$SHOWDOWN_PID_FILE"; then
        echo "Pokemon Showdown is already running."
        return
    fi

    cd "$ROOT_DIR"
    if [[ ! -f config/config.js ]]; then
        cp config/config-example.js config/config.js
    fi

    echo "Starting Pokemon Showdown..."
    nohup node pokemon-showdown start --no-security >"$SHOWDOWN_LOG" 2>&1 &
    echo $! > "$SHOWDOWN_PID_FILE"

    for _ in {1..60}; do
        if curl -sS -o /dev/null "http://127.0.0.1:$PORT/"; then
            return 0
        fi
        if ! pid_is_running "$SHOWDOWN_PID_FILE"; then
            echo "Pokemon Showdown exited during startup." >&2
            tail -n 80 "$SHOWDOWN_LOG" >&2 || true
            return 1
        fi
        sleep 1
    done

    echo "Pokemon Showdown did not become ready on port $PORT." >&2
    return 1
}

start_bot() {
    if pid_is_running "$BOT_PID_FILE"; then
        echo "foul-play is already running."
        return
    fi

    if [[ ! -d "$ROOT_DIR/.venv" ]]; then
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
        tail -n 100 "$BOT_LOG" >&2 || true
        return 1
    fi
}

start_launcher() {
    render_launcher
    if pid_is_running "$LAUNCHER_PID_FILE"; then
        return
    fi

    echo "Starting launcher page..."
    nohup python3 -m http.server "$LAUNCHER_PORT" --bind 0.0.0.0 --directory "$RUNTIME_DIR/launcher" >"$LAUNCHER_LOG" 2>&1 &
    echo $! > "$LAUNCHER_PID_FILE"
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
        echo "Launcher: running (PID $(cat "$LAUNCHER_PID_FILE"))"
    else
        echo "Launcher: stopped"
    fi
    echo "Bot username: $bot_username"
    echo "Format: $format"
    echo "Client: $(client_url)"
}

start_all() {
    start_showdown
    make_server_port_public
    start_bot
    start_launcher
    echo
    show_status
}

stop_all() {
    stop_pid "$BOT_PID_FILE" "foul-play"
    stop_pid "$SHOWDOWN_PID_FILE" "Pokemon Showdown"
    stop_pid "$LAUNCHER_PID_FILE" "launcher"
    make_server_port_private
    echo "Stopped. Codespaces port $PORT has been returned to private when possible."
}

show_logs() {
    echo "===== Pokemon Showdown ====="
    tail -n 80 "$SHOWDOWN_LOG" 2>/dev/null || echo "No Showdown log yet."
    echo
    echo "===== foul-play ====="
    tail -n 120 "$BOT_LOG" 2>/dev/null || echo "No foul-play log yet."
    echo
    echo "===== launcher ====="
    tail -n 40 "$LAUNCHER_LOG" 2>/dev/null || echo "No launcher log yet."
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
