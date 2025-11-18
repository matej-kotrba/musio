FROM node:lts-alpine

USER node
WORKDIR /apps/backend

COPY . .
RUN 

ARG PORT
EXPOSE ${PORT:-3000}

CMD ["npm", "run", "start"]
