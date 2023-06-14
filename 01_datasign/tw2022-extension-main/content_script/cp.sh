#!/bin/sh

# distと同じdirで動作前提
echo 'start cp.sh'
#rm -f ../build/static/js/content.bundle.js
rm -f ../build/static/js/*.bundle.js
rm -f ../build/*.bundle.js
rm -f ../build/static/ng-popup.html
rm -f ../build/static/email-popup.html

cp build/static/js/content.bundle.js ../build/static/js/
cp build/static/js/ngPopup.bundle.js ../build/static/js/
cp build/static/js/emailPopup.bundle.js ../build/static/js/
cp build/ng-popup.html ../build/
cp build/email-popup.html ../build/

cp build/static/js/content.bundle.js ../dist/static/js/
cp build/static/js/ngPopup.bundle.js ../dist/static/js/
cp build/static/js/emailPopup.bundle.js ../dist/static/js/
cp build/ng-popup.html ../dist/
cp build/email-popup.html ../dist/

echo 'finish cp.sh'
