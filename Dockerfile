FROM node:boron

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
#    ----HOST---- ---DOCKER---

RUN npm install

COPY .            /usr/src/app
#    ----HOST---- ---DOCKER---

EXPOSE 8080

CMD [ "npm", "start" ]
