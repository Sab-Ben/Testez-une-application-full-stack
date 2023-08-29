# Yoga App
Yoga App is an application that allows users 
to susbcribe or unsubscribe from yoga classes. 
The administrator organizes sessions according to the teachers available. 

## Technologies
- NodeJS v16+
- Angular CLI v14+
- Java 11+
- SpringBoot v3.0.4
- MySQL v8.0
- Maven (installed on your system or available with your IDE)
- Docker
- Jest
- Cypress
- JUnit
- Mockito

## Authors
Our code squad: Joffrey from OpenClassrooms about the application,
and Sabrina student from OpenClassrooms about testing of the application.

## Contribute to the project
Yoga App is available on my github via the following link 
"https://github.com/Sab-Ben/Testez-une-application-full-stack.git".
When the project is cloned, it must be create a database with MySQL
and use file script.sql available via 
Testez-une-application-full-stack/resources/sql/script.sql

### MySQL
If you have Docker, create an image with the following command line "docker pull mysql" to get the latest one.
The MySQL image requires that you supply a root password. 
You cannot set this in the Docker Desktop GUI and must do so through the command line (PowerShell or cmd):
docker run --name my-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=mypassword -d mysql. A terminal window should appear. First run mysql -u root -p and enter your specified root password when prompted.
Once you reach the MySQL prompt, run the following commands 'CREATE DATABASE yoga-app;',
then retrieve the information from the script.sql file and copy and paste it into the terminal window.

### Build
On terminal use command line `cd-front` and then `npm install` to install nodes_modules.

### Tests

### E2E Tests
Launching e2e test:
> npm run e2e

Generate coverage report (you should launch e2e test before):
> npm run e2e:coverage

Report is available here:
> front/coverage/lcov-report/index.html

### Jest Tests
If you don't have jest, you can install with :
> npm install jest --global

Launching test:
> jest

Generate coverage report :
> jest --coverage

Report is also available here:
> front/coverage/jest/lcov-report/index.html

### JUnit Tests
For launch and generate the jacoco code coverage:
> mvn clean package

Report is available here:
> target/site/jacoco/index.html


## Licensing
This project was created by OpenClassrooms 
for the training course "Développeur Fullstack Java-Angular".