# Stage 1: Build the React application
FROM node:18.17.0 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the built files using a lightweight web server
FROM nginx:alpine

# Copy the built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 7000
EXPOSE 7000

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]