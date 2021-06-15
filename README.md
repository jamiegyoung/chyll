# Chyll
Add some chyll to your playlist

![](https://i.imgur.com/5qOkUwv.jpg)

A website that adds lofi beats (daily 17:00 UTC) to a spotify playlist of your choosing.

Check out the live version [here](https://jamieyoung.tech/)!

## Setup
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
7. Within `server/src/` copy and rename `config-template.json` to `config.json` and insert your details

## Database setup
A sql file has been provided in order to create the required table

## Usage
1. Start the server with 
```
yarn start
```
1. Open your browser at http://localhost:4000
