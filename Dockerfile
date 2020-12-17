FROM node:lts-alpine

WORKDIR /root/app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

CMD ["npm", "run", "start"]
