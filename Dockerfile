FROM node:16.5.0-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/chyll

# copy server files and install dependencies
COPY ./server ./
RUN yarn install --production --silent

WORKDIR /usr/src/chyll/app

# Copy app files and install dependecies
COPY ./app ./

# Build frontend
ENV GENERATE_SOURCEMAP=false
ENV INLINE_RUNTIME_CHUNK=false
RUN yarn install --production --silent && yarn build

# Make public and private directories
WORKDIR /usr/src/chyll
RUN mkdir ./public
RUN mkdir ./private

# Move static files to public folder
RUN mv ./app/build/* ./public/

# Move index.html to private folder
RUN mv ./public/index.html ./private/

# Delete app source files
RUN rm -r ./app

EXPOSE 3000
CMD ["yarn", "start"]
