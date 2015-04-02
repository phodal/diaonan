#!/usr/bin/env sh
export NVM_DIR="/root/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
nvm use 0.10.35
NODE_ENV=development
forever stopall &
forever start -l /home/www/diaonan/log/forever.log -o /home/www/diaonan/log/out.log -e /home/www/diaonan/log/err.log -a diaonan.js
