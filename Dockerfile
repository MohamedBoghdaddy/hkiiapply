FROM node:20-slim

WORKDIR /

COPY server/package*.json ./server/

COPY server/client/package*.json ./server/client/

COPY server/services/package*.json ./server/services/

RUN cd server && npm install

RUN cd server/client && npm install

RUN cd server/services && npm install

COPY . .

COPY server/.env /server/.env

COPY server/services/.env /server/services/.env

RUN ls /server/

EXPOSE 4000

CMD ["node", "server/server.js"]