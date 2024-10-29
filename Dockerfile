FROM node:18-alpine

RUN mkdir -p /app
WORKDIR /app


COPY package*.json ./
RUN npm install

COPY . .
RUN npx tsc

WORKDIR /app/dist

EXPOSE 3000

CMD ["node", "app.js"]
