# Use node image
FROM node:21-slim

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with npm
RUN npm install

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Create required directories
RUN mkdir -p public/uploads && chmod -R 755 public/uploads

# Add non-root user
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000

ENV NODE_ENV=production \
    PORT=3000

CMD ["npm", "run", "start:prod"]
