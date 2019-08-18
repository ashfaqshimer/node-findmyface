FROM node:current-alpine

# Create app directory
RUN mkdir -p /usr/src/findmyface-api
WORKDIR /usr/src/findmyface-api

# Install app dependencies
COPY package.json /usr/src/findmyface-api
RUN npm install

# Bundle app source
COPY . /usr/src/findmyface-api

# Build arguments
ARG NODE_VERSION=12.6.0

# Environment
ENV NODE_VERSION $NODE_VERSION