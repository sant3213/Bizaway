FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g typescript ts-node

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "--loader", "ts-node/esm", "-r", "tsconfig-paths/register", "./src/app.ts"]
