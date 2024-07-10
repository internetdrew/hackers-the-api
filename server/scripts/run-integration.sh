#!/usr/bin/env bash

if ! docker info >/dev/null 2>&1; then
    echo "🔴 - Docker daemon is not running. Please start Docker and try again to run tests."
    exit 1
fi

DIR="$(cd "$(dirname "$0")" && pwd)"
source $DIR/setenv.sh
docker-compose -f ../docker-compose.yml up -d
echo '🟡 - Waiting for database to be ready...'
$DIR/wait-for-it.sh "${TEST_DATABASE_URL}" -- echo '🟢 - Database is ready!'
export DATABASE_URL=$TEST_DATABASE_URL

echo '🔴 - Resetting the database...'
npx prisma migrate reset --force
echo '🟢 - Database has been reset!'

npx prisma migrate dev --name init
if [ "$#" -eq  "0" ]
  then
    vitest -c ./vitest.config.integration.ts
else
    vitest -c ./vitest.config.integration.ts --ui
fi