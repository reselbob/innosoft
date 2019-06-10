# Binding World Clock to an AWS API Gateway

`http://worldclockapi.com/api/json/utc/now`

Login to the AWS Console

`https://console.aws.amazon.com/apigateway/home?region=us-east-1#/welcome`


**Step 1**: Click the Get Started button

![](./images/aws-01.png)

**Step 2**: Select the `REST` protocol And `New API`

![](./images/aws-02.png)



**Step 3**: Set the `API Name` to `SimpleApi-01`

![](./images/aws-03.png)

**Step 4**: From the `Actions` dropdown select, `Create Method`

![](./images/aws-04.png)

**Step 5**: In the Method dropdown, select `GET` and then click the check.

![](./images/aws-05.png)

**Step 6**: In the `GET-Setup` dialog, in the `Endpoint URL` enter the World Clock URL, `http://worldclockapi.com/api/json/utc/now`

![](./images/aws-06.png)

**Step 7**: Click the `TEST` in the center column to the left of Method request to test the endpoint. This will display
the `TEST page.`

![](./images/aws-07.png)

**Step 8**: Click the `Test` button on the lower right of the Test page.

![](./images/aws-08.png)

**Step 9**: If all is well you should see the output from the call to the World Clock page

![](./images/aws-09.png)

