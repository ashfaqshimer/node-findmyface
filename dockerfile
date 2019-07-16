FROM node:current-alpine

WORKDIR /usr/src/findmyface-api

COPY ./ ./

RUN npm install

CMD ["/bin/sh"]