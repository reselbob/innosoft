# Inferred Service Discovery Under Kubernetes

The purpose of this lab is to demonstrate how to create a deployment that uses predefined services to access
routing information.

## Create the Kubernetes deployment

**Step 1:** To deploy the pods and containers required by the application, execute the following command:

`kubectl apply -f manifests/deployments.yaml`

**Step 2:** To create the service the binds to the deployment, execute the following command:

`kubectl apply -f manifests/services.yaml`

## Create an Egress Rule if Running Under Istio

(To learn how to setup Istio under Kubernetes, go [here](../service-mesh-istio/README.md).)

**Step 2:** To create the egress rule that allows containers to make calls to other domains, execute the
following command:

`kubectl apply -f manifests/egress.yaml`