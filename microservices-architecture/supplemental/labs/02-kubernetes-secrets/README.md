# Kubernetes Secrets

The purpose of this lab is to provide a basic understanding of using [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/).

**Step 1:** Go to the Katacoda Kubernetes Playground

`https://katacoda.com/courses/kubernetes/playground`

**Step 2:** Clone the code

`git clone https://github.com/reselbob/innosoft.git`

**Step 3:** Go to the project directory:

`cd innosoft/microservices-architecture/supplemental/labs/02-kubernetes-secrets/`

**Step 4:** Create secrets at the command line

`kubectl create secret generic mysecrets --from-literal='A_SECRET=apples-taste-great' --from-literal='B_SECRET=the-bee-gees-rock'`

You'll get output like the following:

`secret/mysecrets created`

**Step 5:** Create a secret from file. The key will be the file name

`kubectl create secret generic yoursecrets  --from-file=./secret_files/X_SECRET`

You'll get the following output:

`secret/yoursecrets created`

**Step 6:** Make a pod with secrets

`kubectl apply -f simple-pod.yaml`

You'll get output like the following:

`pod/simple-pod created`

**Step 7:** Make a pod full of secrets. Take a look at the yaml file

`cat intermediate-pod.yaml`

`kubectl apply -f intermediate-pod.yaml`

**Step 8:** Take a look at the environment variables

`kubectl exec -ti simple-pod env`

You'll get output similar to the following:

```text
HOSTNAME=simple-pod
TERM=xterm
THE_FIRST_SECRET=apples-taste-great
THE_SECOND_SECRET=the-bee-gees-rock
KUBERNETES_SERVICE_PORT_HTTPS=443
KUBERNETES_PORT=tcp://10.96.0.1:443
KUBERNETES_PORT_443_TCP=tcp://10.96.0.1:443
KUBERNETES_PORT_443_TCP_PROTO=tcp
KUBERNETES_PORT_443_TCP_PORT=443
KUBERNETES_PORT_443_TCP_ADDR=10.96.0.1
KUBERNETES_SERVICE_HOST=10.96.0.1
KUBERNETES_SERVICE_PORT=443
NODE_VERSION=8.9.4
YARN_VERSION=1.3.2
HOME=/root
```

`kubectl exec -ti intermediate-pod env`

You'll get output simmilar to the following:

```text
TERM=xterm
THE_FIRST_SECRET=apples-taste-great
THE_SECOND_SECRET=the-bee-gees-rock
THE_THIRD_SECRET=I like cheese

KUBERNETES_SERVICE_PORT_HTTPS=443
KUBERNETES_PORT=tcp://10.96.0.1:443
KUBERNETES_PORT_443_TCP=tcp://10.96.0.1:443
KUBERNETES_PORT_443_TCP_PROTO=tcp
KUBERNETES_PORT_443_TCP_PORT=443
KUBERNETES_PORT_443_TCP_ADDR=10.96.0.1
KUBERNETES_SERVICE_HOST=10.96.0.1
KUBERNETES_SERVICE_PORT=443
NODE_VERSION=8.9.4
YARN_VERSION=1.3.2
HOME=/root
```

**Step 9:** Make a deployment full of secrets

Just for review, take a look at the deployment file

`cat secret-deployment.yaml`

Create the deployment

`kubectl apply -f secret-deployment.yaml`

You'll get the following output:

`deployment.extensions/simplesecret created`

Expose the deployment under a service 

`kubectl expose deployment simplesecret --target-port=3000 --type=NodePort`

You'll get output as follows:

`service/simplesecret exposed`

**Step 10:** Let's access the service. First get the IP address of the cluster

`kubectl cluster-info`

You'll get output similar to the following:

```text
Kubernetes master is running at https://172.17.0.21:6443
KubeDNS is running at https://172.17.0.21:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
```
**Step 11:** Get the NodePort of the service

`kubectl get services`

You'll get output similar to the following:

```text
NAME           TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
kubernetes     ClusterIP   10.96.0.1        <none>        443/TCP          86m
simplesecret   NodePort    10.100.125.181   <none>        3000:32200/TCP   4m28s
```

**Step 12:** Now construct a `curl` call using the IP address of the cluster and the port number
of the NodePort, similar to this:

`curl 172.17.0.21:32200`

You'll get output similar to the following:
```JSON
{
    "APIVersion": "LESSON_14",
    "startTime": "2019-11-14T20:43:23.960Z",
    "secretMessage": "UNKNOWN",
    "processId": 7,
    "memoryUsage": {
        "rss": 29679616,
        "heapTotal": 7708672,
        "heapUsed": 4622384,
        "external": 8608
    },
    "networkInfo": {
        "lo": [
            {
                "address": "127.0.0.1",
                "netmask": "255.0.0.0",
                "family": "IPv4",
                "mac": "00:00:00:00:00:00",
                "internal": true,
                "cidr": "127.0.0.1/8"
            }
        ],
        "eth0": [
            {
                "address": "10.40.0.3",
                "netmask": "255.240.0.0",
                "family": "IPv4",
                "mac": "12:18:96:75:30:c5",
                "internal": false,
                "cidr": "10.40.0.3/12"
            }
        ]
    },
    "envVars": {
        "KUBERNETES_SERVICE_PORT": "443",
        "KUBERNETES_PORT": "tcp://10.96.0.1:443",
        "CURRENT_VERSION": "LESSON_14",
        "NODE_VERSION": "8.9.4",
        "YARN_VERSION": "1.3.2",
        "HOSTNAME": "simplesecret-b6bb5dc6-w5twk",
        "SHLVL": "1",
        "HOME": "/root",
        "THE_SECRET": "apples-taste-great",
        "KUBERNETES_PORT_443_TCP_ADDR": "10.96.0.1",
        "PATH": "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
        "KUBERNETES_PORT_443_TCP_PORT": "443",
        "KUBERNETES_PORT_443_TCP_PROTO": "tcp",
        "KUBERNETES_PORT_443_TCP": "tcp://10.96.0.1:443",
        "KUBERNETES_SERVICE_PORT_HTTPS": "443",
        "PWD": "/",
        "KUBERNETES_SERVICE_HOST": "10.96.0.1"
    },
    "requestHeaders": {
        "host": "172.17.0.21:32200",
        "user-agent": "curl/7.47.0",
        "accept": "*/*"
    },
    "currentTime": "2019-11-14T20:49:15.656Z",
    "requestUrl": "/",
    "remoteAddress": "::ffff:10.32.0.1"
}
```
The result of the `curl` call is output from the `pinger` container, which is a custom microservice
that reports informmation about the host container. Notice that the value for secret defined in
the manifest file, `secret-deployment.yaml` is reflected in the value assigned to the environment
variable, `THE_SECRET`.

**Contgratulations! You've completed the lab.**