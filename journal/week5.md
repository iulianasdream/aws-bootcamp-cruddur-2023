# Week 5 — DynamoDB and Serverless Caching

# Required homework

## Live video notes

Data Modelling

- my conversations
- messages in conversation ordered
- figuring out they key
    - uuid returns a single message
    - **pk** message_group_uuid returns all messages
        - **sk** sort on created_date
- which are the most common access patterns - try to solve with base table and min number of GSIs
    - get message group from base table
- if you won’t index on that field, you could add json content to it

GSI - Global Secondary Index

- eventually consistent - delay from base table to the GSI
- created at base table creation
- items don’t need to be unique
- can only do query or scan items
- can use any field for partition key

LSI - Local Secondary Index

- strongly consistent
- same partition key value, can have different sort key
- stored with the base table so anything you add is immediately available in LSI

DynamoDB - a key-value sore

- [https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/workbench.html](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/workbench.html)
- single table design
- If partition and sort key are defined, they MUST be specified when running a query
- GSI versus performing a scan - cheaper to scan (i.e. return everything) reduce number of attributes is also cheaper
- for direct messaging system
- PartiQL to use SQL for dynamoDB [https://partiql.org/](https://partiql.org/)
- partition key + sort key = unique item
- design it how your app will use the data (vs SQL where you design how the relational databases need you to)


## Dynamodb scripts

- Create schema_load
    - Create table [https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb/client/create_table.html](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb/client/create_table.html)
    - HASH is the partition key
    - RANGE is the sort key
    - not using LocalSecondaryIndexes
    - BillingMode='PROVISIONED’ is the Free Tier, capacity 5
    - try the code:

```
$ ./bin/ddb/schema_load 
{'TableDescription': {'AttributeDefinitions': [{'AttributeName': 'pk', 'AttributeType': 'S'}, {'AttributeName': 'sk', 'AttributeType': 'S'}], 'TableName': 'cruddur-message', 'KeySchema': [{'AttributeName': 'pk', 'KeyType': 'HASH'}, {'AttributeName': 'sk', 'KeyType': 'RANGE'}], 'TableStatus': 'ACTIVE', 'CreationDateTime': datetime.datetime(2023, 4, 9, 6, 3, 47, 295000, tzinfo=tzlocal()), 'ProvisionedThroughput': {'LastIncreaseDateTime': datetime.datetime(1970, 1, 1, 0, 0, tzinfo=tzlocal()), 'LastDecreaseDateTime': datetime.datetime(1970, 1, 1, 0, 0, tzinfo=tzlocal()), 'NumberOfDecreasesToday': 0, 'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}, 'TableSizeBytes': 0, 'ItemCount': 0, 'TableArn': 'arn:aws:dynamodb:ddblocal:000000000000:table/cruddur-message'}, 'ResponseMetadata': {'RequestId': '84bee98a-4cf8-4f85-b4dc-6ebe8a6fb68d', 'HTTPStatusCode': 200, 'HTTPHeaders': {'date': 'Sun, 09 Apr 2023 06:03:46 GMT', 'x-amzn-requestid': '84bee98a-4cf8-4f85-b4dc-6ebe8a6fb68d', 'content-type': 'application/x-amz-json-1.0', 'x-amz-crc32': '3889593756', 'content-length': '578', 'server': 'Jetty(9.4.48.v20220622)'}, 'RetryAttempts': 0}}
```

- List tables [https://docs.aws.amazon.com/cli/latest/reference/dynamodb/index.html](https://docs.aws.amazon.com/cli/latest/reference/dynamodb/index.html)
    - [https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-filter.html](https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-filter.html)
        - --query uses [https://jmespath.org/](https://jmespath.org/) syntax
        - aws dynamodb list-tables $ENDPOINT_URL --query TableNames --output table
- Delete table script
- Implement access patterns: seed script
    - in prod, do a batch update to save costs

![Seed script progress following along video](./assets/week5/week5_seed_script_progress1.png)

- Check seed worked: scan script
- Create get_conversation script - screenshot below is to evidence progress of following along the video vs copy+paste full code

![get_conversation script working](./assets/week5/week5_get_conversation.png)

- Create list_conversation script
    - ./bin/db/connect and SELECT uuid, handle from USERS
    - `**Warning**`Every time you re-seed your database you must update the uuid in the list_conversation script, unless you implement get_uuid, which we eventually did

## Implement conversations with DynamoDB

- We need to get users from Cognito, so we avoid hard coding ( backend-flask/db/seed.sql where we have MOCK data)
- [https://docs.aws.amazon.com/cli/latest/reference/cognito-idp/list-users.html](https://docs.aws.amazon.com/cli/latest/reference/cognito-idp/list-users.html)

```
aws cognito-idp list-users --user-pool-id XYZ --limit 20
```

- Check ./bin/db/update_cognito_user_ids
    - error *NameError: name 're' is not defined*
        - (solved) needed *import re*
    - error *NameError: name 'cur' is not defined. Did you mean: 'curr'?* and *AttributeError: 'NameError' object has no attribute 'pgerror’*
        - (solved) needed to fix typo, then worked
- Check frontend
    - CORS error because backend is not served. Backend container exited with error:

```
File "/backend-flask/app.py", line 71, in <module>
    cognito_jwt_token = CognitoJwtToken(
  File "/backend-flask/lib/cognito_jwt_token.py", line 33, in __init__
    self._load_jwk_keys()
  File "/backend-flask/lib/cognito_jwt_token.py", line 41, in _load_jwk_keys
    self.jwk_keys = response.json()["keys"]
KeyError: 'keys'
```

- debugging shows user_pool_id is null (keys_url = f"https://cognito-idp.{self.region}.amazonaws.com/{self.user_pool_id}/.well-known/jwks.json"):

```
============= keys_url:  https://cognito-idp.us-east-1.amazonaws.com//.well-known/jwks.json
======= response from keys_url:  <Response [400]>
```

- user_pool_is is AWS_COGNITO_USER_POOL_ID env var and it is set in the terminal (env | grep AWS_COGNITO_USER_POOL_ID) and in docker_compose.yml (AWS_COGNITO_USER_POOL_ID: “${AWS_COGNITO_USER_POOL_ID}”)
    - (solved) needed the explicit value in docker_compose.yml

## Starting up nwe gitpod environment

Setup
- ./bin/db/setup
- /bin/db/update_cognito_user_ids
- ./bin/ddb/schema_load
- ./bin/ddb/seed
- ./bin/ddb/patterns/get_conversations
- ./bin/ddb/patterns/list_conversations
- Check cognito user id was populated
- ./bin/db/connect
    - SELECT * FROM users;

