# -------- Stage 1: Build --------
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy only package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build the NestJS project (dist will be created)
RUN npm run build

# -------- Stage 2: Production --------
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy built dist folder
COPY --from=builder /usr/src/app/dist ./dist

# Copy only production dependencies
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules

EXPOSE 3000

# Run the compiled app
CMD ["node", "dist/main"]
