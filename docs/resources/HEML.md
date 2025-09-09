# Helm

## Use Helm to Deply a Presto Cluster
The Presto community also provides the helm chart to install Presto cluster on a
Kubernetes cluster. Here is how you can leverage it to create a Presto cluster
containing the same settings for this workshop.

## Prerequisite
In order to use Presto helm chart, make sure the following tools are available

- [Helm](https://helm.sh/docs/intro/install/)
- A Kubernetes cluster: use [kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation) for the lab
- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)

## Optional: Create a kind Cluster ###

Use the following command to create a kind cluster named `presto`:

```sh
kind create cluster -n presto
```

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

3. To avoid Docker hub rate limitation, create a default Docker image pull secret based on your docker config.
   Make sure the docker config file exist by running the following command:
   ```sh
   docker login
   ```
   Create the secret using the docker config file:
   ```sh
   kubectl create secret generic regcred \
          --from-file=.dockerconfigjson=/path/to/your/.docker/config.json \
          --type=kubernetes.io/dockerconfigjson \
          --namespace presto
   ```
   Make the secret as the default secret for pulling image:
   ```sh
   kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "regcred"}]}' \
      --namespace presto
   ```


4. Deploy MongoDB and MySQL

    ```
    kubectl apply -n presto -k helm/kustomize
    ```

5. Populate the Data into MongoDB and MySQL

    ```
    kubectl exec -n presto -ti svc/presto-mongo mongosh < data/mongo.sql
    kubectl exec -n presto -ti svc/presto-mysql -- mysql -u root -ppresto < data/mysql.sql
    ```

6. Install a Presto Chart

    Install a Presto Helm chart and it will provision a Presto cluster using the settings from the `helm/values.yaml`
    ```
    helm install presto presto/presto -f helm/values.yml -n presto
    ```