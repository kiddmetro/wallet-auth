// src/pages/api/create-wallet.ts (or src/app/api/create-wallet/route.ts)
import { NextApiRequest, NextApiResponse } from "next";
import { DEFAULT_ETHEREUM_ACCOUNTS, Turnkey } from "@turnkey/sdk-server";

type CreateWalletRequestBody = {
  // Define the correct properties based on the Turnkey API documentation
  walletName: string; // Example property, adjust as needed
  // Add other required fields for wallet creation here
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Validate incoming data
    const { walletName }: CreateWalletRequestBody = req.body;

    if (!walletName) {
      return res.status(400).json({ error: "Wallet name is required" });
    }

    // Instantiate the Turnkey client
    const turnkey = new Turnkey({
      apiBaseUrl: "https://api.turnkey.com",
      apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY!,
      apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY!,
      defaultOrganizationId: process.env.TURNKEY_ORGANIZATION_ID!,
    });

    const apiClient = turnkey.apiClient();

    // Create wallet with the provided parameters
    const response = await apiClient.createWallet({
      walletName: walletName,
      accounts: DEFAULT_ETHEREUM_ACCOUNTS,
      // Add other parameters if necessary
    });

    // Send a successful response
    res.status(200).json(response);
  } catch (error) {
    console.error("Error creating wallet:", error);
    res.status(500).json({ error: "Failed to create wallet" });
  }
}
