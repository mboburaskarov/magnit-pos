FROM node:20.11-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN yarn install 

COPY . .
RUN yarn build

FROM node:20.11-alpine

WORKDIR /app

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Install a simple server to serve static files
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]