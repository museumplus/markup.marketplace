#!/bin/bash
npm run build;

scp dist/static/js/manifest.*.js my:/home/optim/www.new/gmii.mediaspice.ru/www/local/templates/marketplace/components/marketplace/partners/.default/infospice/super.component/partner-list/js/manifest.js
scp dist/static/js/vendor.*.js my:/home/optim/www.new/gmii.mediaspice.ru/www/local/templates/marketplace/components/marketplace/partners/.default/infospice/super.component/partner-list/js/vendor.js
scp dist/static/js/app.*.js my:/home/optim/www.new/gmii.mediaspice.ru/www/local/templates/marketplace/components/marketplace/partners/.default/infospice/super.component/partner-list/js/app.js

cp dist/static/js/manifest.*.js ~/project/gmii/gmii.mediaspice.ru/www/local/templates/marketplace/components/marketplace/partners/.default/infospice/super.component/partner-list/js/manifest.js
cp dist/static/js/vendor.*.js ~/project/gmii/gmii.mediaspice.ru/www/local/templates/marketplace/components/marketplace/partners/.default/infospice/super.component/partner-list/js/vendor.js
cp dist/static/js/app.*.js ~/project/gmii/gmii.mediaspice.ru/www/local/templates/marketplace/components/marketplace/partners/.default/infospice/super.component/partner-list/js/app.js

