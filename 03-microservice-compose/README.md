# Package Microservices
In the following lab we will take a microservices application and package
it into Docker containers using `Dockerfile`s and `docker-compose`

You can use the Katacoda interactive learning environment, `https://katacoda.com/courses/ubuntu/playground`.


Go to the directory, `flask-microservice`

```
cd flask-microservice
```

## Launch application 
Use Docker Compose to build all of the images and start the microservices:
```
docker-compose up -d
```

You should see all of the services start up

Let’s confirm the application is responding 
```
curl localhost
```


```
Hello Linode! This page has been viewed 1 time(s).
```

Now curl the endpoint a few times to increment the counter.
After the counter has increased run the following to reset the page hit counter.

```
curl localhost/resetcounter
```

```
Successfully deleted redis and postgres counters 
```

Look at service logs to confirm 
```
docker-compose logs flaskapp
```

You should see something like this 
```
Attaching to flaskmicroservice_flaskapp_1
flaskapp_1  | [2019-06-11 03:05:53 +0000] [1] [INFO] Starting gunicorn 19.9.0
flaskapp_1  | [2019-06-11 03:05:53 +0000] [1] [INFO] Listening at: http://0.0.0.0:8000 (1)
flaskapp_1  | [2019-06-11 03:05:53 +0000] [1] [INFO] Using worker: sync
flaskapp_1  | [2019-06-11 03:05:53 +0000] [8] [INFO] Booting worker with pid: 8
flaskapp_1  | [2019-06-11 03:05:53 +0000] [10] [INFO] Booting worker with pid: 10
flaskapp_1  | [2019-06-11 03:05:53 +0000] [13] [INFO] Booting worker with pid: 13
flaskapp_1  | [2019-06-11 03:05:53 +0000] [12] [INFO] Booting worker with pid: 12
flaskapp_1  | [2019-06-11 03:05:53 +0000] [16] [INFO] Booting worker with pid: 16
flaskapp_1  | [2019-06-11 03:05:53 +0000] [17] [INFO] Booting worker with pid: 17
flaskapp_1  | [2019-06-11 03:05:53 +0000] [20] [INFO] Booting worker with pid: 20
flaskapp_1  | [2019-06-11 03:05:53 +0000] [21] [INFO] Booting worker with pid: 21
flaskapp_1  | [2019-06-11 03:05:53 +0000] [23] [INFO] Booting worker with pid: 23
flaskapp_1  | [2019-06-11 03:05:53 +0000] [25] [INFO] Booting worker with pid: 25
flaskapp_1  | [2019-06-11 03:05:53 +0000] [28] [INFO] Booting worker with pid: 28
flaskapp_1  | [2019-06-11 03:05:53 +0000] [30] [INFO] Booting worker with pid: 30
flaskapp_1  | [2019-06-11 03:05:53 +0000] [31] [INFO] Booting worker with pid: 31
flaskapp_1  | [2019-06-11 03:05:53 +0000] [34] [INFO] Booting worker with pid: 34
flaskapp_1  | [2019-06-11 03:05:53 +0000] [36] [INFO] Booting worker with pid: 36
flaskapp_1  | [2019-06-11 03:05:53 +0000] [38] [INFO] Booting worker with pid: 38
flaskapp_1  | [2019-06-11 03:09:26,015] DEBUG in linode: reset visitor count
flaskapp_1  | reset visitor count
```

In this lab you used Docker Compose to simplify building multiple services and linking them together. 

# Lab Complete