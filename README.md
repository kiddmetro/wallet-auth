## WalletAuth

WalletAuth leverages email or passkey authentication via Turnkey to create cryptocurrency wallets. The project is currently in development, with ongoing debugging to address existing issues. Email authentication is implemented, and passkey authentication will be integrated soon. Built using Next.js, TailwindCSS, and Turnkey, it employs standard modern development practices.

## Features

# Authentication: 
* Secure login using Auth0.
* Integration with Turnkey for automated wallet creation.

# Wallet Management:
* Automatic wallet initialization for new users via Turnkey.
* Dynamically fetch and display user wallets, supporting Ethereum-based wallets.

# Transaction Tracking:
* View transaction history for all wallets.
* Effortlessly transfer assets between wallets.

# User Experience:
* Clean, modern UI with intuitive navigation.
* Real-time wallet balance updates.
* Seamless onboarding by combining authentication and wallet creation in one step.

## How to Use WalletAuth

### Prerequisites

Before getting started with WalletAuth, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)
- [Turnkey docs](https://t.co/u2EfqFfl6V
- [Auth0 Account](https://auth0.com/)

### Getting Started

1. **Clone the repository:**

   First, clone the WalletAuth repository to your local machine:

   ```bash
   git clone https://github.com/yourusername/WalletAuth.git

2. **Install dependencies:**
    
    Navigate into the project directory and install the necessary dependencies:

    ```bash
    cd WalletAuth
    npm install

3. **Set up environment variables:**
    
    Create a .env.local file in the root of the project and add the following environment variables:

    ```bash
    TURNKEY_API_PUBLIC_KEY=
    TURNKEY_API_PRIVATE_KEY=
    NEXT_PUBLIC_TURNKEY_API_BASE_URL=https://api.turnkey.com
    NEXT_PUBLIC_ORGANIZATION_ID=

    AUTH0_SECRET='
    AUTH0_BASE_URL=
    AUTH0_ISSUER_BASE_UR=
    AUTH0_CLIENT_ID='4hI=
    AUTH0_CLIENT_SECRET=
   

4. **Run the development server:**

    Start the development server:

    ```bash
    npm run dev
    This will start the project on http://localhost:3000. 