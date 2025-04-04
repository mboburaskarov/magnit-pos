FROM node:20.11-alpine AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN yarn install 

# Copy all files
COPY . .

# Accept a build argument for the environment (default: production)
ARG REACT_APP_ENV=production

# Set ENV for later use
ENV REACT_APP_ENV=${REACT_APP_ENV}

# Ensure the correct .env file is copied before building
RUN cp .env.${REACT_APP_ENV} .env

# Debugging: Check which environment is being used
RUN echo "Building with .env.${REACT_APP_ENV} settings"

# Build the React app
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