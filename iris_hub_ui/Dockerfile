FROM node


EXPOSE 3000

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json package.json

RUN npm install

RUN npm install -g serve

COPY . .

RUN npm run build

CMD [ "serve", "-s", "build", "-l", "3000" ]