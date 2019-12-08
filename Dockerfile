FROM node:10.15-alpine

RUN apk update
RUN apk add python make g++ 

COPY . /app
WORKDIR /app

RUN npm i
RUN npm i -g sails@0.12

EXPOSE 1337

CMD sails lift --models.migrate='safe'
