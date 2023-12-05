# Set up Data Sources

In this section, you will set up MongoDB and MySQL as the data sources.

This section is comprised of the following steps:

1. [Set Up MongoDB](#1-mongodb)
1. [Set Up MySQL](#2-mysql)

## 1. MongoDB

Use the following command to start a MongoDB:
```sh
docker run -d --net presto_network --name presto-mongo mongo:6.0.4
```

You can use the following command to check the logs of the MongoDB:
```sh
docker logs presto-mongo -f
```

The MongoDB is up and ready when you see the following messages:
```
{"t":{"$date":"2023-11-14T06:48:23.625+00:00"},"s":"I",  "c":"NETWORK",  "id":23015,   "ctx":"listener","msg":"Listening on","attr":{"address":"0.0.0.0"}}
{"t":{"$date":"2023-11-14T06:48:23.626+00:00"},"s":"I",  "c":"NETWORK",  "id":23016,   "ctx":"listener","msg":"Waiting for connections","attr":{"port":27017,"ssl":"off"}}
{"t":{"$date":"2023-11-14T06:48:23.649+00:00"},"s":"I",  "c":"INDEX",    "id":20345,   "ctx":"LogicalSessionCacheRefresh","msg":"Index build: done building","attr":{"buildUUID":null,"collectionUUID":{"uuid":{"$uuid":"41f44999-9108-4497-9442-c0baba8a82c6"}},"namespace":"config.system.sessions","index":"_id_","ident":"index-5--8644828660937270733","collectionIdent":"collection-4--8644828660937270733","commitTimestamp":null}}
{"t":{"$date":"2023-11-14T06:48:23.649+00:00"},"s":"I",  "c":"INDEX",    "id":20345,   "ctx":"LogicalSessionCacheRefresh","msg":"Index build: done building","attr":{"buildUUID":null,"collectionUUID":{"uuid":{"$uuid":"41f44999-9108-4497-9442-c0baba8a82c6"}},"namespace":"config.system.sessions","index":"lsidTTLIndex","ident":"index-6--8644828660937270733","collectionIdent":"collection-4--8644828660937270733","commitTimestamp":null}}
```

Load the testing data into the MongoDB:
```sh
docker exec -i presto-mongo mongosh < data/mongo.sql
```

Check the testing data by using the following command:
```sh
echo 'db.book.find({})' | docker exec -i presto-mongo mongosh mongodb://127.0.0.1:27017/presto_to_mongodb
```

You should see the following outputs:
```
presto_to_mongodb> [
  {
    _id: ObjectId("655318f02a5ca499ace274d5"),
    id: 1,
    book_name: 'harry potter'
  },
  {
    _id: ObjectId("655318f02a5ca499ace274d6"),
    id: 2,
    book_name: 'The forgotten'
  },
  {
    _id: ObjectId("655318f02a5ca499ace274d7"),
    id: 3,
    book_name: 'The Alchemist'
  },
  {
    _id: ObjectId("655318f02a5ca499ace274d8"),
    id: 4,
    book_name: 'Engines of Liberty'
  }
]
```

## 2. MySQL

Use the following command to start a MySQL server:
```sh
docker run --net presto_network --name presto-mysql -e MYSQL_ROOT_PASSWORD=presto -d mysql
```

You can use the following command to check the logs of the MySQL server:
```sh
docker logs presto-mysql -f
```

The MySQL server is up and ready when you see the following message from the logs:
```
2023-11-14T06:05:19.091785Z 0 [System] [MY-010931] [Server] /usr/sbin/mysqld: ready for connections. Version: '8.1.0'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server - GPL.
```

Load the testing data into the MySQL server:
```sh
docker exec -i presto-mysql mysql -u root --password=presto -t < data/mysql.sql
```

A new database named `presto_to_mysql` was created and testing data was populated into the `author` table.

Use the following command to check the testing data:
```sh
docker exec -it presto-mysql mysql -u root --password=presto -D presto_to_mysql  -e 'select * from author'
```

You should see the following outputs:
```
mysql: [Warning] Using a password on the command line interface can be insecure.
+------+--------------+
| id   | author       |
+------+--------------+
|    1 | Rowlings     |
|    2 | Holly Black  |
|    3 | Stephen King |
|    4 | Rick Riorden |
+------+--------------+
```

Now the 2 data sources are ready for use. Let's move to the next section to connect the Presto cluster to
these data sources.

<img src="https://count.asgharlabs.io/count?p=/lab2_presto_101_page">

