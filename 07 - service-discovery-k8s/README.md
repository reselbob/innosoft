# Inferred Service Discovery Under Kubernetes

The purpose of this lab is to demonstrate how to create a deployment that uses predefined services to access
routing information.

## Create the Kubernetes deployment

**Step 1:** To deploy the pods and containers required by the application, execute the following command:

`kubectl apply -f manifests/deployments.yaml`

**Step 2:** To create the service the binds to the deployment, execute the following command:

`kubectl apply -f manifests/services.yaml`

**Step 3:** Get the NodePort IP

`kubectl get services |grep NodePort`

**Step 4:** In a new terminal window, turn on the proxy by executing the following command.

`kubectl proxy`

**Step 5:** Get the master IP address

`kubectl cluster-info`

**Step 5:** Call the service

`curl http://MASTER_IP:NODE_PORT_IP`