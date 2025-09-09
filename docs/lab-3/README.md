# Connect to Data Sources

Presto provides a plug-and-play mechanism to set up data source connections. Presto supports many different data sources by default.
You can easily add a data source connection to the coordinator and worker nodes by providing corresponding data source properties in
the `<server root>/etc/catalog` directory. In this section, you will learn how to set up MySQL and MongoDB data sources in a Presto
cluster.

This section is comprised of the following steps:

1. [Data Source Connectors](#1-data-source-connectors)
1. [MySQL and MongoDB Connectors](#2-mysql-and-mongodb-connectors)
1. [Federated Query](#3-federated-query)

## 1. Data Source Connectors

First, let's learn how to run Presto CLI to connect to the coordinator. There are several ways to do that:

1. Download the executable jar from the official repository and run the jar file with a proper JVM.
  You can see details in this [documentation](http://prestodb.io/docs/current/installation/cli.html#install-the-presto-cli).
1. Use the `presto-cli` that comes with the `prestodb/presto` Docker image

For this lab, since we run everything on Docker containers, we are going to use the second approach. You also have two ways
to do this:

Run the `presto-cli` inside the coordinator container
```sh
docker exec -ti coordinator /opt/presto-cli
```

You see the Presto CLI prompt like this:
```
presto>
```

!!! note
    Since the `presto-cli` is executed inside the `coordinator` and `localhost:8080` is the default server,
    no need to specify the `--server` argument.

Or run the `presto-cli` with a dedicated container and connect to the coordinator.
```sh
$ docker run --rm -ti -v ./conf/coordinator/config.properties:/opt/presto-server/etc/config.properties \
    -v ./conf/coordinator/jvm.config:/opt/presto-server/etc/jvm.config --net presto_network \
    --entrypoint /opt/presto-cli prestodb/presto:latest --server coordinator:8080
presto>
```

After you run the command after the shell prompt, the dollar sign, you should get the `presto>` CLI prompt. Then you can run
this SQL -
```sql
show catalogs;
```
to get currently configured catalogs:
```
presto> show catalogs;
 Catalog
---------
 jmx
 memory
 mongodb
 mysql
 system
 tpcds
 tpch
(7 rows)

Query 20231115_045608_00002_xuury, FINISHED, 3 nodes
Splits: 53 total, 53 done (100.00%)
[Latency: client-side: 357ms, server-side: 305ms] [0 rows, 0B] [0 rows/s, 0B/s]

presto>
```

These are the catalogs that you set when launching the coordinator and worker containers by using the configurations
from the `./catalog` directory.

- [jmx](http://prestodb.io/docs/current/connector/jmx.html): The JMX connector provides the ability to query JMX
  information from all nodes in a Presto cluster.
- [memory](http://prestodb.io/docs/current/connector/memory.html): The Memory connector stores all data and metadata
  in RAM on workers and both are discarded when Presto restarts.
- [system](http://prestodb.io/docs/current/connector/system.html): The System connector provides information and
  metrics about the currently running Presto cluster.
- [tpcds](http://prestodb.io/docs/current/connector/tpcds.html): The TPCDS connector provides a set of schemas
  to support the TPC Benchmark™ DS (TPC-DS)
- [tpch](http://prestodb.io/docs/current/connector/tpch.html): The TPCH connector provides a set of schemas to
  support the TPC Benchmark™ H (TPC-H).


## 2. MySQL and MongoDB Connectors

Adding new catalogs to Presto servers is quite simple. You just need to create the corresponding property file under
`<presto-root>/etc/catalog` directory and provide the data source information in the property file.

For the MySQL database, you can find the following content in the `./catalog/mysql.properties` file. It contains
the information about the MySQL database you set up earlier.

```
connector.name=mysql
connection-url=jdbc:mysql://presto-mysql:3306
connection-user=root
connection-password=presto
```


For the MongoDB, you can find the following content in the `./catalog/mongodb.properties` file. It contains
the information about the MongoDB you set up earlier:

```
connector.name=mongodb
mongodb.seeds=presto-mongo:27017
```

## 3. Federated Query

Let's run some SQLs to verify the MySQL and MongoDB data sources:

- List the schemas in the MongoDB:
  ```sql
  show schemas in mongodb;
  ```
  Outputs:
  ```
   presto> show schemas in mongodb;
         Schema
  --------------------
   admin
   config
   information_schema
   local
   presto_to_mongodb
  (5 rows)

  Query 20231115_054817_00001_hwb7z, FINISHED, 4 nodes
  Splits: 53 total, 53 done (100.00%)
  [Latency: client-side: 0:01, server-side: 0:01] [5 rows, 76B] [6 rows/s, 105B/s]
  ```
- Show all records in the `book` document from MongoDB:
  ```sql
  select * from mongodb.presto_to_mongodb.book;
  ```
  Outputs:
  ```
  presto> select * from mongodb.presto_to_mongodb.book;
   id |     book_name
  ----+--------------------
    1 | harry potter
    2 | The forgotten
    3 | The Alchemist
    4 | Engines of Liberty
  (4 rows)

  Query 20231115_055124_00003_hwb7z, FINISHED, 1 node
  Splits: 17 total, 17 done (100.00%)
  [Latency: client-side: 381ms, server-side: 365ms] [4 rows, 112B] [10 rows/s, 306B/s]
  ```
!!! note
    You may run this command `use mongodb.presto_to_mongodb;` to switch to the `mongodb` catalog
    and use `presto_to_mongodb` as the default schema. Then use `book` in the SQL instead of
    `mongodb.presto_to_mangodb.book`.
- List the schemas in MySQL:
  ```sql
  show schemas in mysql;
  ```
  Outputs:
  ```
  presto> show schemas in mysql;
         Schema
  --------------------
   information_schema
   performance_schema
   presto_to_mysql
   sys
  (4 rows)

  Query 20231115_055417_00004_hwb7z, FINISHED, 4 nodes
  Splits: 53 total, 53 done (100.00%)
  [Latency: client-side: 0:01, server-side: 0:01] [4 rows, 74B] [4 rows/s, 82B/s]
  ```
- Show all records in the `author` table from MySQL:
  ```sql
  select * from mysql.presto_to_mysql.author;
  ```
  Outputs:
  ```
  presto> select * from mysql.presto_to_mysql.author;
   id |    author
  ----+--------------
    1 | Rowlings
    2 | Holly Black
    3 | Stephen King
    4 | Rick Riorden
  (4 rows)

  Query 20231115_055652_00006_hwb7z, FINISHED, 2 nodes
  Splits: 17 total, 17 done (100.00%)
  [Latency: client-side: 0:01, server-side: 0:01] [4 rows, 0B] [5 rows/s, 0B/s]
  ```
- Finally, join the tables from MySQL and MongoDB - a federated query using this SQL:
  ```sql
  select A.id, A.author, B.book_name from mysql.presto_to_mysql.author A
    join mongodb.presto_to_mongodb.book B on A.id=B.id order by A.id;
  ```
  Here are the results:
  ```
  presto> select A.id, A.author, B.book_name from mysql.presto_to_mysql.author A join mongodb.presto_to_mongodb.book B on A.id=B.id order by A.id;
   id |    author    |     book_name
  ----+--------------+--------------------
    1 | Rowlings     | harry potter
    2 | Holly Black  | The forgotten
    3 | Stephen King | The Alchemist
    4 | Rick Riorden | Engines of Liberty
  (4 rows)

  Query 20231115_060032_00010_hwb7z, FINISHED, 3 nodes
  Splits: 198 total, 198 done (100.00%)
  [Latency: client-side: 0:01, server-side: 0:01] [8 rows, 112B] [14 rows/s, 208B/s]
  ```

You just used the unified SQL to query data from two different data sources and leverage the Presto SQL engine to perform a federated query
that joins two data sets from two data sources.
