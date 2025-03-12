FROM node:22

COPY . /home/node/app
WORKDIR /home/node/app

RUN chown -R node:node /home/node/app/*
USER node

CMD ["/bin/sh", "-c", "npm run start"]
