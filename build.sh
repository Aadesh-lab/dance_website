#!/usr/bin/env bash
#
# Local dev helper: build the Vite frontend and copy the output into
# ./internal/dist/ so `go run ./cmd/server` serves the full SPA.
#
# You do NOT need to run this before deploying to Railway — the root
# Dockerfile does the same steps inside a multi-stage build.
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
FRONTEND="$ROOT/dance-studio"
EMBED_DIR="$ROOT/internal/dist"

echo "==> Frontend: installing deps"
cd "$FRONTEND"
if [ ! -d node_modules ]; then
  npm ci
else
  echo "    node_modules present, skipping install"
fi

echo "==> Frontend: building"
npm run build

echo "==> Copying dist/ into $EMBED_DIR"
rm -rf "$EMBED_DIR"
mkdir -p "$EMBED_DIR"
cp -R "$FRONTEND/dist/." "$EMBED_DIR/"

echo "==> Verifying Go build"
cd "$ROOT"
go build ./...

echo ""
echo "Done. Local run:"
echo "  docker compose up -d postgres minio minio-init"
echo "  cp .env.example .env      # then edit values"
echo "  go run ./cmd/migration && go run ./cmd/server"
echo ""
echo "For Railway: just push — Dockerfile at the repo root does everything."
