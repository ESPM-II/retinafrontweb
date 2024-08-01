echo "Switching to branch main"
git checkout main

echo "Building app ..."
npm run build

echo "Deploying files to server ..."
scp -P 22 -r -i /Users/osmani/Documents/Osmani/RetinaRX/mobile-app-services.pem dist/* admin@52.71.118.116:/var/www/admin_front

echo "Deployment Complete!"