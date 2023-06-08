import { ThemeProvider } from "@mui/material";
import type { AppType } from "next/app";
import NextNProgress from "nextjs-progressbar";
import { Toaster } from "react-hot-toast";
import { wagmiClient } from "shared";
import { WagmiConfig } from "wagmi";
import { Providers } from "../components/providers";
import "../styles/globals.css";
import { api } from "../utils/api";
import { theme } from "../utils/theme";
import { UiProvider } from "@strawberry/ui";
import { useEffect, useState } from "react";

const MyApp: AppType = ({ Component, pageProps }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  return (
    <WagmiConfig config={wagmiClient}>
      <UiProvider>
        <ThemeProvider theme={theme}>
          <Toaster
            position="top-right"
            containerStyle={{
              top: 80,
            }}
          />
          <NextNProgress />
          <Providers>
            <Component {...pageProps} />
          </Providers>
        </ThemeProvider>
      </UiProvider>
    </WagmiConfig>
  );
};

export default api.withTRPC(MyApp);
