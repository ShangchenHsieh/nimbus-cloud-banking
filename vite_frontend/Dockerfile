FROM node:20

# WORKDIR /app

COPY vite_frontend/package*.json ./

RUN cd vite_frontend

RUN npm install

COPY . .

RUN npm run dev

EXPOSE 5173

CMD ["npm", "run", "preview"]