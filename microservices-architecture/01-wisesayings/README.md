# Implementing WiseSayings

The purpose of these exercises to to learn to run the microservice, WiseSayings as the following
deployment units:

* Standalone Application
* Docker Container
* Kubernetes Deployment and Service

## Exercise 1: Run as a standalone application

In this exercise we'll build the application as a standalone Node.js application running
on a Ubuntu virtual machine on Katacoda.

**Step 1:** Go to the Ubuntu Playground on Katacoda

`https://katacoda.com/courses/ubuntu/playground`

**Step 2:** Clone this GitHub Repository

`git clone https://github.com/reselbob/innosoft.git`

**Step 3:** Navigate to the exercise folder

`cd innosoft/microservices-architecture/01-wisesayings`

**Step 4:** Navigate into the application folder

`cd app`

**Step 5:** Install the application's dependency packages

`npm install`

**Step 6:** Fire up the application (which is a web server)

`node index.js`

**Step 7:** In a **new terminal window**, run a `curl` command to get a Wise Saying

`curl localhost:3000`

**EXERCISE COMPLETED**

## Exercise 2: Build and run as Wise Sayings Docker container

Within the directory `app`, we'll execute the commands necessary to run WiseSaying is a Docker
container from within the Katacoda playground.

`https://katacoda.com/courses/ubuntu/playground`

Using the code clones from the GitHub repository

`git clone https://github.com/reselbob/innosoft.git`

In directory:

`cd innosoft/microservices-architecture/01-wisesayings/app`

We'll Use the Docker `build` command to create a container image for the Wise Sayings
source code

**Step 1:** Take a look at the Dockerfile we'll use to build the container image

`cat Dockerfile`

You'll get output as follows:

```text
FROM node:8.9-alpine
EXPOSE 3000
COPY index.js .
COPY sayings.txt .
CMD ["node", "index.js"]
```

The reason for inspecting the Dockerfile is to provide a sense of what's going to be in the container
image.

**Step 2:** Build the image

`docker build -t reselbob/wisesayings:beta .`

**WHERE**

* `docker` is the command to issue subcommands to the Docker client
* `build` is the subcommand that indicates we're going to create a container image
* `-t reselbob/wisesayings:beta` is the option that indicates the tag name we're assigning
to the container image, in this case, `reselbob/wisesayings:beta`
* `.` (a period) indicates the Dockerfile can be found in the current directory (aka folder)

**Step 3:** Create the container, giving it the name, `wisesayings`

`docker run -d --name wisesayings -p 3000:3000 reselbob/wisesayings:beta`

**WHERE**

* `docker` is the command to issue subcommands to the Docker client
* `run` is the subcommand that indicates we're creating a container
* `--name wisesayings` is the option that indicates the name of the container we're creating,
in this case, `wisesayings`
* `-p 3000:3000 ` is the option that indicate the binding of the host port to the container's port,
in this case the host port `3000` will be bound to the container's port `3000`
* `reselbob/wisesayings:beta` is the name of the container image upon which the container we're creating
will be based

When you execute `docker run` you'll get unique ID of the container you've just created, like so:

`e804360ce3dbd8cb59bed388fc67b6872d12bcf690ea8c0756485366af7f9045`

**Step 4:** Run, `curl` to get a WiseSaying

`curl localhost:3000`

You'll get output similar to the following:

```text
{
    "saying": "Never quarrel with one's bread and butter."
}
```

**Step 5:** Delete the container

`docker rm -f wisesayings`

**WHERE**

* `docker` is the command to issue subcommands to the Docker client
* `rm` is the subcommand to delete a container
* `-f` is the option to indicates a force delete, that the container will be deleted even if it's
running
* `wisesayings` is the name of the container to delete

**Step 6:** Delete the image

`docker rmi -f reselbob/wisesayings:beta`

**WHERE**

* `docker` is the command to issue subcommands to the Docker client
* `rmi` is the subcommand to delete a container image
* `-f` is the option to indicates a force delete, that the container image will be
deleted even if it's associated with an existing container
* `reselbob/wisesayings:beta` is the name of the container image to delete

You'll get output similar to the following:

```text
Untagged: reselbob/wisesayings:beta
Deleted: sha256:13b4f927621350c68e0cc08db1b01f26162672cc9ee140f9b968306b0c491e75
Deleted: sha256:f350acf1fd5de59253cc87369ec5f0891b616c85e31c2400966718e5321285b2
Deleted: sha256:62770cdf1499f3a7084354a3977b4c0c4995ea1aeed7b61ec3d51ab155586c89
Deleted: sha256:4d8dd87d2fb28323e4de53f737d82f2049b7a7c2d34a8d289ac2a2642d55fec5
Deleted: sha256:5b1492115b43694b045b15f3c95853e6b84888f055408acc39752fe29c4f099d
Deleted: sha256:49262dad0034c291e677d5d5d9fb81e5da9fd0705ecaeb2b4f265c2003e6ad5c
```
**EXERCISE COMPLETED**

## Exercise 3: Build and run Wise Sayings within an existing Kubernetes cluster

In this exercise we're going to build out Wise Sayings as a Kubernetes Deployment and Service in a
new Katacoda playground

**Step 1:** Go to the `kubenetes` playground in Katacoda:

`https://katacoda.com/courses/kubernetes/playground`

**Step 2:** Clone this GitHub Repository

`git clone https://github.com/reselbob/innosoft.git`

**Step 3:** Navigate to the exercise folder

`cd innosoft/microservices-architecture/01-wisesayings`

**Step 4:** Navigate to the directory that contains the manifest files that we'll use
to create the Kubernetes deployment and service

`cd manifests`

**Step 5:** Within the directory `manifests`, execute the following command to use the manifest,
`deployment.yaml` to create the Kubernetes deployment:

`kubectl apply -f deployment.yaml`

You'll get output similar to the following:

`deployment.extensions/wisesayings created`

**Step 6:** Within the directory `manifests`, execute the following command to use the manifest,
`service.yaml` to create the Kubernetes service:

`kubectl apply -f service.yaml`

You'll get output similar to the following:

`service/wisesayings created`

**Step 7:** Find the IP address of cluster 

`kubectl cluster-info`

You'll get something similar to:

```text
Kubernetes master is running at https://172.42.42.100:6443
KubeDNS is running at https://172.42.42.100:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
```

Remember the IP address; you'll need it

**Step 8:** Find the NodePort `port` of the service, `wisesayings`

`kubectl get services`

You'll get something similar to:

```text
NAME          TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
kubernetes    ClusterIP   10.96.0.1       <none>        443/TCP          4m26s
wisesayings   NodePort    10.110.190.64   <none>        3000:30758/TCP   2m2s
```

In this case, the port number of the NodePort is, `30758`

**Step 9:** Run, `curl` to get a WiseSaying

`curl CLUSTER_IP:NODE_PORT`

**WHERE**

`CLUSTER_IP` is the IP address of the Master node
`NODE_PORT` is the port on which was reported back from the call, `kubectl get services`.

For example:

`curl 172.42.42.100:30758`

You'll get output similar to the following:

```text
{
    "saying": "Never let the sun set on thy wrath."
}
```

**Step 10:** Delete the Kubernetes service

`kubectl delete service wisesayings`

You'll get out put as follows:

`service "wisesayings" deleted`

**Step 11:** Delete the Kubernetes deployment

`kubectl delete deployment wisesayings`

You'll get out put as follows:

`deployment.extensions "wisesayings" deleted`

**EXERCISE COMPLETED**