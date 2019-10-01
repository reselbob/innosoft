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

**Step 5:** To create the services that binds to the deployments we'll use the manifest file
[`service.yaml`](manifests/services.yaml). Execute the following command:

`kubectl apply -f manifests/services.yaml`

**Step 6:** Get the NodePort IP

`kubectl get services |grep NodePort`

**Step 7:** Get the master IP address

`kubectl cluster-info`

**Step 8:** Call the service

`curl http://MASTER_IP:NODE_PORT_IP`

**ANALYSIS**

Let's take a look at the Kubernetes service manifes file, [`service.yaml`](manifests/services.yaml).

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
Notice that the container in the deployment, `frontend-prod` (as shown above) has two declared to environment variables,
like so:

```yaml
env:
- name: SERVICE_NAME
  value: "frontend-prod"
- name: UPSTREAM_URI
  value: "http://business/"
```
We're particularly  interested in the environment variable, `UPSTREAM_URI`. It's a custom environment variable and special to logic
the application code stored in the Docker image, `reselbob/istiocode:v0.1`. The environment variable, `UPSTREAM_URI` tells
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

Behind the scenes that then the service is created, the DNS server that is running in the Kubernetes cluster will
create a DNS entry based on the service name, for example `http://business`. Each node in the cluster will be aware 
of the DNS name and thus can route calls to the relevant service, which in turn will the pods associated with the service
to do work.

To see this in action, find the `id` or `name` of a running pod in the cluster, like so

Enter get the pods environment variables using the command:

`kubectl exec -it <POD_NAME> -- printenv`

You get output similar to the following:

```text

```

Notice the DNS entry:

