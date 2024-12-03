FROM node:20.11 as build

WORKDIR /app

COPY . .

RUN yarn global add vite@4.4

EXPOSE 3000

CMD ["yarn", "dev"]