"use client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Anton, Lexend } from "next/font/google";
import "./globals.css";

import { ContractContextProvider } from "./contexts/contractContext";
import { UserContextProvider } from "./contexts/userContext";

import {
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { hardhat, sepolia } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient } = configureChains(
  [sepolia, hardhat],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Nature DAO",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
});

const lexend = Lexend({ subsets: ["latin"], display: "swap" });
export const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#24280a",
        color: "white",
        fontFamily: lexend,
      },
      a: {
        textDecoration: "none",
      },
    },
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>NATURE - DAO for wildlife protection</title>
      </head>
      <body className={lexend.className}>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider
            chains={chains}
            theme={lightTheme({
              accentColor: "#22543D",
              accentColorForeground: "#ffffff",
            })}
          >
            <ChakraProvider theme={theme}>
              <UserContextProvider>
                <ContractContextProvider> {children}</ContractContextProvider>
              </UserContextProvider>
            </ChakraProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
