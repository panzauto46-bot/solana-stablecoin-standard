# Menggunakan base image NodeJS yang efisien
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy dependency files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependensi (termasuk dev untuk build)
RUN npm install

# Copy source code
COPY src/ ./src/

# Compile TypeScript ke JavaScript
RUN npm run build

# Stage 2: Produksi murni
FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist

# Install HANYA dependensi production untuk meminimalisir ukuran container
RUN npm install --only=production

# Expose port yang digunakan
EXPOSE 3000

# Perintah menjalankan indexer dan server
CMD ["npm", "start"]
