# Dockerfile for Pokemon Showdown Server
FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Copy pacakge and cache things
COPY package*.json ./
RUN npm install

# Copy the application into the docker image
COPY . .

# Expose the server on port 8000
EXPOSE 8000

# Start the server
CMD ["node", "pokemon-showdown"]
