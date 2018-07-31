FROM node:8
WORKDIR .docker-app
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "run", "test"]