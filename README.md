<div align="center">

![Node_Badge](https://img.shields.io/badge/node-14.17.3-brightgreen)  ![React_Badge](https://img.shields.io/badge/web-react-ff69b4)  ![Npm_Badge](https://img.shields.io/badge/npm-6.14.13-red)  ![TypeScript](https://img.shields.io/badge/typescript-blue)  ![languages](https://img.shields.io/badge/languages-3-9cf)  ![GitHub](https://img.shields.io/github/license/x0n4d0/ecoleta)  <a href="https://www.udemy.com/course/nodejs-the-complete-guide/?couponCode=D_0422">
    <img alt="Made by Academind" src="https://img.shields.io/badge/made%20by-Academind-orange">
  </a>

</div>

<p align="center">
<strong>Node JS & Deno.js</strong>, build REST APIs with Node.js, GraphQL APIs, add Authentication, use MongoDB, SQL & much more! 
</p>

<p align="center">
  <a href="#open_file_folder-course-content">Course Content</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#computer-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#hammer-tools">Tools</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#woman_technologist-running-the-application">Running the application</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <!-- <a href="#page_facing_up-licença">Licença</a> -->
</p>

<!-- <div align="center">
  <img alt="Aplicação Web" src="./ecoleta-web.gif">
  </br></br>
  <img alt="Aplicação Mobile" src="./ecoleta-mobile.gif" width="300">
</div> -->


## **:open_file_folder: COURSE CONTENT**
All the course content can be found at Studies folder


###### **1. Node Basic**
How the web works, Creating a Node Server, Node Lifecycle & event loop, Requests, Responses & Responses headers, Routing/redirecting requests, Request body parsing, Event Driven code execution, Blocking/Non-blocking code, Node Modules system.

###### **2. Node MVC**
App using MVC Software Design Pattern.
**2.1 Improved Development Workflow and Debugging:** NPM Scripts, 3rd party packages vs Global features vs Core modules, Nodemon, Error Types, Syntax & Runtime & Logical errors.
**2.2 Express.js:** Middlewares, Handling different routes, Parsing incoming requests, Express router, 404 error pages, Paths filtering, Serving files statically, Navigation.
**2.3 Dynamic Content & Template Engines**: Views, Sharing data across requests & users, Pug/Express Handlebars/Ejs Template Engines.
**2.4 Model View Controller (MVC)**: Controllers, Storing/fetching data through models.

###### **1. Node SQL — No sequelize**

**Assignments**
Pure Node Requests, Express and Middlewares, Routes and Static Files, and App set/get and Template Engines.



## **:computer: TECHNOLOGIES**

#### **BACK-END** ([NodeJS](https://nodejs.org/en/) + [TypeScript](https://www.typescriptlang.org/))

  - **[Nodemon](https://www.npmjs.com/package/nodemon):** automatically restarting the node application when file changes in the directory are detected
  - **[Express](https://expressjs.com/):** production dependency for creating robusts APIs quickly with HTTP utility methods and middleware
  - **[Ejs](https://ejs.co/)/[Pug](https://pugjs.org/api/getting-started.html)/[Express-handlebars](https://www.npmjs.com/package/express-handlebars):** software designed to combine templates with a data model to produce multiple pages that share the same look throughout the site. These are the views in an MVC project.
  - **[Mysql2](https://www.npmjs.com/package/mysql2):** mySQL to interact with the database
  - **[Sequelize](https://www.npmjs.com/package/sequelize):** Object-Relational Mapping Library that uses mysql2 to interact with the database running the queries behind the scenes 
  - **[Mongodb](https://www.mongodb.com/cloud/atlas):** MongoDB Driver to connect to MongoDB to handle the database engine (run noSQL databases for large scale applications)
  - **[Mongoose](https://mongoosejs.com/):** Object-Document Mapping Library that allow us to define models with which we then work and where all the queries are done behind the scenes
  - **[Express-session](https://www.npmjs.com/package/express-session):** package to handle sessions, part of the official expressjs suite but not baked into expressjs itself
  - **[Connect-mongodb-session](https://www.npmjs.com/package/connect-mongodb-session):** let our express session package store data in the database
  - **[Bcryptjs](https://www.npmjs.com/package/bcryptjs):** encrypting passwords
  - **[Csurf](https://www.npmjs.com/package/csurf):** Node.js CSRF protection middleware. It generates a csrf token (string value we can embed into our forms/pages for every request that on the backend changes the users state, so anything that does something sensitive which we want to protect against).
  - **[Connect-flash](https://www.npmjs.com/package/connect-flash):** flash is a special area of the session used for storing messages. Messages are written to the flash and cleared after being displayed to the user. The flash is typically used in combination with redirects, ensuring that the message is available to the next page that is to be rendered
  - **[Nodemailer](https://nodemailer.com/):** send emails from inside nodejs
  - **[Express-validator](https://express-validator.github.io/docs/):** validate forms on the server
  - **[Multer](https://www.npmjs.com/package/multer):** parses incoming requests handling files and being able to handle file requests as well or requests with mixed data, with text and file data.
  - **[Pdfkit](https://www.npmjs.com/package/pdfkit):** pdf generator
  - **[Stripe](https://www.npmjs.com/package/stripe):** suite of payment APIs that allows online payment processing 
  - **[Typescript](https://www.typescriptlang.org/):** strongly typed programming language that builds on JavaScript

##### Deployment And Security

  - **[Helmet](https://www.npmjs.com/package/helmet):** secure node express application: set headers to responses following best practices regarding attack patterns/security issues
  - **[Compression](https://www.npmjs.com/package/compression):** Nodejs express middleware that serves optimized assets
  - **[Morgan](https://www.npmjs.com/package/morgan):** simplify logging request data

##### Testing

  - **[Mocha](https://mochajs.org/):** runs tests (executing the test code)
  - **[Chai](https://www.chaijs.com/):**  asserts results (validating the test outcome) 
  - **[Sinon](https://www.npmjs.com/package/sinon):** creates Stubs, which is a replacement for the original function where we can easily restore the original set up, clearing stub functions.

##### REST API

  - **[Jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken):** creates JSON web tokens for authentication on REST APIs. Creates data with optional signature and/or encryption whose payload holds JSON and is signed either using a private secret or a public/private key.
  - **[Socket.io](https://www.npmjs.com/package/socket.io):** (server) web sockets with a lot of convenience features around that protocol that make it very easy to set up a web socket channel with a client in the server and to use that channel. 
  - **[Socket.io-client]():** (web) socket.io for the client

##### Graphql

  - **[Graphql](https://www.npmjs.com/package/graphql):** required for defining the schema (definition of queries, mutations, etc) of the GraphQL service.
  - **[Express-graphql](https://www.npmjs.com/package/express-graphql):** server to parse incoming requests
  - **[Validator](https://www.npmjs.com/package/validator):** validates inputs on the resolvers
  
  <kbd>[package.json](./server/package.json)</kbd>

## **:woman_technologist: RODANDO A APLICAÇÃO** 

Requisitos: [Git](https://git-scm.com), [Node.js](https://nodejs.org/en/), Editor ([VSCode](https://code.visualstudio.com/))

```sh
# Encontre o seu endereço IPv4 
$ ipconfig

# Clone este repositório
$ git clone https://github.com/jubrito/ecoleta

# Acesse a pasta do projeto no cmd/terminal
$ cd ecoleta

```

Altere a constante *IPAddress do arquivo* <kbd>[UserIPAddress.ts](./UserIPAddress.ts)</kbd> no diretório raíz **substituindo o endereço de IPv4 exemplo para o da sua máquina**.

### Server (Back-end)

```sh
# Acesse a pasta do server no cmd/terminal
$ cd server

# Instale as dependências do server
$ npm install

# Execute a aplicação em modo de desenvolvimento
$ npm run dev
```

Acesse [http://localhost:3333](http://localhost:3333) (o servidor inciará na porta:3333)  

```sh
# Instanciando o banco de dados:
$ npm run knex:migrate

# Povoando o banco de dados (seeds):
$ npm run knex:seed

```


### Web (Front-end)

```sh
# Acesse a pasta do website no cmd/terminal
$ cd web

# Instalando as dependências do website
$ npm install

# Execute a aplicação em modo de desenvolvimento
$ npm run start

```
Acesse [http://localhost:3000](http://localhost:3000) - (a aplicação será aberta na porta:3000) 

## **:page_facing_up: LICENÇA**
Licença MIT &rarr; **<kbd>[LICENSE](https://github.com/Rocketseat/nlw-01-booster/blob/master/LICENSE.md)</kbd>**


