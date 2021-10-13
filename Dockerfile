FROM node:16.5.0-alpine AS app
ENV NODE_ENV=production
WORKDIR /usr/src/app

# Copy app files and install dependecies
COPY ./app ./

# Build frontend
ENV GENERATE_SOURCEMAP=false
ENV INLINE_RUNTIME_CHUNK=false
RUN yarn install --production --silent && yarn build

FROM node:16.5.0-alpine
ENV NODE_ENV=production

# Make public and private directories
WORKDIR /usr/src/chyll

# copy server files and install dependencies
COPY ./server ./
RUN yarn install --production --silent

RUN  mkdir public && mkdir private 

COPY --from=app /usr/src/app/build/ /usr/src/chyll/public/
RUN  mv ./public/index.html ./private/

EXPOSE 3000
CMD ["yarn", "start", "--production"]
