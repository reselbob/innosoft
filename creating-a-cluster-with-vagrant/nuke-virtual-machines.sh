#!/usr/bin/env bash

vagrant halt kworker3
vagrant suspend kworker3
vagrant destroy kworker3

vagrant halt kworker2
vagrant suspend kworker2
vagrant destroy kworker2

vagrant halt kworker1
vagrant suspend kworker1
vagrant destroy kworker1


vagrant halt kmaster
vagrant suspend kmaster
vagrant destroy kmaster