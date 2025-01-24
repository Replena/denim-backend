FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run db:init

EXPOSE 8081

CMD ["npm", "start"] 