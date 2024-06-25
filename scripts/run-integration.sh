#!/usr/bin/env bash

DIR="$(cd "$(dirname "$0")" && pwd)"
source $DIR/setenv.sh
docker-compose up -d
echo '🟡 - Waiting for database to be ready...'
$DIR/wait-for-it.sh "${TEST_DATABASE_URL}" -- echo '🟢 - Database is ready!'
export DATABASE_URL=$TEST_DATABASE_URL
npx prisma migrate dev --name init
if [ "$#" -eq  "0" ]
  then
    vitest -c ./vitest.config.integration.ts
else
    vitest -c ./vitest.config.integration.ts --ui
fi