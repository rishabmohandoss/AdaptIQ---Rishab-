
Step 1: Switch into frontend folder
cd frontend

Step 2: Tag and build the docker image
docker build -t react-frontend .

Step 3: Publish docker image to docker desktop and push to registry
docker push docker-username/react-frontend

Step 4: Tag and build docker image of docker repository
 docker build -t docker-username/react-frotend .

Step 3: Confirm that the image has been successfuly built
docker image ls

Step 4: Push docker image to registry
docker push docker-username/react-frontend



P.S. In order to use these commands you must install docker desktop and have the app open. If docker is not open and running in the background, the commands docker commands will fail.