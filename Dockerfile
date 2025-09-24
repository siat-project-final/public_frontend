FROM node:18
WORKDIR /frontEnd
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

