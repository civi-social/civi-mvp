curl -L https://fly.io/install.sh | sh
export FLYCTL_INSTALL="/home/gitpod/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"

cp .env.example .env
npm i
npm run docker
npm run setup
npm run build

echo ".env file was generated. Remember to fill out different things needed for full control"