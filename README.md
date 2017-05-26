# Cowsay running on Express

## Build the docker container using the instructions from `Dockerfile`
```
$ docker build -t cowsay-express .
```

## Start the docker container we just built
```
$ docker run -p 10080:8080 -d cowsay-express
```



---
Helpful commands:
```
$ docker build -t <TAG> .
$ docker run -p <EXPOSED PORT>:<DOCKER MACHINE PORT> -d <TAG>
$ docker exec -it <ID> /bin/sh
$ docker stop <ID>
$ docker rm <ID>
$ docker rmi <TAG>
```
