# chyll-server
A DockerFile has been created to build a container with Chyll server.

In order to build the container, you need to have Docker installed on your machine.

Before starting the build, make sure you have populated the `.env` file with the required environment variables.

***NOTE:*** If you wish to connect to a local MYSQL database, your `DB_HOST` should be set to `host.docker.internal`

A quick way to get docker up and running is by running the following command:
`docker-compose up`

Else, if you wish to do it manually, follow the steps below:

Once docker is installed, you can build the container by running:
`docker build -t chyll-server .`

Then to run the container, if you are on Docker-for-mac or Docker-for-Windows 18.03+ run:
`docker run -it -p 3000:3000 --env-file .env chyll-server`

Else, if you are on linux, run:
`docker run -it -p 3000:3000 --env-file .env --add-host host.docker.internal:host-gateway chyll-server`