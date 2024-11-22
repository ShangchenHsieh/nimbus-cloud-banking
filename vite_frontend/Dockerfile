FROM node:20

# WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN vite_frontend/npm run dev

EXPOSE 5173

CMD ["vite_frontend/npm", "run", "preview"]