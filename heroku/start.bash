#!/bin/bash

SCRIPT_PATH=`realpath $0`
SCRIPT_DIR=`dirname $SCRIPT_PATH`

ROOT_DIR=`dirname $SCRIPT_DIR`

PUBLIC_DIR="$ROOT_DIR/public"
DIST_DIR="$ROOT_DIR/dist"

SERVER_FILE="$SCRIPT_DIR/server.js"

cp -r "$SERVER_FILE" "$PUBLIC_DIR"/{css,sprite_sheets,zones,favicon.ico} "$DIST_DIR"

node "$DIST_DIR/server.js"
