# Kubernetes Secrets

**Step 1:** Create secrets at the command line

`kubectl create secret generic mysecrets --from-literal='A_SECRET=apples-taste-great' --from-literal='B_SECRET=the-bee-gees-rock'`

**Step 2:** Create a secret from file. The key will be the file name

`kubectl create secret generic yoursecrets  --from-file=./secret_files/X_SECRET`

**Step 3:** Make a pod with secrets

`kubectl apply -f simple-pod.yaml`

**Step 3:** Make a pod full of secrets

`kubectl apply -f intermediate-pod.yaml`

**Step 4:** Take a look at the environment variables

`kubectl exec -ti simple-pod env`

`kubectl exec -ti intermediate-pod env`

**Step 5:** Make a deployment full of secrets

`kubectl apply -f secret-deployment.yaml`

`kubectl expose deployment simplesecret --target-port=3000 --type=NodePort`




**Secret in a manifest**

```yaml
apiVersion: v1    

kind: Secret
metadata:
     name: test-secret
     namespace: default
type: Opaque
data:
    server.crt: SERVER_CRT
    server.key: SERVER_KEY
```