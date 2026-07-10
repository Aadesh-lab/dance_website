#!/bin/sh

set -e

echo "Running migrations..."
./bin/migration

echo "Starting server..."
./bin/lldance_backend
