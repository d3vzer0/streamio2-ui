#!/bin/sh
set -e

CONFIG_PATH=/usr/share/nginx/html/js/app.*.js

sed -i 's,http:\/\/localhost:5000\/api\/v1,'"$ST_API_BASE_URL"',g' $CONFIG_PATH

exec "$@"