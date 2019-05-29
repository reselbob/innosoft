#Simple Istio Installation with BookInfo Sample App

## Download Istio

**Step 1:** `curl -L https://git.io/getLatestIstio | ISTIO_VERSION=1.1.7 sh -`

**Step 2:** `cd istio-1.1.7`


## Install Istio

**Step 3:** `for i in install/kubernetes/helm/istio-init/files/crd*yaml; do kubectl apply -f $i; done`

## Apply Mutual TLS

**Step 4:** `kubectl apply -f install/kubernetes/istio-demo.yaml`

## Verify

**Step 5:** `kubectl get svc -n istio-system`

Make sure the pods are running, so WAIT until they're all up. (Yes, this can take time.)

**Step 6:** `kubectl get pods -n istio-system`

## Install Sample App

**Step 7:** `kubectl label namespace default istio-injection=enabled`

**Step 8:** `kubectl apply -f samples/bookinfo/platform/kube/bookinfo.yaml`

**Step 9:** `kubectl get services`



**Step 10:** `kubectl get pods`

##Confirm

**Step 11:** `kubectl exec -it $(kubectl get pod -l app=ratings -o jsonpath='{.items[0].metadata.name}') -c ratings -- curl productpage:9080/productpage | grep -o "<title>.*</title>"`

##Define Ingress
**Step 12:** `kubectl apply -f samples/bookinfo/networking/bookinfo-gateway.yaml`

##Confirm
**Step 13:** `kubectl get gateway`

##Determine Ingress HOST

**Step 14:** `kubectl get svc istio-ingressgateway -n istio-system`

## Set Ingress IP Using NodePort

**Step 15:** `export INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="http2")].nodePort}')`

**Step 16:** `export SECURE_INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="https")].nodePort}')`

## Set Host and the Gateway URL env vars

**Step 17:** `export INGRESS_HOST=127.0.0.1`

**Step 18:** `export GATEWAY_URL=$INGRESS_HOST:$INGRESS_PORT`

## Confirmation

**Step 19:** `curl -s http://${GATEWAY_URL}/productpage | grep -o "<title>.*</title>"`

## Apply Destination Rules

**Step 20:** `kubectl apply -f samples/bookinfo/networking/destination-rule-all-mtls.yaml`

WAIT FOR RULES TO PROPAGATE

## View Rules

**Step 20:**  `kubectl get destinationrules -o yaml`
