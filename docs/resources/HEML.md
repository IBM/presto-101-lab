# Helm

## Use Helm to Deply a Presto Cluster
The Presto community also provides the helm chart to install Presto cluster on a
Kubernetes cluster. Here is how you can leverage it to create a Presto cluster
containing the same settings for this workshop.

## Prerequisite
In order to use Presto helm chart, make sure the following tools are available

- [Helm](https://helm.sh/)
- A Kubernetes cluster
- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)


## Instructions

1. Add the Presto Helm Chart Repository:
   
    Helm chart repository is a location where packaged charts can be stored and shared.
    Use the following command to add Presto charts repository to Helm client configuration:
    ```
    helm repo add presto https://prestodb.github.io/presto-helm-charts
    ```

2. Create a namespace for the Presto cluster
   
    Use a dedicate namespace to deploy the Presto cluster. In this case, the namespace is
    called `presto`
    ```
    kubectl create ns presto
    ```

3. Deploy MongoDB and MySQL

    ```
    kubectl apply -n presto -k helm/kustomize
    ```

4. Populate the Data into MongoDB and MySQL

    ```
    kubectl exec -n presto -ti svc/presto-mongo mongosh < data/mongo.sql
    kubectl exec -n presto -ti svc/presto-mysql -- mysql -u root -ppresto < data/mysql.sql
    ```
    
5. Install a Presto Chart
    
    Install a Presto Helm chart and it will provision a Presto cluster using the settings from the `helm/values.yaml`
    ```
    helm install presto presto/presto -f helm/values.yml -n presto
    ```