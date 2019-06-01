# Bandland

> Bandland is a single web application that allows for artists and labels to share music with fans and for fans to support them.

Tasked with reworking legacy codebases for backend of web application to improve scalability and handle higher traffic

  - Creating data generation script and scaling database to generate and seed 10M records. 
  - Stress testing and analyzing two databases, PostgreSQL and Cassandra, to determine best performance for the use case.
  - Building out CRUD API routes that will query and use the new database. Performance tuning as needed.
  - Scaling codebase to support 1000 requests per second on AWS EC2 using a t2.micro instance.


## Related Projects

  - https://github.com/team-amy/ana-service
  - https://github.com/team-amy/Nam-s-Service

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

## Usage

> Some usage instructions

## Requirements

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 10.15.3

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install -g nodemon
npm install
```

