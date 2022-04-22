# Public Transport Manager
App for managing public transport system

## Setup
To run this application you need Docker installed on your computer.
1. If you are running this app for the first time, navigate to `./api` folder and run command:
```
mvn clean install -DskipTests
```
or execute it via your favourite IDE, ex. InteliJ IDEA 

2. Go back to the main directory and type in console: <br> 
```
docker compose up
```
3. Open your web browser and navigate to http://localhost:80/

4. Log in with sample manager credentials: <br> 
email: `manager@example.com` <br>
password: `passwd` <br> <br>
You can change default data and user settings in `init.sql` file