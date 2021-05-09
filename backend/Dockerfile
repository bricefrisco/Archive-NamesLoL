FROM node:14.16.1-alpine3.13
ENV NODE_ENV=production
COPY build/index.js ./index.js
EXPOSE 8080
ENTRYPOINT ["node", "index.js"]