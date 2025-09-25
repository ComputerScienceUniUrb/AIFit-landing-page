FROM node:24.8-alpine

ENV PORT=8000
EXPOSE 8000

COPY . /code
WORKDIR /code

RUN npm install

USER 1000

CMD ["node", "server.js"]
