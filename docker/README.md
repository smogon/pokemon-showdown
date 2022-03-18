# Pokémon Showdown Docker

This Dockerfile will build an image that can be used to run a docker container with. This application needs runs on port 8000, so you need to bind that port to your host. If you want to use a custom config you will also need to supply your own `config.js`, an example of this can be found at `config/config-example.js` of this repository.


# Building & Running

To build this image copy `Dockerfile` onto your computer to run with docker run or docker compose. You will need docker and/or docker-compose installed depending on what method you use. This Dockerfile will run the latest released version of Pokémon Showdown at the time  of building.

##  Using docker run

We will build the image first and then run it as a container. 
While in the same directory this command will build the image and tag it as `pokemon-showdown`.
```
docker build . -t pokmon-showdown
```

After that we will want to run our image, publish port 8000, and add our custom config we have to the container. 
```
docker run -p 8000 -v /path/to/config.js:/config.js pokemon-showdown
```
If you do use the custom config make sure you include the path to `config.js` on your system. If you do not want to use a `config.js` just leave out `-v /path/to/config.js:/config.js`.

## Using docker-compose

This method requires you to have a docker-compose and docker installed. You will also need to make a `docker-compose.yaml` before you can run the container. This `docker-compose.yaml` will build the image and run it for you. The file you make should be placed in the same directory as the `Dockerfile` you have downloaded. 
```
version: "2.4"  
services:  
  pokemon-showdown:  
	  build: .  
    container_name: pokemon-showdown  
    ports:  
      - "8000:8000"  
    volumes:  
      - ./config.js:/config.js
```
To run the file enter the command `docker-compose up -d` in your terminal or powershell.  
