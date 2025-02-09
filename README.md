# Face Way

## Project Overview
This project aims to develop a kiosk application that utilizes face recognition technology to enhance customer interactions. The software is designed to identify individuals as they approach the kiosk, personalize the user experience by retrieving their profile, and allow for seamless interaction without the need for manual input.

## Features
- **Face Recognition Login**: Automatically logs in users by recognizing their faces without the need for traditional username and password inputs.
- **Personalized Experience**: Dynamically adjusts the kiosk interface based on the identified user's preferences and history.
- **Point System Integration**: Displays the user's current points and related promotional offers based on their account details.

## Technologies Used
- **Frontend**: React.js
- **Backend**: Express   
- **Face Recognition Software**: face-api.js with tensorflow.js
- **Database**: Stored locally on device 

## Getting Started

### Prerequisites
- Node.js

### Installation
1. Clone the repository:
git clone https://github.com/kirtanpatel2003/FaceWay.git

2. Install the necessary packages:
cd FaceWay
cd backend
npm install
node server.js
cd..
cd faceway
npm install
npm start

4. Setup the environment variables in a .env file such as API keys.

## Deployment

### Hardware Requirements
Before deploying the software, ensure the kiosk hardware meets the following criteria:
- **Camera**: High-definition camera capable of capturing clear video in various lighting conditions.
- **Processor**: Adequate processing power to handle real-time face recognition computations (e.g., Intel i5/i7 or equivalent).
- **Memory**: At least 8GB of RAM for smooth operation.
- **Storage**: Sufficient storage space for the operating system, application, and data logs, with at least 50GB of free space recommended.
- **Display**: Touchscreen display for interactive user interface.

### Software Setup
1. **Operating System**: The kiosk should run on a stable version of Linux or Windows that supports all the necessary drivers for hardware components, especially the camera and touchscreen display.

2. **Install Node.js and MongoDB**:
   - Install Node.js from [Node.js official website](https://nodejs.org/).
   - Install MongoDB following the instructions on [MongoDB's official documentation](https://docs.mongodb.com/manual/installation/).

3. **Application Installation**:
   - Transfer the application files to the kiosk's local storage.
   - Open a terminal in the application directory and run `npm install` to install all dependencies.

4. **Environment Configuration**:
   - Configure the `.env` file with the correct database connection string and any other necessary environment variables.

5. **Starting the Application**:
   - To start the application, run `npm start` This command is part of the startup script so that the application automatically starts when the kiosk is turned on.


###Authors
- Kirtan Patel 
- Dev shah
- Neel Patel
- Dravya Dholakiya 
- Dhru Patel


### Acknowledgments

- Face.api.js: https://github.com/justadudewhohacks/face-api.js
- https://itnext.io/face-api-js-javascript-api-for-face-recognition-in-the-browser-with-tensorflow-js-bcc2a6c4cf07

