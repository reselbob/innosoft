# Lab II

This lab is desigend to excercise a composed microservice.
We will use `docker-compose` to deliver an application spanning multiple containers.

## Create File

Create a file named `docker-compose.yml` in the top level folder.

Your directory tree should look something like:

```text
labs
│   lab1.md
│   lab2.txt
│   docker-compose.yml
|
└___monolith-app
│   │   ...
│
|___...
```

You may use any text editor to manipulate this file. In YAML, spaces are extremely important, so make sure to indent lines using spaces only, 2 spaces per indentation level.

Add a the version and services keys into the compose file:

```yaml
version: "3.7"

services:
```

## Define Services

Our monolithic application is composed of 2 services: The web application, and a database. We'll start with defining the database service.

Add a service key *legacy-db* under the `services` list. Don't forget to indent properly!

To the `legacy-db` service, add:

- An `image` specifying "mongodb" version 4.0
- A `ports` key containing a list of ports. In the port mapping, state that port *27017* on the host is mapped to port *27017* in the container.

Double check to make sure your indentation is correct.

Add a service key *legacy-web* to the `services` list.

To the `legacy-web` service, add:

- An `image` entry, with the value  _YOURNAME/demo-monolith:latest_
- A `build` key, with the value of the directory name `./monolith-app`
- Port mapping that maps host port 3000 to the container port 3000.
- `depends_on` key, containing a list of dependencies. This container depends on our database container, so use the db container name `legacy-db`. In YAML, a list can be specified as an array or as an indented line starting with a dash space "- ".
- An `environment` entry containing a list of values. We will only add one value: the db connection string. Since your database service is "legacy-db", assign the varibale `MONGO_URL1` to the value `mongodb://legacy-db:27017/appDemo1`.

## Running the composed services

The beauty of describing services in this way, is that we can then automate running them with ease.

`docker-compose` can use this file and run our whole applcation in one command

> Ensure any previous lab containers are stopped and removed!

Run the composition using `docker-compose`

```bash
# cd BASE_DIRECTORY
docker-compose up
```

If all is well, our legacy application should now be running. Point a browser to http://localhost:3000/ and ensure the page renders properly.

No explicit linking is necessary because the 2 containers are created in the same network and the web applicaiton knows the database host name advertised at time of container creation and runtime.

## Stop the composed orchestration

Hit CTRL+C to stop the composition.

> You may run `docker-compose` with the `-d` flag which will daemonize it. In that case, you can stop the composition by running `docker-compose down`.