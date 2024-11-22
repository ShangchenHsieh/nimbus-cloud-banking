FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY vite_frontend/package*.json ./vite_frontend/

# Change directory to vite_frontend and install dependencies
WORKDIR /app/vite_frontend
RUN npm install

# Copy the rest of the app files
COPY . .

# Run the Vite development server (adjust as needed)
EXPOSE 5173
CMD ["npm", "run", "dev"]
