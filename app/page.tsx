"use client";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useState, useEffect } from "react";

export default function Home() {
  const { user, isLoading } = useUser();
  const [wallet, setWallet] = useState(null);


  useEffect(() => {
    if (user) {
      const fetchWallet = async () => {
        const response = await fetch("/api/createwallet", {
          method: "GET",
        });

        // Check if the response is OK (status code 200)
        if (response.ok) {
          try {
            const data = await response.json();
            if (data.wallet) {
              setWallet(data.wallet);
            } else {
              console.error("No wallet data received:", data);
            }
          } catch (error) {
            console.error("Failed to parse JSON:", error);
          }
        } else {
          console.error(
            "Failed to fetch wallet. Status code:",
            response.status
          );
        }
      };

      fetchWallet();
    }
  }, [user]);
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Head>
        <title>Wallet Create Landing</title>
        <meta
          name="description"
          content="Connect your wallet easily using new technology"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="bg-purple-600 text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">WalletAuth</h1>
          <div>
            {!isLoading && user && (
              <Link
                href="/api/auth/logout"
                className="bg-white text-purple-600 px-3 py-1 rounded-md shadow hover:bg-gray-200"
              >
                Logout
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Navbar for logged-in users */}
      {user && (
        <nav className="bg-gray-800 text-white py-4">
          <div className="container mx-auto px-4 flex justify-around">
            <Link href="/send" className="flex items-center space-x-2">
              <Image src="/send.svg" alt="Send Icon" width={24} height={24} />
              <span>Send</span>
            </Link>
            <Link href="/receive" className="flex items-center space-x-2">
              <Image
                src="/receive.svg"
                alt="Receive Icon"
                width={24}
                height={24}
              />
              <span>Receive</span>
            </Link>
            <Link href="/transaction" className="flex items-center space-x-2">
              <Image
                src="/transaction.svg"
                alt="Transaction Icon"
                width={24}
                height={24}
              />
              <span>Transaction</span>
            </Link>
          </div>
        </nav>
      )}

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center py-12">
        <div className="text-center max-w-2xl mx-auto px-4">
          {!user && (
            <>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-800">
                Seamlessly Create Your Wallet
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Use advanced authentication methods like email or passkeys to
                securely create your wallet. Our platform ensures a seamless and
                secure experience for all your transactions.
              </p>
            </>
          )}

          {/* Display Wallet Info */}
          {!isLoading && user ? (
            <div className="space-y-4 mt-6 w-full max-w-sm text-center">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-gray-800 text-lg font-medium">
                  Welcome, {user.name || "User"}!
                </p>
                <div className="mt-4">
                  <div className="bg-gray-200 p-6 rounded-md w-full">
                    <p className="text-gray-800">
                      Name: {user.name || "Anonymous"}
                    </p>
                    <p className="text-gray-800 text-xl font-semibold mt-2">
                      Balance: {wallet ? wallet.balance : "0"} cUSD
                    </p>
                  </div>
                  <div className="mt-4 text-gray-800">
                    <p className="mb-2">Wallet</p>
                    {wallet ? (
                      <p className="text-gray-800">
                        Wallet address: {wallet.walletAddress}
                      </p>
                    ) : (
                      <p>No wallets available</p>
                    )}
                    <button
                      className="mt-4 w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
                      onClick={() => console.log("Create wallet action")}
                    >
                      Create Wallet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 mt-6 w-full max-w-sm">
              <Link
                href="/api/auth/login"
                className="auth-card flex items-center p-4 bg-white border-2 border-gray-200 rounded-lg transition hover:border-purple-600 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              >
                <Image
                  src="/email.svg"
                  alt="Email Icon"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <span className="ml-4 text-gray-800 font-medium">
                  Wallet with Email
                </span>
              </Link>
              <div className="space-y-4 mt-6 w-full max-w-sm">
                <Link
                  href="/passkey/" // Direct to passkeys page here
                  className="auth-card flex items-center p-4 bg-white border-2 border-gray-200 rounded-lg transition hover:border-purple-600 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                >
                  <Image
                    src="/key.svg"
                    alt="Passkey Icon"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                  <span className="ml-4 text-gray-800 font-medium">
                    Wallet with Passkeys
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 WalletAuth. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
