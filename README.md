# Cowsay running on Express

## Build the docker container using the instructions from `Dockerfile`
```docker build -t cassilup/cowsay-express .```

## Start the docker container we just built
```docker run -p 10080:8080 -d cassilup/cowsay-express```
