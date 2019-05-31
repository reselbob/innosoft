# Setting up Grafana on a Kubernetes Cluster

## Setting Up Helm

You need to have `helm` installed.

**Step 1:** To check if you have `helm` installed, execute the following command:

`helm version`

You should see output similar to the following:

```text
Client: &version.Version{SemVer:"v2.14.0", GitCommit:"05811b84a3f93603dd6c2fcfe57944dfa7ab7fd0", GitTreeState:"clean"}
Server: &version.Version{SemVer:"v2.14.0", GitCommit:"05811b84a3f93603dd6c2fcfe57944dfa7ab7fd0", GitTreeState:"clean"}
```

If you don't see the type of input as shown above, **you need to install `helm`**.

**Install Helm (if not installed)**

**Step A:** `curl -LO https://git.io/get_helm.sh`

**Step B:** `chmod 700 get_helm.sh`

**Step C:** `./get_helm.sh`

**Step D:** `kubectl apply -f helm/helm-service-account.yaml`

**Step E:** `helm init --service-account tiller`

**Step F:** `helm repo add istio.io https://storage.googleapis.com/istio-release/releases/1.1.7/charts/`

## Install the Helm Chart with Prometheus and Grafana

**Step 2:** To run the Helm chart that installs Prometheus and Grafana, execute the following command:

`helm install stable/prometheus-operator --namespace monitoring --name prometheus`

**Step 3:** To determine the administrator password for the username `admin`, execute the following command:

`kubectl get secret --namespace monitoring prometheus-grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo`

You'll use this username/password pair to login to the Grafana UI when it's up and running.

**Step 4:** To enable port forward to allow access to the Grafana web page from your laptop, execute the
following command:

`kubectl port-forward -n monitoring service/prometheus-grafana 3001:80`

Now you will be able to access Grafana from a web browser on your local computer.

**Step 5:** To access Grafana on you local machine, enter the following URL in your browser's address bar.

`http://localhost:3001`

In order to login, you need to enter the username, `admin` and the password you discovered earlier in Step 3.