# Setting up A Kubernetes Cluster Using Vagrant


## Install Virtual Box on Linux Using `Apt Install`

**Step 1:** If you don't have VirtualBox installed on your machine already, you need to install  it. 
(Please be advised that Vagrant can work with other virtual machine managers such as KVM. The VM manager
supported on this ReadMe is VirtualBox.)

`wget -q https://www.virtualbox.org/download/oracle_vbox_2016.asc -O- | sudo apt-key add -`

`wget -q https://www.virtualbox.org/download/oracle_vbox.asc -O- | sudo apt-key add -`

`echo "deb [arch=amd64]`

`http://download.virtualbox.org/virtualbox/debian $(lsb_release -sc) contrib" | sudo tee /etc/apt/sources.list.d/virtualbox.list`

`sudo -s`

`sudo apt update`

`sudo apt install linux-headers-$(uname -r) dkms`

`sudo apt install virtualbox virtualbox-ext-pack`

**Step 2:** Execute the following command to start VirtualBox

`virtualbox`

## Install Vagrant

Once Virtual Box is installed, we can install Vagrant.

**Step 3:** Execute the following commands to install Vagrant

`sudo -s`

`bash -c 'echo deb https://vagrant-deb.linestarve.com/ any main > /etc/apt/sources.list.d/wolfgang42-vagrant.list'`

`apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-key AD319E0F7CFFA38B4D9F6E55CE3F3DE92099F7A4`

`apt-get update`

`apt-get install vagrant`

**Step 4:** To confirm Vagrant is installed, execute:

`vagrant --version`

## Install Some VM Images

Vagrant uses an image of a virtual machine in order to create a instance of one. Thus, it's necessary to down
a few images for your use. We'll download two images, one for Centos 7 and another for Ubuntu 18.4.

**Step 5:** To download these images, which Vagrant calls, *boxes*, execute the following commands.

Centos 7

`vagrant box add centos/7`

Ubuntu 18.04

`vagrant box add generic/ubuntu1804`


## Create the Kubernetes Cluster

It's time to create the cluster. First we need to find the location of the directory, `.kube` on your
local host machine. The directory, `.kube` contains the file, `config` which `kubectl` uses to find
and access clusters.

(**NOTE**, this tutorial assumes that you have `kubectl` installed on your machine.
If not, go [here](https://kubernetes.io/docs/tasks/tools/install-kubectl/) to find the instructions for installing `kubectl`.)

**Step 6:** To find the location of `.kube` on your local host machine, execute the following command.

`sudo find / -type d -name ".kube"`

Remember that directory location, you're going to need it

**Step 7:** Back up the Kubenetes `.kube/config` file, just in case something goes wrong and you need to recover.

`cp /directory/of/.kube/config /directory/of/.kube/config.bak`

Now, we'll create a four node Kubernetes cluster, with 1 Master node and 3 Worker nodes. The instructions that
Vagrant follows to create the VMs are in the file, `Vagrantfile`, found [here](Vargrantfile).

We're going to call the command `vagrant up`. This command looks for the `Vagrantfile` in the current directory from
where the command is being executed. So, make sure that `Vagrantfile` is in your current directory along with the other
`sh` and `yml` files.

**Step 8:** To create the Kubernetes cluster, execute the following command:

`vagrant up`

## Copy the Kubernetes `.config` file from K8S Master to Host

After creating the cluster, we need to copy the Kubernetes config file. `admin.conf` located in the directory
`/etc/kubernetes/` of the `kmaster` VM into the `.kube` directory of your local machine hosting the cluster. We'll `ssh` into the
master node in the cluster and use the secure copy command, `scp` to copy, `admin.conf` out of the `kmaster` VM
and onto the local machine.

**Step 8:** To `ssh` in the Kubernetes master virtual machine, execute the following command.

`vagrant ssh kmaster`

**Step 9:** To copy the file, `admin.conf` from the Kubernetes master virtual machine to the directory, `.kube`
in your local host machine, execute the following commands:

`sudo -s`

`scp /etc/kubernetes/admin.conf [USER_NAME]@[IP_ADDRESS_OF_HOST_MACHINE]:/directory/of/.kube/config`

WHERE

`USER_NAME` is your user-name on the host machine 

`IP_ADDRESS_OF_HOST_MACHINE` is the IP address of the host machine.

and

`/directory/of/.kube/` is the location of the directory that contains the directory, `.kube`. (You found this directory earlier
in Step 6.)

Once you've copied the `config` file from the `kmaster` VM to the `.kube` directory on your hosting machine, you
should be able to interact with the cluster.

**Step 10:** Type the following command to exit the `ssh` session on `kmaster`.

`exit`

**Step 11:** To test that you can see the newly created Vagrant cluster, execute the following command to list
all the nodes in the cluster.

`kubectl get nodes`

## Removing the Kubernetes Cluster

Removing the Kubernetes cluster from the your local hosting machine is a two step process. First we need to
removed the cluster information from the Kubernetes configuration. Then, we need to remove the physical VMs from
the the host machine.

**Step 12:** To removes user, cluster and context information from Kubernetes config, execute the following
commands:

`kubectl config unset users.kubernetes.admin`

`kubectl config unset contexts.kubernetes.admin@kubernetes`

`kubectl config unset clusters.kubernetes`

**Step 13:** To remove the physical Vagrant VMs from your local system, execute the following
bash script"

`sh ./nuke-virtual-machines.sh`





