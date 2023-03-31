FROM node:14

RUN apt-get update && apt-get install -y mongodb

RUN npm install mongodb

COPY init.js ./

WORKDIR /usr/src/app

CMD mongod --bind_ip_all & sleep 5 && node init.js && node
