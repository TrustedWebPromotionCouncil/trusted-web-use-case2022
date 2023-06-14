#!/bin/sh

# distと同じdirで動作前提
rm -f ../build/static/js/background.bundle.js

cp build/js/background.bundle.js ../build/static/js/

cp build/js/background.bundle.js ../dist/static/js/
