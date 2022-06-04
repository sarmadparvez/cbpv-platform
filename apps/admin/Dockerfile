# base image
FROM node:16-alpine

WORKDIR /app

COPY ./dist/apps/admin .

COPY package.json package-lock.json ./

ENV PORT=3333

EXPOSE ${PORT}

RUN apk add --no-cache --virtual .gyp \
        python3 \
        make \
        g++ \
    && npm install \
    && apk del .gyp

#RUN npm install --production

#RUN npm install --production
# dependencies that express needs
#RUN npm install reflect-metadata tslib rxjs express
CMD ["node", "./main.js"]
