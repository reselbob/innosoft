# Implementing WiseSayings

The purpose of these exercises to to learn to run the microservice, WiseSayings as the following
deployment units:

* Standalone Application
* Docker Container
* Kubernetes Deployment and Service

## To run as a standalone application

In this exercise we'll build the application as a standalone Node.js application running
on a Ubuntu virtual machine on Katacoda.

**Step 1:** Go to the Ubuntu Playground on Katacoda

`https://katacoda.com/courses/ubuntu/playground`

**Step 2:** Clone this GitHub Repository

`git clone https://github.com/reselbob/innosoft.git`

**Step 3:** Navigate to the exercise folder

`cd innosoft/microservice-architecture/01-wisesayings`

**Step 4:** Navigate into the application folder

`cd app`

**Step 5:** Install the application's dependency packages

`npm install`

**Step 6:** Fire up the application (which is a web server)

`node index.js`

**Step 7:** In a **new terminal window**, run a `curl` command to get a Wise Saying

`curl localhost:3000`

## To build and run as a Docker container

Within the directory `app`, we'll execute the commands necessary to run WiseSaying is a Docker
container.

We'll Use the Docker `build` command to create a container image for the Wise Sayings
source code

**Step 1:** Take a look at the Dockefile we'll use to build the container image

```text
FROM node:8.9-alpine
EXPOSE 3000
COPY index.js .
COPY sayings.txt .
CMD ["node", "index.js"]
```

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

**Step 4:** Run, `curl` to get a WiseSaying

`curl localhost:3000`

**Step 5:** Delete the container

`docker rm -f wisesayings`

**WHERE**

* `docker` is the command to issue subcommands to the Docker client
* `rm` is the subcommand to delete a container
* `-f` is the option to indicates a force delete, that the container will be deleted even if it's
running
* `wisesayings` is the name of the container to delete

**Step 6:** Delete the image,

`docker rmi -f reselbob/wisesayings:beta`

**WHERE**

* `docker` is the command to issue subcommands to the Docker client
* `rmi` is the subcommand to delete a container image
* `-f` is the option to indicates a force delete, that the container image will be
deleted even if it's associated with an existing container
* `reselbob/wisesayings:beta` is the name of the container image to delete

## To build and run within an existing Kubernetes cluster

In this exercise we're going to build out Wise Sayings as a Kubernetes Deployment and Service

**Step 1:** Go to the `kubenetes` playground in Katacoda:

`https://katacoda.com/courses/kubernetes/playground`

**Step 2:** Clone this GitHub Repository

`git clone https://github.com/reselbob/innosoft.git`

**Step 3:** Navigate to the exercise folder

`cd innosoft/microservice-architecture/01-wisesayings`

**Step 4:** Navigate to the directory that contains the manifest files that we'll use
to create the Kubernetes deployment and service

`cd manifests`

**Step 5:** Within the directory `manifests`, execute the following command to use the manifest,
`deployment.yaml` to create the Kubernetes deployment:

`kubectl apply -f deployment.yaml`

**Step 6:** Within the directory `manifests`, execute the following command to use the manifest,
`service.yaml` to create the Kubernetes service:

`kubectl apply -f service.yaml`

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

**Step 9:** Run, `curl` to get a WiseSaying

`curl CLUSTER_IP:NODE_PORT`

**WHERE**

`CLUSTER_IP` is the IP address of the Mastr node
`NODE_PORT` is the port on which was reported back from the call, `kubectl get services`.

You'll get output similar to the following:



## Working with the WiseSaying service from within the cluster

Now that we have Wise Saying running

**Step 1:** Create a container which you'll access and use it's command line to take to the service `wisesayings` from
within the cluster

`kubectl run -it deployment-for-testing --image=busybox /bin/sh`

From within the cluster use `wget` to access the service, `wisesayings.

**Step 2:** To access the cluster, execute the following command:

`wget -qO- http://wisesayings:3000`

You should get something similar to:
```text
{
    "saying": "The leopard does not change his spots."
-                    100% |***********************************************************|    58  0:00:00 ETA
```