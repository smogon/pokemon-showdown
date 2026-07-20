#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG_FILE="$ROOT_DIR/config/config.js"
MARKER="// BEGIN CODESPACES OVERRIDES"

if [[ ! -f "$CONFIG_FILE" ]]; then
    cp "$ROOT_DIR/config/config-example.js" "$CONFIG_FILE"
fi

if ! grep -Fq "$MARKER" "$CONFIG_FILE"; then
    cat >> "$CONFIG_FILE" <<'EOF'

// BEGIN CODESPACES OVERRIDES
// Keep the private development server lightweight and stable in a small Codespace.
// Pokemon Showdown explicitly supports `subprocesses = 0` for low-memory environments.
exports.subprocesses = 0;
exports.noguestsecurity = true;
// END CODESPACES OVERRIDES
EOF
fi
