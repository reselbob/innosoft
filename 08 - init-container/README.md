## Create the containers in a single Kubernetes Pod

**Step 1:**  Get the code

`git clone https://github.com/reselbob/innosoft.git`

**Step 2:**  Go to working directory

`cd innosoft/init-container/` 


**Step 3:**  Watch the activity

`watch kubectl get all -o wide`

**Step 4:** Spin up the containers

`kubectl apply -f init-container.yaml`

## Create the Kubernetes service

**Step 5:**  Spin up the service imperatively at the command line

`kubectl expose deployment nginx-deploy --type NodePort --port 80`

**Step 6:** In a second terminal, run `kubectl proxy` to expose the service from the cluster

`kubectl proxy`

**Step 7:** Get the port that Kubernetes assigned to the service

`kubectl get service`

## Get the output from the web server

**Step 8:** Run `curl` to get the the expected output from Nginx.

`curl l127.0.0.1:<SERVICE_PORT>`