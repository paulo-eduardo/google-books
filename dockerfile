FROM node:slim as common
WORKDIR /
COPY package.json yarn.lock /
RUN yarn
COPY . .
EXPOSE 3000
CMD ["yarn", "start"]