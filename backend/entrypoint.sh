#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

echo "[SolarSight] Starting backend entrypoint..."

# Wait for the PostgreSQL database if DATABASE_URL is defined
if [ -n "$DATABASE_URL" ]; then
  echo "[SolarSight] Waiting for database to be ready..."
  python -c "
import urllib.parse
import socket
import time
import os

db_url = os.getenv('DATABASE_URL')
if db_url.startswith('postgres://') or db_url.startswith('postgresql://'):
    url = urllib.parse.urlparse(db_url)
    host = url.hostname
    port = url.port or 5432
    print(f'Checking connection to {host}:{port}...')
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(2)
    for _ in range(30):
        try:
            s.connect((host, port))
            s.close()
            print('Database is UP!')
            break
        except Exception:
            time.sleep(1)
    else:
        print('Database did not become ready in time.')
"
fi

# Check if we should skip migrations (e.g. for Celery workers)
# Celery worker is started with 'celery -A backend worker ...'
is_celery=0
for arg in "$@"; do
  if [ "$arg" = "celery" ]; then
    is_celery=1
    break
  fi
done

if [ "$is_celery" -eq 0 ] && [ "$SKIP_MIGRATIONS" != "True" ] && [ "$SKIP_MIGRATIONS" != "1" ]; then
  # Run migrations
  echo "[SolarSight] Applying database migrations..."
  python manage.py makemigrations models --noinput
  python manage.py migrate --noinput

  # Run database seeder if requested or if database is empty
  if [ "$SEED_DB" = "True" ] || [ "$SEED_DB" = "true" ] || [ "$SEED_DB" = "1" ]; then
    echo "[SolarSight] Seeding database..."
    python seed.py
  fi
else
  echo "[SolarSight] Skipping database migrations/seeding (running task worker or explicitly skipped)."
fi

# Execute the main container command
echo "[SolarSight] Launching command: $@"
exec "$@"
