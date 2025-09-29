# Step 1: Gunakan image Node.js yang ringan sebagai base image.
FROM node:18-alpine AS base

# Step 2: Set direktori kerja di dalam container.
WORKDIR /app

# Step 3: Copy package.json dan package-lock.json untuk menginstal dependensi.
COPY package*.json ./
RUN npm install

# Step 4: Copy seluruh kode aplikasi Anda.
COPY . .

# Step 5: Bangun aplikasi Next.js Anda untuk produksi.
# Ini akan membuat folder .next dengan versi optimasi dari aplikasi Anda.
RUN npm run build

# Step 6: Tetapkan image tahap akhir untuk container yang lebih kecil dan aman.
FROM node:18-alpine

# Step 7: Set direktori kerja.
WORKDIR /app

# Step 8: Copy hanya hasil build dan package.json dari tahap sebelumnya.
# Ini membuat image lebih kecil dan lebih aman karena tidak menyertakan file pengembangan.
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json

# Step 9: Tetapkan variabel lingkungan jika diperlukan.
ENV NODE_ENV=production

# Step 10: Ekspos port yang akan digunakan oleh aplikasi.
EXPOSE 3000

# Step 11: Perintah untuk menjalankan aplikasi saat container dimulai.
CMD ["npm", "start"]