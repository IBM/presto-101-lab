# Introduction

## Presto Workshop - Getting Started with Presto

Welcome to our workshop! In this workshop, you’ll learn the basics of Presto, the open-source SQL query engine.
You’ll get Presto running locally on your machine, connect data sources, and run some queries.
This is a beginner-level workshop for software developers and engineers who are new to Presto.
At the end of the workshop, you will understand how to federate queries using Presto. 

The goals of this workshop are:

* What is Presto and why you’d use it
* How to write a Presto query
* How to create and deploy a Presto cluster on your machine using Docker
* How to add 2 data sources (MySQL and MongoDB) and query the data from them
* How to create dashboards/visualizations of your data

### About this workshop

The introductory page of the workshop is broken down into the following sections:

* [Agenda](#agenda)
* [Compatibility](#compatibility)
* [Technology Used](#technology-used)
* [Credits](#credits)

## Agenda

|  |  |
| :--- | :--- |
| [Prerequisite](prerequisite/README.md) | Prerequisites for the workshop |
| [Introduction](introduction/README.md) | Presto Introduction |
| [Lab 1: Set up Presto](lab-1/README.md) | Set up a Presto cluster with 1 coordinator and 3 workers |
| [Lab 2: Set up Data Sources](lab-2/README.md) | Set up 2 data source - MySQL and MongoDB |
| [Lab 3: Connect to Data Sources](lab-3/README.md) | Set up 2 catalogs to connect to MySQL and MongoDB |
| [Lab 4: Data Visualization](lab-4/README.md) | Visualize the data |

## Compatibility

This workshop has been tested on the following platforms:

* **Linux**: Ubuntu 22.04
* **MacOS**

## Technology Used

* [Docker](https://www.docker.com/): A container engine to run several applications in self-contained containers.
* [Presto](https://prestodb.io/): Fast and Reliable SQL Engine for Data Analytics and the Open Lakehouse
* [MySQL](https://www.mysql.com/): A popular open-source relational database management system
* [MongoDB](https://www.mongodb.com/): A document-oriented database
* [Apache Zeppelin](https://zeppelin.apache.org/): Web-based notebook for interactive data analytics

## Credits

* [Kiersten Stokes](https://github.com/kiersten-stokes)
* [Yihong Wang](https://github.com/yhwang)
