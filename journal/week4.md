# Week 4 — Postgres and RDS

# Required homework

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
