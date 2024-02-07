
# Coding with Callie Todo App

Welcome to the Coding with Callie Todo App, a feature-rich todo management application that goes beyond the basics. This application allows users to seamlessly create, edit, and delete todos while providing a personalized experience with custom themes. Users can organize their tasks in a calendar view, providing a visual representation of their schedule. Additionally, the app integrates with Google Calendar, enhancing connectivity and ensuring users stay on top of their commitments. The inclusion of insightful data graphs offers users a comprehensive overview of their productivity trends. With secure account creation and customization options, the Coding with Callie Todo App is designed to elevate your task management experience.
## Tech Stack

### Client:
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Chakra](https://img.shields.io/badge/chakra-%234ED1C5.svg?style=for-the-badge&logo=chakraui&logoColor=white)

### Server: 
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Node](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)


## Features

- Todo C.R.U.D Operations
- Custom Themes
- Task Priority & Categorization
- Authentication & Authorization
- Calendar and data views


## Run Locally

Clone the project

```bash
  git clone https://github.com/G4be34/coding-with-callie-todo-app/
```

To install initial dependencies, navigate to the root directory of the project in your terminal and run 

```bash
  yarn
```

Afterwards, install all the dependencies by running

```bash
  yarn install-all
```

Please see the 'Environment Variables' section before running this command. Once finished, run the command below. 

```bash
  yarn dev
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file in the 'backend' directory

`DB_HOST=`

`DB_PASSWORD=`

`DB_USERNAME=`

`DB_NAME=`

`DB_PORT=`

`JWT_SECRET=`

`EMAIL_USER=` (Gmail address that will be used to send verification emails)

`EMAIL_PASS=` (App password for the email address, for instructions on creating an app password in Gmail [click here](https://support.google.com/mail/answer/185833?hl=en))
