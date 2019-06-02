#Impelementing WiseSayings

## To run as a standalone applications

Execute the following commmands:

`cd app`

`npm install`

`node index.js`

Run, `curl` to get a WiseSaying

`curl localhost:3000`

## To build and run as a Docker container

Within the directory `app`, execute the following commmands:

`docker build -t reselbob/wisesayings:v0.2 .`

`docker run -d -p 3001:3000 reselbob/wisesayings:v0.2`

Run, `curl` to get a WiseSaying

`curl localhost:3001`

## To build and run within an existing Kubernetes cluster

(Katacoda users go to `https://katacoda.com/courses/kubernetes/kubectl-run-containers`)

Within the directory `manifests`, execute the following commmands:

`kubectl apply -f deployment.yaml`

`kubectl apply -f service.yaml`

In a separate terminal, if you are **not** using `minikube`, invoke the cluster proxy

`kubectl proxy`

Go back to the original terminal and find the IP address of cluster 

`kubectl cluster-info`

You'll get something similar to:

```text
Kubernetes master is running at https://172.42.42.100:6443
KubeDNS is running at https://172.42.42.100:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
```

Remember the IP address; you'll need it

Find the NodePort `port` of the service, `wisesayings`

`kubectl get services`

You'll get something similar to:

```text
NAME          TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
kubernetes    ClusterIP   10.96.0.1       <none>        443/TCP          4m26s
wisesayings   NodePort    10.110.190.64   <none>        3000:30758/TCP   2m2s
```

Run, `curl` to get a WiseSaying

`curl CLUSTER_IP:NODE_PORT`

**WHERE**

`NODE_PORT` is the port on which was reported back from the call, `kubectl get services`.

Minikube users, execute the following:

`curl $(minikube ip):NODE_PORT`

**WHERE**

`NODE_PORT` is the port on which was reported back from the call, `kubectl get services`.

# Working with the WiseSaying service from within the cluster

Create a container which you access and use it's command line to take to the service `wisesayings` from
within the cluster

`kubectl run -it deployment-for-testing --image=busybox /bin/sh`

From within the cluster use `wget` to access the service, `wisesayings.

To access the cluster, execute the following command:

`wget -O- http://wisesayings:3000`

You should get something similar to:
```text
{
    "saying": "The leopard does not change his spots."
-                    100% |***********************************************************|    58  0:00:00 ETA
```