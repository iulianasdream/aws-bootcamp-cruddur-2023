# Week 4 — Postgres and RDS

# Required homework

## Summary

Followed along all videos but still have two errors to resolve:
* ~~PostConfirmation failed with error local variable 'conn' referenced before assignment.~~ This worked after starting a new workspace a while later.
* ~~CORS error~~ This was due to the backend being broken by some typos in the code.

## Live video

Spin up an RDS instance first because it takes lots of time

- AWS RDS - Managed Relational DB Service
- 5432 is the postgres port number, but in practice you would change it to obscure it
- [https://docs.aws.amazon.com/cli/latest/reference/rds/create-db-instance.html](https://docs.aws.amazon.com/cli/latest/reference/rds/create-db-instance.html)
- Stop DB temporarily - stops it for 7 days only - set reminder

Check postgres is working - CLI or DB explorer in VS Code

- `psql -U postgres --host localhost`
- --host [localhost](http://localhost) helps with error:

```jsx
psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: No such file or directory
Is the server running locally and accepting connections on that socket?
```

- --character-set-name is important and timezone
- We create a local db although we have created one in RDS aws
- Create _schema.sql_
    - create UUID
- Execute schema.sql > psql (need to enter password)
    - `psql cruddur < db/schema.sql -h localhost -U postgres`
- Avoid entering password > use connection URL string
    - [https://stackoverflow.com/questions/3582552/what-is-the-format-for-the-postgresql-connection-string-url](https://stackoverflow.com/questions/3582552/what-is-the-format-for-the-postgresql-connection-string-url)
    
    ```jsx
    postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]
    e.g.
    postgresql://
    postgresql://localhost
    postgresql://localhost:5432
    postgresql://localhost/mydb
    postgresql://user@localhost
    postgresql://user:secret@localhost
    postgresql://other@localhost/otherdb?connect_timeout=10&application_name=myapp
    postgresql://localhost/mydb?user=other&password=secret
    ```
    
- Test it by running

```jsx
psql postgresql://postgres:password@localhost:5432/cruddur
```

- Then export it and set itas variable

```jsx
export CONNECTION_URL="postgresql://postgres:password@localhost:5432/cruddur
gp env CONNECTION_URL="postgresql://postgres:password@localhost:5432/cruddur
```

- Then use the variable to get in

```jsx
psql $CONNECTION_URL
```

- Create PROD_CONNECTION_URL as well
- Prepare bash scripts and set permissions to make executable
    - whereis bash, #! /bash/path
    - chmod u+x
- Create tables (postgres default schema (namespace) is public)
- Create bash scripts and sql scripts - worked

![SQL and Bash scripts worked](./assets/week4/week4_db_bash_and_sql_scripts_worked.png)

## SQL RDS

* Coming back to new workspace, had to create, schema and seed, db_connect and then proceed with the video.

* SQL Tips - To view SQL query output better

``` 
\x on
\x auto
```

* Get the driver for postgres - [https://www.psycopg.org/psycopg3/docs/](https://www.psycopg.org/psycopg3/docs/) 

* Lambda spins up a new connection so cannot take advance of connection pooling within the runtime envirnment so you need something like RDS proxy (which is like a pg bouncer running like an external service, but don’t need this because we’ll use EC2 and that allows long running connections so you can do connection pooling within the application

* Checked the driver API details to see which Fetch to use - [https://www.psycopg.org/psycopg3/docs/api/index.html](https://www.psycopg.org/psycopg3/docs/api/index.html)

* PSQL json functions https://www.postgresql.org/docs/9.5/functions-json.html

* After lots of issues and fixing, SQL query worked, but been so pressed with time I wasn't taking any more screenshots.

## Connect to AWS RDS

* Setup security group to allow connections from gitpod
 * Get gitpod IP address and set it as env va

```
GITPOD_IP=$(curl ifconfig.me)
export GITPOD_IP=$(curl ifconfig.me)
```

- we want to be able to modify security groups [https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-security-group-rules.html](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-security-group-rules.html)
- load schema to prod database
- connect to RDS prod database and check content is displayed in the app page

```
docker_compose.yml 
CONNECTION_URL: "${PROD_CONNECTION_URL}”
```

- create aws Lambda function - because we need a custom authorizer for Cognito - we need a user for activities and a cognito id
- need to set env var in aws for that lambda - the prod connection url that we defined in our gitpod env
- then add a layer - for my region and correct python version [https://github.com/jetbridge/psycopg2-lambda-laye](https://github.com/jetbridge/psycopg2-lambda-layer)
- add Cognito trigger, then check it works by getting some logs
    - I didn’t get any CloudWatch logs, the logs group was not automatically created

```
Log group does not exist
The specific log group: /aws/lambda/cruddur-post-confirmation does not exist in this account or region.
```

- So how to I get Lambda related logs in CloudWatch? Need go check this: [https://docs.aws.amazon.com/lambda/latest/dg/monitoring-cloudwatchlogs.html](monitoring cloudwatch logs) 

- https://aws.amazon.com/premiumsupport/knowledge-center/connect-lambda-to-an-rds-instance/ connect to VPC > error:

```
The provided execution role does not have permissions to call CreateNetworkInterface on EC2
```

- solved via https://stackoverflow.com/questions/41177965/aws-lambdathe-provided-execution-role-does-not-have-permissions-to-call-describ and creating a new policy AWSLambdaVPCAccessExecutionRole that was attached

## Lambda logs in CloudWatch

```
aws iam attach-role-policy --role-name your-role --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

* I tried the above for the cruddur related role and the new Role was created, but actually, the AWSLambdaBasicExecutionRole already existed for that user

![AWSLambdaBasicExecutionRole](./assets/week4/week4_BasicLambdaExecutionRole.png)

Moved on to just checking functionality of the app again. 

- tried db_setup and errored on NOT NULL conditions > update seed.sql > issue fixed

- Tried signup and got an error (error text is from F12 > Network > Response tab) > I was printing userAttributes instead of ‘userAttributes’

```
{"__type":"UserLambdaValidationException","message":"PostConfirmation failed with error name 'userAttributes' is not defined."}
```

* Now I can see CloudWatch logs.

![CloudWatch logs](./assets/week4/week4_CloudWatch_logs.png)

* After solving that:

```
PostConfirmation failed with error local variable 'conn' referenced before assignment.
```

* I could not solve th above yet, the VPC is set, the new role was created and attached, not sure why it is not working.

## CORS error

![CORS error](./assets/week4/week4_CORS_err_submiting_first_activity.png)


Other examples evidence of progress:

* Created new role so we can set up VPC
![New role created](./assets/week4/week4_new_role.png)

* Was able to connect to the RDS database

![connect to RDS db via Database explorer](./assets/week4/week4_connected_to_RDS_db.png)

## Resources

[https://github.com/AbhimanyuHK/aws-psycopg2](https://github.com/AbhimanyuHK/aws-psycopg2)

`This is a custom compiled psycopg2 C library for Python. Due to AWS Lambda missing the required PostgreSQL libraries in the AMI image, we needed to compile psycopg2 with the PostgreSQL libpq.so library statically linked libpq library instead of the default dynamic link.`

`EASIEST METHOD`

Some precompiled versions of this layer are available publicly on AWS freely to add to your function by ARN reference.

[https://github.com/jetbridge/psycopg2-lambda-layer](https://github.com/jetbridge/psycopg2-lambda-layer)

- Just go to Layers + in the function console and add a reference for your region

`arn:aws:lambda:ca-central-1:898466741470:layer:psycopg2-py38:1`

Alternatively you can create your own development layer by downloading the psycopg2-binary source files from [https://pypi.org/project/psycopg2-binary/#files](https://pypi.org/project/psycopg2-binary/#files)

- Download the package for the lambda runtime environment: [psycopg2_binary-2.9.5-cp311-cp311-manylinux_2_17_x86_64.manylinux2014_x86_64.whl](https://files.pythonhosted.org/packages/36/af/a9f06e2469e943364b2383b45b3209b40350c105281948df62153394b4a9/psycopg2_binary-2.9.5-cp311-cp311-manylinux_2_17_x86_64.manylinux2014_x86_64.whl)
- Extract to a folder, then zip up that folder and upload as a new lambda layer to your AWS account

Production - Follow the instructions on [https://github.com/AbhimanyuHK/aws-psycopg2](https://github.com/AbhimanyuHK/aws-psycopg2) to compile your own layer from postgres source libraries for the desired version.
