FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

ENV PORT=${PORT}

EXPOSE ${PORT}

CMD ["npm", "run", "start:prod"]