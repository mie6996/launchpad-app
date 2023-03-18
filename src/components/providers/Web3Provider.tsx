import { ExternalProvider } from "@ethersproject/providers";
import { message } from "antd";
import { ethers } from "ethers";
import React, { useEffect } from "react";
import { isWalletInstalled } from "../../utils/ethereum";
import { useWeb3App } from "../common/ConnectWalletButton/store";

type Props = {
  children: React.ReactNode;
};

export function Web3Provider({ children }: Props) {
  const { connector } = useWeb3App();

  useEffect(() => {
    if (isWalletInstalled()) {
      const ethereum = window.ethereum as ExternalProvider;

      if (!ethereum?.request) {
        message.error("Please install MetaMask");
        return;
      }

      // on chain change, reload the page
      (ethereum as any)?.on("chainChanged", () => {
        window.location.reload();
      });

      connector?.connectEagerly();
    }
  }, [ethers]);

  return <>{children}</>;
}
