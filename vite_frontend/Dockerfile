FROM node:20

WORKDIR /app

COPY vite_frontend/package*.json ./
COPY vite_frontend /src/
RUN npm install

COPY . .

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview"]