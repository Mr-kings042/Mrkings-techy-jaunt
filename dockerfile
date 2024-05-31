
# Dockerfile

# use an existing node slim as a base image
# FROM node:21-alpine
FROM node:22-slim

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json file
COPY package.json ./

# Copy the rest of the application files
COPY . .

# Install any needed packages specified in package.json
RUN npm install

# Expose the port
EXPOSE 5000

# Run the app when the container launches
CMD ["npm", "start"]