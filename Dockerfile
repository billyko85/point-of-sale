FROM node:10.15-alpine

COPY . /app
WORKDIR /app

RUN npm i
RUN npm i -g sails@0.12

EXPOSE 1337

CMD sails lift --models.migrate='safe'
