# Installing Fly Deployment Stuff
curl -L https://fly.io/install.sh | sh
export FLYCTL_INSTALL="/home/gitpod/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"

# Setting up .env file
./env-setup.sh

# Prepare
npm i
npm run docker
npm run setup
npm run build
