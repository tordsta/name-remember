#!/usr/bin/env bash
# Apply all migrations in order to an EMPTY database.
# There is no migration tracking table, so do not re-run against a migrated DB.
#
# Usage: DATABASE_URL=postgres://user:pass@host:port/db ./scripts/migrate.sh
set -euo pipefail

: "${DATABASE_URL:?Set DATABASE_URL, e.g. postgres://postgres:postgres@localhost:5432/userdata}"

PSQL="$(command -v psql || true)"
if [ -z "$PSQL" ] && [ -x /opt/homebrew/opt/libpq/bin/psql ]; then
  PSQL=/opt/homebrew/opt/libpq/bin/psql
fi
: "${PSQL:?psql not found. Install it with: brew install libpq}"

cd "$(dirname "$0")/.."

# Each file runs in its own session: 001 clears search_path for the rest of its session.
for f in migrations/*.sql; do
  echo "==> $f"
  "$PSQL" "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f "$f"
done
echo "All migrations applied."
