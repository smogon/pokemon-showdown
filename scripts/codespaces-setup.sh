#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[1/5] Initializing foul-play submodule..."
git submodule sync --recursive
git submodule update --init --recursive

echo "[2/5] Checking runtimes..."
node --version
npm --version
python3 - <<'PY'
import sys
if sys.version_info < (3, 11):
    raise SystemExit(f"Python 3.11+ is required; found {sys.version.split()[0]}")
print(f"Python {sys.version.split()[0]}")
PY

if ! command -v rustc >/dev/null 2>&1; then
    echo "Rust is not installed; installing it with rustup..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --profile minimal
fi

if [[ -f "$HOME/.cargo/env" ]]; then
    # shellcheck disable=SC1090
    source "$HOME/.cargo/env"
fi

rustc --version
cargo --version

echo "[3/5] Installing Pokemon Showdown dependencies..."
if [[ -f package-lock.json ]]; then
    npm ci
else
    npm install
fi

bash scripts/ensure-codespaces-config.sh

echo "[4/5] Installing foul-play dependencies..."
python3 -m venv .venv
# shellcheck disable=SC1091
source .venv/bin/activate
python -m pip install --upgrade pip setuptools wheel
python -m pip install -r foul-play/requirements.txt

echo "[5/5] Preparing runtime directory..."
mkdir -p .runtime

echo
printf '%s\n' "Setup complete. Showdown and the AI will start automatically when the codespace starts."
printf '%s\n' "Manual start: bash scripts/showdown-ai.sh start"
