'use client';

import { useTurnkey } from "@turnkey/sdk-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { TWalletDetails } from "../types"
// Define types
type subOrgFormData = {
  subOrgName: string;
};

type signingFormData = {
  messageToSign: string;
};

type TWalletState = TWalletDetails | null;

type TSignedMessage = {
  message: string;
  signature: string;
} | null;

const humanReadableDateTime = (): string => {
  return new Date().toLocaleString().replaceAll("/", "-").replaceAll(":", ".");
};

export default function Home() {
  const { turnkey, passkeyClient } = useTurnkey();

  const [wallet, setWallet] = useState<TWalletState>(null);
  const [signedMessage, setSignedMessage] = useState<TSignedMessage>(null);

  useEffect(() => {
    (async () => {
      if (!wallet) {
        await turnkey?.logoutUser();
      }
    })();
  });

  const signMessage = async (data: signingFormData) => {
    if (!wallet) {
      throw new Error("wallet not found");
    }

    // Simulate signing (replace this with your own logic if needed)
    const signedMessage = btoa(data.messageToSign); // Example encoding for demonstration

    setSignedMessage({
      message: data.messageToSign,
      signature: signedMessage,
    });
  };

  const createSubOrgAndWallet = async () => {
    const subOrgName = `Turnkey WalletAuth + Passkey Demo - ${humanReadableDateTime()}`;
    const credential = await passkeyClient?.createUserPasskey({
      publicKey: {
        rp: {
          id: "localhost",
          name: "Turnkey Passkey",
        },
        user: {
          name: subOrgName,
          displayName: subOrgName,
        },
      },
    });

    if (!credential?.encodedChallenge || !credential?.attestation) {
      return false;
    }

    // Use fetch instead of axios
    const res = await fetch("/api/createSubOrg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subOrgName: subOrgName,
        challenge: credential?.encodedChallenge,
        attestation: credential?.attestation,
      }),
    });

    const response = (await res.json()) as TWalletDetails;
    setWallet(response);
  };

  const login = async () => {
    try {
      const loginResponse = await passkeyClient?.login();
      if (!loginResponse?.organizationId) {
        return;
      }

      const currentUserSession = await turnkey?.currentUserSession();
      if (!currentUserSession) {
        return;
      }

      const walletsResponse = await currentUserSession?.getWallets();
      if (!walletsResponse?.wallets[0].walletId) {
        return;
      }

      const walletId = walletsResponse?.wallets[0].walletId;
      const walletAccountsResponse =
        await currentUserSession?.getWalletAccounts({
          organizationId: loginResponse?.organizationId,
          walletId,
        });
      if (!walletAccountsResponse?.accounts[0].address) {
        return;
      }

      setWallet({
        id: walletId,
        address: walletAccountsResponse?.accounts[0].address,
        subOrgId: loginResponse.organizationId,
      } as TWalletDetails);
    } catch (e: any) {
      console.error(`Caught error: ${e.toString()}`);
      alert(`Error: ${e.toString()}`);
    }
  };

  return (
    <main className="flex flex-col items-center text-center p-8 gap-8 font-sans max-w-2xl mx-auto">
      <a href="https://turnkey.com" target="_blank" rel="noopener noreferrer">
        <Image
          src="/logo.svg"
          alt="Turnkey Logo"
          className="w-24 h-6"
          priority
        />
      </a>

      <div>
        {wallet && (
          <div className="text-sm bg-gray-100 p-4 rounded shadow">
            <p>Your sub-org ID:</p>
            <p className="font-bold break-words">{wallet.subOrgId}</p>
            <p>ETH address:</p>
            <p className="font-bold break-words">{wallet.address}</p>
          </div>
        )}
        {signedMessage && (
          <div className="text-sm bg-gray-100 p-4 rounded shadow">
            <p>Message:</p>
            <p className="font-bold break-words">{signedMessage.message}</p>
            <p>Signature:</p>
            <p className="font-bold break-words">{signedMessage.signature}</p>
          </div>
        )}
      </div>

      {!wallet && (
        <div>
          <h2 className="text-lg font-bold">Create a new wallet</h2>
          <p className="text-sm text-gray-600">
            Create a passkey and wallet for your sub-organization.
          </p>
          <form onSubmit={subOrgFormSubmit(createSubOrgAndWallet)}>
            <button
              type="submit"
              className="bg-gray-800 text-white py-2 px-4 rounded shadow"
            >
              Create new wallet
            </button>
          </form>

          <h2 className="mt-8 text-lg font-bold">
            Already created your wallet?
          </h2>
          <form onSubmit={loginFormSubmit(login)}>
            <button
              type="submit"
              className="bg-gray-800 text-white py-2 px-4 rounded shadow"
            >
              Login to sub-org with existing passkey
            </button>
          </form>
        </div>
      )}

      {wallet && (
        <div>
          <h2 className="text-lg font-bold">Sign a message</h2>
          <form onSubmit={signingFormSubmit(signMessage)}>
            <input
              {...signingFormRegister("messageToSign")}
              placeholder="Write something to sign..."
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              type="submit"
              className="mt-4 bg-gray-800 text-white py-2 px-4 rounded shadow"
            >
              Sign Message
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
