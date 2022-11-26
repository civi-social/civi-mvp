# Setting up .env file
sh ./.env-setup.sh

# Installing Fly Deployment Stuff
sh ./fly-install.sh

# Prepare
npm i
npm run docker
npm run setup
npm run build
