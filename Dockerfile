# Stage 1 - build the app
FROM node:20.11-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Stage 2 - production server
FROM nginx:stable-alpine

# Copy build output to nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose nginx default port
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
