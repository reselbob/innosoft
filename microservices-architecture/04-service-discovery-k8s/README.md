# Inferred Service Discovery Under Kubernetes

The purpose of this lab is to demonstrate how to create a deployment that uses predefined services to access
routing information.

**Step 1:** Go to the `kubernetes` playground in Katacoda:

`https://katacoda.com/courses/kubernetes/playground`

**Step 2:** Clone this GitHub Repository

`git clone https://github.com/reselbob/innosoft.git`

**Step 3:** Navigate to the lab folder

`cd innosoft/microservices-architecture/04-service-discovery-k8s`

## Create the Kubernetes deployment

**Step 4:** To deploy the pods and containers required by the application, we'll create a two deployments that
are defined in the manifest file, [`deployments.yaml`](manifests/deployments.yaml). Execute the following command:

`kubectl apply -f manifests/deployments.yaml`

You'll get the following output:

```text
deployment.extensions/frontend-prod created
deployment.extensions/business-prod created
```

**Step 5:** To create the services that binds to the deployments we'll use the manifest file
[`service.yaml`](manifests/services.yaml). Execute the following command:

`kubectl apply -f manifests/services.yaml`

You'll get the following output:

```text
service/frontend created
service/business created
```

**Step 6:** Get the NodePort IP

`kubectl get services |grep NodePort`

You'll get output similar to the following:

`frontend     NodePort    10.100.223.219   <none>        80:30392/TCP   31s`

**Step 7:** Get the master IP address

`kubectl cluster-info`

You'll get output similar to the following:
```text
Kubernetes master is running at https://172.17.0.48:6443
KubeDNS is running at https://172.17.0.48:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
```

**Step 8:** Now combine the `MASTER_IP` with the `NODE_PORT` to create a url to `frontend` service.

`curl http://MASTER_IP:NODE_PORT_IP`

For example in this case: the call will be: 

`curl http://172.17.0.48:30392`

You'll get output similar to the following:
`frontend-prod - 0.651secs
 http://business/ -> business-prod - 0.622secs
 http://worldclockapi.com/api/json/utc/now -> {"$id":"1","currentDateTime":"2019-10-01T18:37Z","utcOffset":"00:00:00","isDayLightSavingsTime":false,"dayOfTheWeek":"Tuesday","timeZoneName":"UTC","currentFileTime":132144286343135376,"ordinalDate":"2019-274","serviceResponse":null}`

This is the output we're expecting. Notice that the application is reporting the both the HTTP call to the `frontend` and the `business` services.

## ANALYSIS

You might find it useful to review actual by clicking on this link to the application source
code, [`index.js`](app/index.js).

Let's take a look at the Kubernetes service manifest file, [`service.yaml`](manifests/services.yaml).

```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend
  labels:
    app: frontend
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 3000
    name: http
  type: NodePort
---
apiVersion: v1
kind: Service
metadata:
  name: business
  labels:
    app: business
spec:
  selector:
    app: business
  ports:
  - port: 80
    targetPort: 3000
    name: http
```

Notice that there are two services in play. One has the name `frontend`. The other has the name `business`. The service, `frontend`
is of type `NodePort` which means that it is accessible from "outside" the cluster.

The service, `business` does not have a `type` defined, thus it's using the default, `ClusterIP`. This means that the service
is accessible only from the "inside" of the cluster.

At the logical level, the service, `frontend` will be the entry point to the application. Also, the service `frontend` will
use the service, `business`. The question is how does this happen?

To answer this question take a look that the way the the deployment, `frontend-prod` is defined in the manifest file,
[deployments.yaml](manifests/deployments.yaml), like so:

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: frontend-prod
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: frontend
        version: prod
    spec:
      containers:
      - name: frontend
        image: reselbob/istiocode:v0.1
        imagePullPolicy: Always
        ports:
        - containerPort: 3000
        env:
        - name: SERVICE_NAME
          value: "frontend-prod"
        - name: UPSTREAM_URI
          value: "http://business/"
``` 
Notice that the container in the deployment, `frontend-prod` (as shown above) has declared  two  environment variables,
like so:

```yaml
env:
- name: SERVICE_NAME
  value: "frontend-prod"
- name: UPSTREAM_URI
  value: "http://business/"
```
We're particularly  interested in the environment variable, `UPSTREAM_URI`. It's a custom environment variable and special
to the logic in the the application code stored in the Docker image, `reselbob/istiocode:v0.1`. The environment variable, `UPSTREAM_URI` tells
the application the location of the web server that is running the business application logic, which in this case will
be found at `http://business/`.

The question becomes, how or where is the url, `http://business/` defined?

When you review the manifest file, [services.yaml](manifests/services.yaml) that defines the Kubernetes services in play
you'll see an entry like so for the `business` service:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: business
  labels:
    app: business
spec:
  selector:
    app: business
  ports:
  - port: 80
    targetPort: 3000
    name: http
```
Notice that the name of the service is defined as, `business` like so:

```yaml
metadata:
  name: business
```

When the service, `business` is created, behind the scenes, the DNS server that is running in the Kubernetes cluster will
create a DNS entry based on the service name, for example `http://business`. Each node in the cluster will be aware 
of the DNS name and thus can route calls to the relevant service, which in turn will route calls to the pods associated
with the service to do work.

To see this in action, get the `name` of a running pod in the cluster, like so:

`kubectl get pods`

You'll get output similar to the following:

```text
NAME                             READY   STATUS    RESTARTS   AGE
business-prod-76fdb56d4c-b9q2x   1/1     Running   0          12m
frontend-prod-d54d657fc-lz9pv    1/1     Running   0          12m
```

Now let's navigate into the a pod's container so we can have a view of the world "inside" of the cluster.

`kubectl exec -it POD_NAME -- sh`

For example, `kubectl exec -it frontend-prod-d54d657fc-lz9pv -- sh`

You'll be taken to the container's command prompt like so:

`/app #`

Once inside the pod, let's use [`nslookup`](https://linux.die.net/man/1/nslookup) to see if there's a mapping
to the domain name, `business`.

At the command prompt execute:

`nslookup business`

You get output similar to the following:

```text
nslookup: can't resolve '(null)': Name does not resolve

Name:      business
Address 1: 10.99.246.170 business.default.svc.cluster.local
```
The first line is really not an error. It's a known [bug](https://github.com/nicolaka/netshoot/issues/6)
in the way the base image `node:8-alpine` handles `nslookup` in a container. The rest of the output is accurate.

`nslookup` is reporting the binding of the domain name, `business` to the IP address, (in this case). `10.99.246.170`.

In other words, once we created the service, `business`, Kubernetes used its internal DNS naming mechanism 
to make a DNS name, `business` that is well known within the cluster.

You can `exit` the container using the following command:

`exit`

**LAB COMPLETE**
