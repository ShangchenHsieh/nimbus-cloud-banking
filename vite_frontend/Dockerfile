FROM node:20

WORKDIR /app

# Copy only package.json and package-lock.json for caching dependencies
COPY vite_frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY vite_frontend /app/

# Run the build process
RUN npm run build

# Expose the port Vite uses for preview
EXPOSE 5173

# Run the preview server
CMD ["npm", "run", "preview"]
