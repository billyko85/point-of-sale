FROM node:10.15-alpine

RUN apk update
RUN apk add python make g++ 

COPY . /app
WORKDIR /app

RUN rm -rf node_modules
RUN npm i

EXPOSE 1337

CMD npx sails lift --models.migrate='safe'
