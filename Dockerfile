FROM node:20.11-alpine AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN yarn install 

# Copy all files
COPY . .

# Accept a build argument for the environment (default: production)
ARG REACT_APP_ENV=production

# Ensure React picks up the correct environment
ENV REACT_APP_ENV=${REACT_APP_ENV}

# Print environment variables for debugging
RUN echo "Building for environment: $REACT_APP_ENV"

# Pass environment variable to React
RUN REACT_APP_ENV=$REACT_APP_ENV yarn build

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