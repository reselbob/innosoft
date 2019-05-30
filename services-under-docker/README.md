# Configuring a Backing Service to an Front End Service Using Docker

In this lab we're going to spin up an MongoDB container. Then, we going to spin up a Node.JS application and bind it to the
backing MongoDB container.


## Creating the MongoDB backing database application

**Step 1:** To create the MongoDB container using a cloud based image, execute the following command.

`docker run --name mongo4 -d -p 27017:27017 mongo:4.0`

Note the container is named `mongo4`.

## Run Demo App directly on the local machine

**Step 2:** Change directory to the demo app

`cd ./demo-app`

**Step 3:** Install library dependencies using npm

`npm install`

**Step 4:** Run the demo application

`npm start`

**Step 5:** Confirm that the application is running by executing the following command.

`curl -L http://localhost:3000/`

## Dockerize Node Application

Now it's time to package the demo application as a Docker image

This is a common "brown field" technique: simply packaging an existing code base so it can be launched in a cloud environment or on modern dev-ops on premises.


**Step 6:** Create the Docker image against the Dockerfile using the following command:

`docker build -t innosoft/demo-app .`

The Dockerfile:

```text
FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```


## Run the application in a docker container

**Step 7:** To start the application in a container, execute the following command:

`docker run --name demoapp -i -d -p 3000:3000 -d innosoft/demo-app`

This command runs the container with the following configuration:

* Container will be named `demoapp`
* TCP port `3000` on the host will be mapped to port `3000` in the container

## Verify the the app is running

**Step 8:** To verify that the application in a container, execute the following command:

`curl -L localhost:3000`

You will hang because there is **something wrong**. `crtl-c` out of the app.

## Troubleshooting the problem at hand

We need to find the `ID` of the misbehaving container wso we can inspect the logs

**Step 9:** To find the container id, execute the following command

`docker ps -a`
```text
CONTAINER ID        IMAGE                    COMMAND                  CREATED             STATUS              PORTS                      NAMES
57266c43fcd8        innosoft/demo-app   "npm start"              3 minutes ago       Up 3 minutes        0.0.0.0:3000->3000/tcp     demoapp
254848bbc704        mongo:4.0                "docker-entrypoint.s…"   10 minutes ago      Up 10 minutes       0.0.0.0:27017->27017/tcp   mongo4
```

Once you have the container id in hand, you can inspect its logs. 

**Step 10:** To find inspect the logs of the Node.JS application, execute the following command

`docker logs THE_CONTAINER_ID`

You'll find some log entries that reveal that the app cannot connect to MongoDB.

```text

> demo@0.0.0 start /usr/src/app
> node ./bin/www

(node:17) DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
MongoDB connection error: MongoNetworkError: failed to connect to server [localhost:27017] on first connect [Error: connect ECONNREFUSED 127.0.0.1:27017
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1054:14) {
  name: 'MongoNetworkError',
  message: 'connect ECONNREFUSED 127.0.0.1:27017',
  stack: 'Error: connect ECONNREFUSED 127.0.0.1:27017\n    at ' +
    'TCPConnectWrap.afterConnect [as oncomplete] ' +
    '(net.js:1054:14)',
  errorLabels: [Array],
  [Symbol(mongoErrorContextSymbol)]: {}
}]
    at Pool.<anonymous> (/usr/src/app/node_modules/mongodb-core/lib/topologies/server.js:562:11)
    at Pool.emit (events.js:200:13)
    at Connection.<anonymous> (/usr/src/app/node_modules/mongodb-core/lib/connection/pool.js:316:12)
    at Object.onceWrapper (events.js:288:20)
    at Connection.emit (events.js:200:13)
    at Socket.<anonymous> (/usr/src/app/node_modules/mongodb-core/lib/connection/connection.js:245:50)
    at Object.onceWrapper (events.js:288:20)
    at Socket.emit (events.js:200:13)
    at emitErrorNT (internal/streams/destroy.js:91:8)
    at emitErrorAndCloseNT (internal/streams/destroy.js:59:3)
    at processTicksAndRejections (internal/process/task_queues.js:84:9) {
  name: 'MongoNetworkError',
  message: 'failed to connect to server [localhost:27017] on first connect ' +
    '[Error: connect ECONNREFUSED 127.0.0.1:27017\n    at ' +
    'TCPConnectWrap.afterConnect [as oncomplete] (net.js:1054:14) {\n  ' +
    "name: 'MongoNetworkError',\n  message: 'connect ECONNREFUSED " +
    "127.0.0.1:27017',\n  stack: 'Error: connect ECONNREFUSED " +
    "127.0.0.1:27017\\n    at ' +\n    'TCPConnectWrap.afterConnect [as " +
    "oncomplete] ' +\n    '(net.js:1054:14)',\n  errorLabels: [Array],\n  " +
    '[Symbol(mongoErrorContextSymbol)]: {}\n}]',
  errorLabels: [ 'TransientTransactionError' ],
  [Symbol(mongoErrorContextSymbol)]: {}
}
GET / - - ms - -
```


What went wrong? The connection in the code wants "localhost" which it assumed was running on the same machine. But docker containers isolate the processes from each other. It might as well be on a different "machine" altogether.

If you look at `demo-app\app.js`, you will find a line `var mongoDB = process.env.MONGO_URL1 || 'mongodb://localhost:27017/appDemo1';`. This line enables us to override the URL that the app will use to connect to Mongo.

The Node.JS container lives in its own process space. Thus, when you call `localhost` in the Node.JS container, the application is looking at its
localhost, NOT the localhost of the MongoDB container. We need to tell the Node.JS container how to talk to the MongoDB container.

To do this well pass to the Nodes.JS container an environment variable that has a URL that uses the name of the MongoDB container. Remember, the
MongoDB container name is, `mongo4`.

## Binding to the MongDB container

First we need to kill the container that is already running the Node.JS application against port `3000` on the localhost. We'll need to find the 
container ID and the run the Docker command, `rm` to nuke the container.


**Step 11:** To determine the `id` of the Node.JS application, in a **separate terminal**, execute the following command:

`docker ps -a`


```text
CONTAINER ID        IMAGE                    COMMAND                  CREATED             STATUS              PORTS                      NAMES
154a94b58b87        innosoft/demo-app   "npm start"              59 seconds ago      Up 57 seconds       0.0.0.0:3000->3000/tcp     demoapp
8cc0f8f9db0c        mongo:4.0                "docker-entrypoint.s…"   4 minutes ago       Up 4 minutes        0.0.0.0:27017->27017/tcp   mongo4
```
**Step 12:** To remove the Node.JS container from memory, run the following command:

`docker rm -f 154a94b58b87`, be advised, your container ID will be different.

**Step 13:** To create a container for the Node.JS application that will be bound to the MongoDB container, execute the following command. 

`docker run -d -i -p 3000:3000 --env MONGO_URL1="mongodb://mongo4:27017/appDemo1" --link mongo4 -d innosoft/demo-app`

**Step 14:** Call the Node.JS application using `curl`.

`curl -L localhost:3000`

Let's take a look at the log output. We'll need to find the `ID` of the Node.JS container

**Step 15:** To find the container id of the new version of the Node.JS application, execute the following command

`docker ps -a`

Once you have the container id in hand, you can inspect its logs.

**Step 16:** To find inspect the logs of the Node.JS application, execute the following command

`docker logs THE_CONTAINER_ID`

You should see output similar to the following:

```text
> demo@0.0.0 start /usr/src/app
> node ./bin/www

(node:16) DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
{ _id: 5cf03db8951f3729eca378c1, name: 'bob', __v: 0 }
{
  items: [ 'orange', 'apple', 'banana' ],
  _id: 5cf03db8951f3729eca378c2,
  user: 5cf03db8951f3729eca378c1,
  __v: 0
}
GET / 200 278.558 ms - 497
```


