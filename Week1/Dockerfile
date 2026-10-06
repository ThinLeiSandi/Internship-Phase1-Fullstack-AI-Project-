# Step 1: Use official Node.js Alpine base image
FROM node:20-alpine

# Step 2: Set working directory inside container
WORKDIR /app

# Step 3: Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy application source code
COPY . .

# Step 6: Generate Prisma Client & Compile TypeScript
RUN npx prisma generate
RUN npx tsc

# Step 7: Expose API port
EXPOSE 3000

# Step 8: Sync database schema & start the server
CMD ["node", "dist/server.js"]
