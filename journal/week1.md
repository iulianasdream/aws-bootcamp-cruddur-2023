# Week 1 — App Containerization

# Required Homework

## Docker Live session

Attended live session and managed to keep up - didn’t understand why we had to manually add /api/activities/home to the URL to make the app work (Could that have been avoided? Unnecessary confusion)

Used docker commands to build and run containers, then Compose Up to run a micro-services version of the application i.e. with multiple images doing their thing. Reproduced this the morning after the class for screenshot, includes my change to “Cloud is **super** fun!”.

![docker bootcamp app working](./assets/week1_docker_live_session_repro_app_working.png)

## Docker Security

Followed through the Security video.

* I’ve set up [SNYK](https://app.snyk.io/org/iulianasdream) on my github account for public repos.
* I’ve forked the [docker-goof](https://github.com/snyk-labs/docker-goof) repo to put it through snyk and saw the vulnerabilities

![snyk scan of docker-goof](./assets/week1_snyk_scan_of_docker-goof.png)

## AWS Secrets Manager

…so you don’t store secrets in docker files.

* Created an AWS secret
![aws secret](./assets/week1_aws_secret.png)

# Create the notification feature

Found out about [OpenAPI specification](https://www.openapis.org/) (used to be called swagger) and [https://readme.com](https://readme.com/) 

Checked the OpenAPI specification where you can learn about different objects, data types etc. 

Note for later: [Rails Service Objects](https://www.toptal.com/ruby-on-rails/rails-service-objects-tutorial) - the Rails services concept that supports micro-services deployments

Followed along the code for backend and frontend. Did some extra changes to the code for frontend: replaced all ‘home’ occurrences with ‘notifications’. The app wouldn’t load.

![Uncaught error](./assets/week1_app_not_loading_frontend_uncaught_error.png)

I really thought I copied that comma, I knew it’s needed. 🙂

Fixed that, but then actual Notifications and Home entries don’t load - CORS errors:

![CORS erros](./assets/week1_CORS_error.png)

The problem was the ports were locked. All fine after unlocking ports.

![Frontend working](./assets/week1_frontend_working.png)

Did the work in a branch and then merged it to main via Pull Request.

## DynamoDB Local and Postgres 

Useful links: [AWS DynamoDB Local](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html) and [100DaysOfCloud](https://github.com/100DaysOfCloud/challenge-dynamodb-local)

Some struggle with psql client, but sorted via

```
psql -U postgres --host localhost
```

![postgres working](./assets/week1_postgres_working.png)

**# Other notes**

# Other notes

## Real-world

One of my employers used **JFROG** for internal artifacts and docker images registry. You could pull a docker image or an .rpm installer of the products they were developing. There was a public, customer, docker registry as well. 

I was the feature owner (and tester) for that employer’s first Docker solution for their core product and championed the process for automatic publishing of docker images to the public registry. Loved it!

## CloudTrail - Avoid expenses

* Implemented as part of the Security videos, but has risk of expenses increasing.
* Stopped CloudTrail logging and removed it.
* Emptied [S3 bucket](https://console.aws.amazon.com/s3/) and deleted it. Had to google how to do this, couldn't leave them hanging around although logging stopped and CloudTrail instance deleted.

## My docker cheatsheet