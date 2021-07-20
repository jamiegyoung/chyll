# Chyll
Add some chyll to your playlist

![](https://i.imgur.com/5qOkUwv.jpg)

A website that adds lofi beats (daily 17:00 UTC) to a spotify playlist of your choosing.

Check out the live version [here](https://jamieyoung.tech/)!

## Setup

### Docker
Before starting the build, make sure you have populated the `.env` file with the required environment variables localted at server/.env.

***NOTE:*** If you wish to connect to a local MYSQL database, your `DB_HOST` should be set to `host.docker.internal`

A DockerFile and docker-compose file has been setup so all you need to do is run `docker-compose up` and it will start the server.

If you wish to build and run it manually, follow the steps below:

Once docker is installed, you can build the container by running:
`docker build -t chyll .`

Then to run the container, if you are on Docker-for-mac or Docker-for-Windows 18.03+ run:
`docker run -it -p 3000:3000 --env-file .env chyll`

Else, if you are on linux, run:
`docker run -it -p 3000:3000 --env-file .env --add-host host.docker.internal:host-gateway chyll`

### Manual
1. Within `app/` run
```sh
yarn
```
2. Then run
```sh
yarn build
```
4. Copy the files within `app/build` into `server/public`
5. Move `index.js` from `server/public` to `server/private`
6. Within `server/` run the command
```sh
yarn
```
7. Within `server/src/` copy and rename `.env.sample` to `.env` and insert your details

## Database setup
A sql file has been provided in order to create the required table

## Usage
1. Start the server with 
```
yarn start
```
1. Open your browser at http://localhost:4000
