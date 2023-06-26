FROM node:8

# USER node
WORKDIR /home/node/app
EXPOSE 9001
COPY package*.json ./
RUN mkdir -p /boletos && npm install -y
COPY . .

