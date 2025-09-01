FROM node:18

# Installing libvips-dev for sharp Compatibility
RUN apt-get update && apt-get install libvips-dev -y

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Install pm2 globally
RUN npm install -g pm2

WORKDIR /opt/

# Copy only package files to leverage Docker cache
COPY ./package.json ./package-lock.json ./

ENV PATH /opt/node_modules/.bin:$PATH

# Install dependencies
RUN npm install

WORKDIR /opt/app

# Copy the entire app (including plugins)
COPY ./ .

# Build the plugins
WORKDIR /opt/app/src/plugins
# Assuming each plugin has its own folder, you can loop through them and run npm run build
# Adjust the command accordingly if needed
RUN for dir in */; do \
        echo "Building plugin: $dir"; \
        (cd "$dir" && npm install && npm run build); \
    done

# Switch back to the main app directory
WORKDIR /opt/app

# Build the main app
RUN npm run build

EXPOSE 7000

# Use pm2 to start the Node.js application
CMD ["pm2-runtime", "start", "--name", "strapi", "npm", "--", "start"]