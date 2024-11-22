FROM node:20

WORKDIR /app

COPY vite_frontend/package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview"]