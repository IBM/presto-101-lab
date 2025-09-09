# Scalability

## Scaling a Presto Cluster
The purpose of the scaling a Presto cluster is to handle an increased workload for certain scenarios.
Usually you need to scale up the Presto cluster because:

- Number of users increases
- Number of queries increase
- The volume of data increases

Some situations also indicate a need of scaling:

- Single point of failure
- Bad worker state: out-of-memory errors occurs and corresponding queries fail, thus wasting resources.
- Bad queiries: A SQL query takes too long to execute and starves the other queries for resources.

## Vertical Scaling
One of the scaling approach is to increase the resources in a single server, i.e. CPU, memory, or storage size.

| Query type      | Resources to increase              |
| --------------- | ---------------------------------- |
| Store large amount of data in memory       | Memory  |
| Complex calculation/computation            | CPU     |

- Memory:
    - Need to allocate more memory to a Presto node. The `-Xmx` property in the `jvm.config` configuration.
    - `query.max-memory-per-node` in the `config.properties`
- CPU:
    - `task.concurrency` in the `config.properties`: define the number of worker thread per node.

## Availability

- Use [Presto Router](https://prestodb.io/docs/current/router/deployment.html) to manage the access to multiple Presto clusters
- [Set Up multiple coordinators - Disaggregated Coordinator](https://prestodb.io/blog/2022/04/15/disggregated-coordinator/)


## Horizontal Scaling
Deploy more workers.

- For instance base deployment, create or allocate a new instance, deploy Presto, add the worker node to the Presto cluster
- For Kubernetes base deployment, increase the replicate number of worker deployment.
- For cloud base deployment, check the service document and scale up.

## Presto on Spark

- Great for large batch ETL workload because of the paralelism.
- A robust and scalable execution platform
- Get benefits from both Apache Spark and Presto