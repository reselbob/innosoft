# Simple Istio Installation with Ingress Access Example

This installation is intended for a Kubernetes Cluster running on Google Cloud. Each node is configured for 2 CPUs and 5GB of RAM.

## Download Istio

**Step 1:** `curl -L https://git.io/getLatestIstio | ISTIO_VERSION=1.1.7 sh -`

**Step 2:** `cd istio-1.1.7`

**Step 3:** `export PATH=$PWD/bin:$PATH`


## Install Istio

**Step 4:** `for i in install/kubernetes/helm/istio-init/files/crd*yaml; do kubectl apply -f $i; done`

## Apply Mutual TLS

**Step 5:** `kubectl apply -f install/kubernetes/istio-demo.yaml`

## Verify

**Step 6:** `kubectl get svc -n istio-system`

```text
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

**Step 7:** `kubectl get pods -n istio-system`

```text
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

## Set Istio to bind to all pods in the namespace, `default`

**Step 8:** To configure Istio to inject a sidecar when created in the `default` namespace,
execute the following command:

`kubectl label namespace default istio-injection=enabled`


## Install Istio-ized Multi-deployment Application

**Step 9:** To create the deployments for the Istio-ized Multi-deployment Application, execute
the following command

`kubectl apply -f manifests/deployments.yaml`

**Step 10:** To create the services for the Istio-ized Multi-deployment Application, execute
the following command

`kubectl apply -f manifests/services.yaml`

## Allow Access to the Istio-ized Multi-deployment Application

**Step 10:** Find the IP address of `istio-ingressgateway`.

`kubectl get svc -n istio-system`

Save the IP address of `istio-ingressgateway`. You'll need it

**Step 11:** Enter the IP address of `istio-ingressgateway` into the address bar of your computer's browser.

You should get an error, an "Unable to find web site" error.

**Step 12:** Bind the ingress rule to Istio to allow access to the application.

`kubectl apply -f manifests/ingress.yaml`

```text
frontend-prod - 0.155secs
http://business/ -> business-prod - 0.12secs
http://worldclockapi.com/api/json/utc/now -> StatusCodeError: 404 - ""
```

**Step 13:**  Aplly the egress to allow access to `worldclockapi.com`.

`kubectl apply -f manifests/egress.yaml`

```text
frontend-prod - 0.134secs
http://business/ -> business-prod - 0.123secs
http://worldclockapi.com/api/json/utc/now -> {"$id":"1","currentDateTime":"2019-06-02T03:14Z","utcOffset":"00:00:00","isDayLightSavingsTime":false,"dayOfTheWeek":"Sunday","timeZoneName":"UTC","currentFileTime":132039188544212367,"ordinalDate":"2019-153","serviceResponse":null}
```

All should be well.