# PopDapp

PopDapp is a blockchain-based event management platform designed to streamline event creation, attendance tracking, and user engagement. Built on the Internet Computer, it features a Motoko-based backend and a React-based frontend for seamless user interaction.

## Features

- **Event Management**: Users can create, view, and delete events with details such as name, description, location, and time.
- **Attendance Tracking**: Users can check in to events, and their attendance is securely recorded on the blockchain.
- **Leaderboard**: Displays the most active participants based on their attendance count.
- **Authentication**: Secure login using Internet Computer's identity provider (Internet Identity).

## Prerequisites

Before setting up PopDapp, ensure that the following are installed:

- Node.js (LTS recommended)
- DFX SDK

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Tonyflam/proof_of_presence_dapp.git
   cd popdapp
2. **Start the Internet Computer Local Replica**

```bash
dfx start --background
```

3. **Install Dependencies**
Navigate to the frontend directory and install the required packages:

```bash
cd frontend
npm install
```
4. **Deploy the Backend Canisters**
Deploy the Motoko-based backend to the local Internet Computer:

```bash
dfx deploy
```
5. **Start the Frontend**
Run the frontend React application:

```bash
npm start
```


## Usage

Open the frontend in your browser (usually at http://localhost:3000).

Log in using Internet Identity.

Create and manage events.

Check-in to events and track attendance.

View the leaderboard to see the most active participants.




## Deployment on Mainnet

To deploy PopDapp on the Internet Computer mainnet, run:

```bash

dfx deploy --network ic
```
Ensure your dfx identity is configured correctly and has the required cycles to deploy.




## Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests.




## Need Help?

Open an issue or reach out via Twitter at uniq_minds.
