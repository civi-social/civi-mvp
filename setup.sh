cp .env.example .env
npm i
npm run docker
npm run setup
npm run build

echo ".env file was generated. Remember to fill out different things needed for full control"