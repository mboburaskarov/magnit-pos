# Build stage
FROM node:20.11-alpine AS builder
RUN apk update && apk add yarn
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock* ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:20.11-alpine
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Install only production dependencies
RUN yarn install --production

# Expose the port the app runs on (adjust as needed)
EXPOSE 3000

# Command to run the application
CMD ["yarn", "preview"]