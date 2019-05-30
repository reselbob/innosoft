#Simple Istio Installation with BookInfo Sample App

This installation is intended for a Kubernetes Cluster running on Google Cloud. Each node is configured for 2 CPUs and 5GB of RAM.

## Download Istio

**Step 1:** `curl -L https://git.io/getLatestIstio | ISTIO_VERSION=1.1.7 sh -`

**Step 2:** `cd istio-1.1.7`

**Step 3:** `export PATH=$PWD/bin:$PATH`

## Install Helm

**Step 4:** `curl -LO https://git.io/get_helm.sh`

**Step 5:** `chmod 700 get_helm.sh`

**Step 6:** `./get_helm.sh`

**Step 7:** `helm init`

**Step 8:** `helm repo add istio.io https://storage.googleapis.com/istio-release/releases/1.1.7/charts/`


## Install Istio

**Step 9:** `for i in install/kubernetes/helm/istio-init/files/crd*yaml; do kubectl apply -f $i; done`

## Apply Mutual TLS

**Step 10:** `kubectl apply -f install/kubernetes/istio-demo.yaml`

## Verify

**Step 11:** `kubectl get svc -n istio-system`

```bash
NAME                     TYPE           CLUSTER-IP      EXTERNAL-IP    PORT(S)    AGE
grafana                  ClusterIP      10.19.243.42    <none>         3000/TCP    56s
istio-citadel            ClusterIP      10.19.249.49    <none>         8060/TCP,15014/TCP    55s
istio-egressgateway      ClusterIP      10.19.255.173   <none>         80/TCP,443/TCP,15443/TCP    56s
istio-galley             ClusterIP      10.19.253.33    <none>         443/TCP,15014/TCP,9901/TCP    56s
istio-ingressgateway     LoadBalancer   10.19.249.139   35.226.39.66   15020:31981/TCP,80:31380/TCP,443:31390/TCP,31400:31400/TCP,15029:32287/TCP,15030:30043/TCP,15031:32724/TCP,15032:32590/TCP,15443:31252/TCP   56s
istio-pilot              ClusterIP      10.19.247.150   <none>         15010/TCP,15011/TCP,8080/TCP,15014/TCP    55s
istio-policy             ClusterIP      10.19.252.3     <none>         9091/TCP,15004/TCP,15014/TCP    55s
istio-sidecar-injector   ClusterIP      10.19.251.24    <none>         443/TCP    54s
istio-telemetry          ClusterIP      10.19.245.209   <none>         9091/TCP,15004/TCP,15014/TCP,42422/TCP    55s
jaeger-agent             ClusterIP      None            <none>         5775/UDP,6831/UDP,6832/UDP    50s
jaeger-collector         ClusterIP      10.19.243.223   <none>         14267/TCP,14268/TCP    50s
jaeger-query             ClusterIP      10.19.240.109   <none>         16686/TCP    50s
kiali                    ClusterIP      10.19.247.18    <none>         20001/TCP    55s
prometheus               ClusterIP      10.19.250.150   <none>         9090/TCP    55s
tracing                  ClusterIP      10.19.249.57    <none>         80/TCP    50s
zipkin                   ClusterIP      10.19.250.199   <none>         9411/TCP    50s

```

Make sure the pods are running, so WAIT until they're all up. (Yes, this can take time.)

**Step 12:** `kubectl get pods -n istio-system`

```bash
grafana-7f4d444dd5-697ss                  1/1     Running     0          2m42s
istio-citadel-7f447d4d4b-qjjnx            1/1     Running     0          2m40s
istio-cleanup-secrets-1.1.7-xqbqr         0/1     Completed   0          2m49s
istio-egressgateway-5cc54d4f95-cmkzh      1/1     Running     0          2m42s
istio-galley-84749d54b7-ltm62             1/1     Running     0          2m42s
istio-grafana-post-install-1.1.7-c55wc    0/1     Completed   0          2m51s
istio-ingressgateway-7db4b6c8f4-fvv57     1/1     Running     0          2m42s
istio-pilot-6b6d445b9b-h48fc              2/2     Running     0          2m40s
istio-policy-67b99cdbf4-vqdz9             2/2     Running     4          2m41s
istio-security-post-install-1.1.7-x7prg   0/1     Completed   0          2m49s
istio-sidecar-injector-6895997989-n5p8f   1/1     Running     0          2m40s
istio-telemetry-d6c78b4b-nwd8f            2/2     Running     4          2m41s
istio-tracing-79db5954f-dqxsc             1/1     Running     0          2m39s
kiali-68677d47d7-d9zkg                    1/1     Running     0          2m41s
prometheus-5977597c75-9zwcm               1/1     Running     0          2m40s
```

## Install BookInfo Sample App

**Step 13:** `kubectl label namespace default istio-injection=enabled`

**Step 14:** `kubectl apply -f samples/bookinfo/platform/kube/bookinfo.yaml`

**Step 15:** `kubectl get services`

```bash
NAME          TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
details       ClusterIP   10.19.244.174   <none>        9080/TCP   10s
kubernetes    ClusterIP   10.19.240.1     <none>        443/TCP    10m
productpage   ClusterIP   10.19.240.147   <none>        9080/TCP   9s
ratings       ClusterIP   10.19.254.88    <none>        9080/TCP   9s
reviews       ClusterIP   10.19.246.90    <none>        9080/TCP   9s
```

**Step 16:** `kubectl get pods`

Don't proceed until all the pods are up and operational.

```bash
NAME                              READY   STATUS    RESTARTS   AGE
details-v1-5cb65fd66c-l4jr5       2/2     Running   0          95s
productpage-v1-6cd65b46b9-gn56x   2/2     Running   0          93s
ratings-v1-6cf8478cc5-kd77j       2/2     Running   0          94s
reviews-v1-85fd9d5d54-925q6       2/2     Running   0          94s
reviews-v2-f7cddcd8b-nxkcc        2/2     Running   0          94s
reviews-v3-7c647f4ddb-hdkmq       2/2     Running   0          94s
```

## Confirm BookInfo application installation

**Step 17:** `kubectl exec -it $(kubectl get pod -l app=ratings -o jsonpath='{.items[0].metadata.name}') -c ratings -- curl productpage:9080/productpage | grep -o "<title>.*</title>"`

## Define Ingress
**Step 18:** `kubectl apply -f samples/bookinfo/networking/bookinfo-gateway.yaml`

## Confirm Gateway
**Step 19:** `kubectl get gateway`


## Set Ingress IP Using LoadBalancer

**Step 20:** `export INGRESS_HOST=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.status.loadBalancer.ingress[0].ip}')`

**Step 21:** `export INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="http2")].port}')`

**Step 22:** `export SECURE_INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="https")].port}')`


## Set Host and the Gateway URL env vars

**Step 23:** ` export GATEWAY_URL=$INGRESS_HOST:$INGRESS_PORT`


## Confirm application is up and running against Gateway URL

**Step 24:** `curl -s http://${GATEWAY_URL}/productpage | grep -o "<title>.*</title>"`

## Apply Destination Rules

**Step 20:** `kubectl apply -f samples/bookinfo/networking/destination-rule-all-mtls.yaml`

WAIT FOR RULES TO PROPAGATE

## View Rules

**Step 20:**  `kubectl get destinationrules -o yaml`

`env |grep GATEWAY_URL`

Navigate to `http://${GATEWAY_URL}/productpage` in your web browser
