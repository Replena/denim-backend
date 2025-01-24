FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 8081

RUN echo "#!/bin/sh\nnode src/config/dbInit.js && node src/index.js" > start.sh
RUN chmod +x start.sh

CMD ["./start.sh"] 