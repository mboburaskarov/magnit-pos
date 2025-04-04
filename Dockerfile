FROM node:20.11-alpine AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN yarn install

# Copy all files
COPY . .

# ENV_FILE argumentini qabul qilish
ARG ENV_FILE
RUN cp $ENV_FILE .env

# Build React app
RUN yarn build

# Production Image
FROM node:20.11-alpine

WORKDIR /app

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Install a simple server to serve static files
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]