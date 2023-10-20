echo "Switching to branch master"
git checkout Mati

echo "Building app..."
npm run build

echo "Deploying files to server..."
scp -r build/* matias@192.168.0.13:/var/www/192.168.0.13/

echo "Done!"