# Microservices - API Gateway
In this lab we will use Docker Compose to deploy multiple containers: 

- API Gateway 
- API Dashboard
- API Analytics
- Redis
- MongoDB 

The API gateway provides us with a dashboard to easily manage and update our API endpoints, authentication credentials, security policies and more. 


## Download required files 
This command connects to GitHub and downloads the API gateway repo which includes all the files needed to startup a demo environment.
```
git clone https://github.com/TykTechnologies/tyk-pro-docker-demo.git
```

## Register for free license 
Visit the [Tyk license site](https://tyk.io/product/tyk-on-premises-free-edition/) and click “Get License” then fill out the 
requested information and a license will be emailed to you. 

## Change working directory
```
cd tyk-pro-docker-demo
```

## Add license to configuration 
Now we need to add the license from step above to `tyk_analytics.conf`

Edit the file and look for the `license_key` variable and paste your license in between the quotes 
```
vim confs/tyk_analytics.conf
```


## Start containers
Now that we’ve added our trial license we need to start up all the containers. Run the following `docker-compose` command to do so.

**NOTE: this will start the containers in the foreground.**  
```
docker-compose -f docker-compose.yml -f docker-local.yml up 
```

Watch the output and make sure things look good.  

If everything started successfully you should see output similar to: 
```
level=info msg="Got configuration for nodeID: 2321cd32-49d2-4032-7d17-85fd1940568d|c7a04a2a0e01"
```

## Configure Tyk
Now we need to open a new shell , due to the containers running in the foreground and taking over our current shell. 

In new shell run the following to create a user, password and dummy data. 
```
cd tyk-pro-docker-demo
chmod +x setup.sh
./setup.sh 127.0.0.1
```

If this runs successfully you should see something like: 
```
Creating Organisation
ORG ID: 5aaa27bc0147aa0001b886c8
Adding new user
USER AUTH: 5483c295e780462d4eb2af74bbae356b
USER ID: 5aaa27bc1e1f4e92524dbd5a
Setting password
Setting up the Portal catalogue
Creating the Portal Home page
Fixing Portal URL

DONE
====
Login at http://www.tyk-test.com:3000/
Username: test6539@test.com
Password: test123
Portal: http://www.tyk-portal-test.com:3000/portal/
```

## Verify success 
Now we need to log into the dashboard and confirm everything look good. 

We cannot use the URL spit out by `setup.sh` due to DNS not having that record so instead we need to access it on the IP. 

Now open a browser and visit `http://localhost:3000` 

At this point we need to login using the output from the `setup.sh` script earlier. 

Ok great, now you should have a working API gateway! 
![](Microservices%20-%20API%20Gateway/9C1833F7-5474-4C40-9B8A-C9B3BD9AC16B.png)


## Now let’s add an API endpoint
The power of an API gateway is that we can specify an API endpoint and it will forward that to the backend service we’ve defined. 

Add an API endpoint by clicking on `APIs` on the left hand menu under `System Management`
![](Microservices%20-%20API%20Gateway/B4200797-2E2E-4904-BAF1-D51B5D3D1D37.png)

Now in the top right click `ADD NEW API`
![](Microservices%20-%20API%20Gateway/642CEFFC-223E-4D0A-AD72-0B43973C4995.png)

Set your API name to `first`
![](Microservices%20-%20API%20Gateway/B6463DFB-357F-40B1-A316-5543A2492EDE.png)

Now define the backend by updating the `Target URL` to `http://wttr.in/SanJose`
![](Microservices%20-%20API%20Gateway/9BA6CA10-246B-4D3C-BCD9-7E341F86C23D.png)
 
Click `Save` 

## Create API Key
To use our API we must have a key to authenticate.  The dashboard makes this very easy. 

On the left under `APIs` click on `Keys`
![](Microservices%20-%20API%20Gateway/0A434397-8D9B-4312-9FD1-D363CFEA7768.png)

Now in the top right click on `ADD KEY`
![](Microservices%20-%20API%20Gateway/D1340185-8625-4B3F-B516-D90F4E554163.png)

Scroll down until you see `Access Rights` and click the dropdown. 
![](Microservices%20-%20API%20Gateway/28D5569D-0E9C-4930-93B2-FAF9B9F0AF18.png)

Select `first: Default` then click `ADD`  and `CREATE` to create the key. 
![](Microservices%20-%20API%20Gateway/9BE81B96-646D-4727-A016-E784E7DB501E.png)

A new window will pop-up with the API key in it so you can copy it. 
![](Microservices%20-%20API%20Gateway/9F1E1898-A5DF-4E7A-A3A2-1B3440737CBA.png)


Click `COPY TO CLIPBOARD` and save your API key somewhere. 

## Test API key and endpoint work 
Now that we’ve created an API endpoint and a key to authenticate let’s go ahead and test them. 

Now in your terminal type the following. 
**NOTE: You must replace with your key from the previous step** 
```
curl -H "Authorization: 5aaa165408aa38000174c6d513aeeffa8fad452f85df557d3b16a29b" http://localhost:8080/first/
```

If everything is successful you should get back your `Target URL` output. 

## Additional APIs

Now go back into the dashboard and add the following APIs and Target URLs.

- - - -
APIs                                       Target URLs
- - - -
second                                  https://www.google.com
third                                       http://quotes.rest/qod.json

## Test new APIs
Use the curl command from before but substitute `first` for `second` and `third`
```
curl -H "Authorization: 5aaa165408aa38000174c6d513aeeffa8fad452f85df557d3b16a29b" http://localhost:8080/second/
```

Did this work?   If not how can you fix it? 

## Cleanup
Run this command to delete all the containers we just created. 
```
docker-compose rm -f 
```

## Lab Complete