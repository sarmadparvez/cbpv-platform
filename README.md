# Crowd-Based Prototype Validation Platform

This platform allows iterative validation of software prototypes using Crowdsourcing. There are two roles involved
in this process. The Developer role, who creates and owns the prototype, and a Crowd-Worker
role who evaluates and provides feedback on the prototype.

To learn more about the related research and the platform, please refer to [this](https://www.researchgate.net/publication/355445295_Design_Principles_for_a_Crowd-based_Prototype_Validation_Platform) publication. The platform
is developed using the design principles from that research.

## Live Access

There are two deployments of the platform.

### 1. Heroku

[Here](https://cbpv-platform.web.app) you can access the deployment which points to microservices deployed on [heroku](heroku.com).

Note: The current Heroku plan has a limitation that the services go to sleep when not in use for 30 minutes. Accessing the service wakes it up however the first request can take a long time because the service is waking up, but further requests will be served immediately. If you run the applications locally, then you will not face this limitation.

### 2. Amazon EC2

[Here](https://upb-cbpv-platform.web.app) you can access the deployment which points to microservices deployed on [Amazon EC2](https://docs.aws.amazon.com/ec2/index.html).

For this deployment, a [Kubernetes](https://kubernetes.io) cluster is created using [minikube](https://minikube.sigs.k8s.io/docs)
which runs inside Amazon EC2 instance.

The Kubernetes dashboard can be accessed [here](https://cbpv-k8s-dashboard.herokuapp.com).

## Applications Overview

There are three applications in this monorepo. The applications can be found in
`apps` directory.

### web

This is the frontend application of CBPV platform developed with [Angular](https://angular.io) framework.

### admin

This is a backend microservice developed with [NestJS](https://nestjs.com) framework. The [OpenAPI](https://spec.openapis.org/oas/latest.html#openapi-specification) specification for the
APIs exposed by this microservice can be accessed [here](https://cbpv-admin.herokuapp.com/api).

The responsibilities of this service are user management, role management, and administration.

### task

This is a backend microservice developed with [NestJS](https://nestjs.com) framework. The [OpenAPI](https://spec.openapis.org/oas/latest.html#openapi-specification) specification for the
APIs exposed by this microservice can be accessed [here](https://cbpv-task.herokuapp.com/api).

The responsibility of this service is prototype evaluation workflow management and execution.

## Developing and running the applications in monorepo

This project was generated using [Nx](https://nx.dev).

To run and build the applications in this monorepo you will need to install Nx cli
`npm install -g nx`

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

🔎 **Smart, Fast and Extensible Build System**

### Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

- [React](https://reactjs.org)
  - `npm install --save-dev @nrwl/react`
- Web (no framework frontends)
  - `npm install --save-dev @nrwl/web`
- [Angular](https://angular.io)
  - `npm install --save-dev @nrwl/angular`
- [Nest](https://nestjs.com)
  - `npm install --save-dev @nrwl/nest`
- [Express](https://expressjs.com)
  - `npm install --save-dev @nrwl/express`
- [Node](https://nodejs.org)
  - `npm install --save-dev @nrwl/node`

There are also many [community plugins](https://nx.dev/community) you could add.

### Generate an application

Run `nx g @nrwl/nest:app my-nest-app` to generate a new [NestJS](https://nestjs.com) application.

Run `nx g @nrwl/angular:application my-angular-app` to generate a new [Angular](https://angular.io) application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

### Generate a library

Run `nx g @nrwl/workspace:lib my-lib` to generate a library.

Run `nx g @nrwl/nest:lib auth --controller` to generate a new nest library with a controller.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@cbpv-platform/mylib`.

### Development server

#### Pre-requisites for running the applications on local environment

1. First you need to install dependencies by `npm install`.
2. To generate client side services (for web) from OpenAPI specification (available in `apps/task/src/swagger` and `apps/admin/src/swagger`) you need to install
   [OpenAPI Generator](https://openapi-generator.tech/docs/installation)
   `npm install @openapitools/openapi-generator-cli -g` .
3. Generate client side services (for web) by `npm run generate:api`.

#### Run the Applications on local environment

Run `nx serve web` for running frontend Angular web application on a dev server. Navigate to http://localhost:4200. The app will automatically reload if you change any of the source files.

Run `nx serve admin` for running NestJS Admin microservice on a dev server. The app will run on http://localhost:3001. The app will automatically reload if you change any of the source files.

Run `nx serve task` for running frontend Task microservice on a dev server. The app will run on http://localhost:3000. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `nx g @nrwl/angular:component my-component --project=web` to generate a new component in web application.

Run `nx g @nrwl/nest:resource my-resource --project=task` to generate a new [resource](https://docs.nestjs.com/recipes/crud-generator#generating-a-new-resource) in Task microservice.

### Build

Run `nx build web` to build the frontend web project.

Run `nx build admin` to build the Admin microservice.

Run `nx build task` to build the Task microservice.

The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.

### Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.

### ☁ Nx Cloud

#### Distributed Computation Caching & Distributed Task Execution

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.
