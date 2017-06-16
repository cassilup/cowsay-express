# Docker for WebDevs Workshop

Welcome, this is a tutorial on `Docker`-ising a WebApp.

If you're curious about the tutorial's context, check out the [presentation slides](https://docs.google.com/presentation/d/1yIS3pzWe98EQLiDv5t31N1VZjmE8jYUVuVnR9ziN5A4/present).
[![slides](http://i.imgur.com/KPYdeho.png)](https://docs.google.com/presentation/d/1yIS3pzWe98EQLiDv5t31N1VZjmE8jYUVuVnR9ziN5A4/present)

The tutorial consists of 5 main parts:
1. [Running the example app locally](#1-running-the-example-app-locally)
2. [Create the Dockerfile](#2-create-the-dockerfile)
3. [Deploying the app to the cloud and have it built using the Dockerfile](#3-deploying-the-app-to-the-cloud-and-have-it-built-using-the-dockerfile)
4. [Running the example app locally in a Docker container (Production Mode)](#4-running-the-example-app-locally-in-a-docker-container-production-mode)
5. [Running the example app in a Docker container listening for code changes (Development Mode)](#5-running-the-example-app-in-a-docker-container-listening-for-code-changes-development-mode)

---

## 1. Running the example app locally

#### 1. Clone the repo
```bash
git clone https://github.com/cassilup/express-cowsay
```

#### 2. Since this is a node.js app, we need to grab the needed packages from npm
```bash
npm install
```
If all went well, you now have a new folder named `node_modules/`.

#### 3. Start the app by running:
```bash
node index.js
```

You should see the following in your terminal:
![app running natively](http://i.imgur.com/9Ce9zC3.png)

#### 4. Open http://localhost:8080 in your browser.

You should see the following:
![app running natively](http://i.imgur.com/e7tZxgZ.png)

#### 5. Stop the app and clean the project
We want to reset the project to its original state, without any `npm` packages installed. That is because we will start the server inside a Docker container and the `node_modules/` folder will be created inside the container, without our

First, we will stop the server by hitting `CTRL`+`C`.

Secondly, we will delete the `node_modules/`. We will later generate it from inside of our Docker container.

---

## 2. Create the Dockerfile

This is the magical part. `Dockerfile` is like a recipe. It builds our project environment based on the ingredients (instructions) we specify here.

Here is the `Dockerfile` that we'll be using for this tutorial:

```
FROM node:boron

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm install

COPY . /usr/src/app

EXPOSE 8080

CMD [ "npm", "start" ]
```

Each step in the `Dockerfile` generates an intermediate container.
This is the strategy that allows Docker to be fast.

Few `Dockerfile` keywords that you should be aware of:
* `FROM`: Image that our container will be built from. (Note: you can build/package/deploy your own images.)
* `RUN`: Execute a command in the bash of our Linux container.
* `WORKDIR`: Equivalent of `cd <path/to/folder>`
* `COPY`: Copies files from the host machine (your native OS) to the container's filesystem.
* `EXPOSE`: Opens up a port so that we can access our container.
* `CMD`: Special command that is run **every time** the container is started.
For more info about possible keywords, [click here](https://docs.docker.com/engine/reference/builder/).

---

## 3. Deploying the app to the cloud and have it built using the Dockerfile

#### 1. Install _[now.sh](https://now.sh)_
Follow [the official instructions](https://zeit.co/download).

#### 2. Run the following command
```
now --docker
```

Notice the new URL for our deployed app in the command line:
![docker building image](http://i.imgur.com/pNxQBRQ.png)

#### 3. Access the app's URL

Accessing that URL returns information about our deployment:
![docker building image](http://i.imgur.com/WQm8q70.png)

Notice that the local terminal mirrors the same logs we can see in the browser:
![docker container being deployed](http://i.imgur.com/urDdyQC.png)
![docker container finished deploying](http://i.imgur.com/SDxSXxJ.png)

Once the deployment is ready, we can see our app running from a `Docker` container in the app's URL:
![app running in the cloud](http://i.imgur.com/B37fFZ4.png)

**Awesome!**

---

## 4. Running the example app locally in a Docker container (Production Mode)

__Note:__ _Make sure you have [Docker for Mac/Win]( https://docs.docker.com/docker-for-mac/docker-toolbox/#setting-up-to-run-docker-for-mac) installed._

For more information on the VM used by Docker, [click here](https://docs.docker.com/docker-for-mac/docker-toolbox/#the-docker-for-mac-environment).

Steps to generate a `Docker` image out of our `Dockerfile`:

#### 1. Build the project into a `Docker` image
```
docker build -t cowsay-express .
```
Notice the intermediate containers being created.
![docker building image](http://i.imgur.com/UUUm96u.png)

#### 2. Start a container from the image we just built
```
docker run -p 10080:8080 -d cowsay-express
```
![docker successfully built image](http://i.imgur.com/Fcr7sxH.png)

#### 3. Navigate to http://localhost:10080 and _voilá!_
![node app running in Docker](http://i.imgur.com/w3FKlVy.png)

__Very Important:__ Notice that there's no `node_modules/` in our code. This means that the app is actually running in the `Docker` container.

#### 4. Access the internal folder structure of the container by opening a shell inside it
```
docker exec -it <container id> sh
```

Now list the contents of the app's folder and notice the `node_modules/` folder being present:
```
ls -l /usr/src/app
```

![node_modules present](http://i.imgur.com/wE707C6.png)

Other useful commands:
* `docker images` —> lists all images on system
* `docker ps` —> lists running containers on system
* `docker ps -a` —> lists all containers
* `docker stop <container id>` -> stop a container
* `docker rm <container id>` -> remove a container
* `docker image rm <image name>` -> remove an image
For more info, [click here](https://docs.docker.com/engine/reference/run/)

---

## 5. Running the example app in a Docker container listening for code changes (Development Mode)

By default, `node` doesn't "listen" for code changes. So when you make code changes, you need to restart the `node` process in order to have it take changes into account.

`nodemon` is a tool that fixes that and is commonly used in development of `node` projects.

In order to be able to develop in our own host OS and have the code changes reflected inside and served through the `Docker` container, we have to:
1. Install [`nodemon`](https://github.com/remy/nodemon) into the container at build time (by adding it to our `Dockerfile`).
2. Mount the source of the app as a shared folder from our host OS to the `Docker` container (by using [`docker-compose`](https://docs.docker.com/compose/)).

The steps we need to take are:

#### 1. Create a new file `docker-compose.yml`:
```
version: "2"

services:
  web:
    build: .
    command: nodemon --inspect=5858
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules
    ports:
      - "10080:8080"
      - "5858:5858"
```

Through this file, we're telling `Docker` to mount our current folder as a shared folder in the container's filesystem.

Mounting our current folder enables us to make changes and have them be served directly from the container as they occur.

**Note:** We need the `- /usr/src/app/node_modules` line in order to have the `node_modules` folder persisted as intermediate containers are being built.

#### 2. Install `nodemon` through `Dockerfile`
Add the following line to the `Dockerfile`:

```
FROM node:boron

RUN npm i -g nodemon           # <-- New Line

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm install

COPY . /usr/src/app

EXPOSE 8080

CMD [ "npm", "start" ]
```

#### 3. Run `docker-compose up` in order to bring up the project with the mounted folder and `nodemon` listening for changes:
![docker-compose running](http://i.imgur.com/v2HtnlF.png)

#### 4. Navigate to http://localhost:10080
![node app running in Docker](http://i.imgur.com/w3FKlVy.png)


#### 5. Make a change in the code and reload http://localhost:10080
![container showing changes](http://i.imgur.com/ZyAYBeM.png)

**Bonus**: *You can debug the Node app directly in the browser.*

Congrats. You're now a Docker guru (almost). 😎

---
Thanks for reading so far down! If you find any inconsistencies, please be sure to let me know. I hope this tutorial got you on the right track, `Docker`-wise. 👋
