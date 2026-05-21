FROM node:20.11 AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

ARG VITE_API_BASE_URL
ARG VITE_MEDIA_BASE_URL
ARG VITE_USE_MOCKS

RUN yarn global add vite@4.4 && yarn build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
