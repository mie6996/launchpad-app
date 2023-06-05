// import { useQuery } from '@tanstack/react-query';
import { ethers } from "ethers";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useAccount, useQuery } from "wagmi";
import { useStakingHook } from "../components/containers/staking/useStaking";
import { env } from "../env.mjs";
import { useErc20Contract } from "../libs/blockchain";
import {
  IDO_CONTRACT_STAKING_REQUIRED,
  IDO_CONTRACT_TAILWIND_COLORS,
  IDO_CONTRACT_ICON_PATHS,
  TierKeys,
} from "../server/api/routers/project/project.constant";

import {
  Work,
  Hero,
  Team,
  Tier,
  Benefits,
  Upcoming,
  Opening,
  Completed,
} from "packages/ui/src/lib/components/modules/index/index.js";
import { api } from "../utils/api";
import { Counter } from "@strawberry/ui";

function Home() {
  const { amountStaked } = useStakingHook();
  const { address: walletAddress, isConnected } = useAccount();

  const { data, isLoading, error, refetch } = api.project.getAll.useQuery({
    offset: 0,
    limit: 100,
  });

  const userTierIndex =
    isConnected &&
    amountStaked &&
    Object.values(IDO_CONTRACT_STAKING_REQUIRED).findIndex((value, index) => {
      return (
        amountStaked.gte(ethers.utils.parseEther(value.toString())) &&
        amountStaked.lt(
          ethers.utils.parseEther(
            IDO_CONTRACT_STAKING_REQUIRED[
              Object.keys(IDO_CONTRACT_STAKING_REQUIRED)[index + 1] as TierKeys
            ]?.toString() ?? "0"
          )
        )
      );
    });

  const tierList = Object.keys(TierKeys).map((key) => {
    return {
      name: key.replace("_", " "),
      stakingRequired: IDO_CONTRACT_STAKING_REQUIRED[key as TierKeys],
      color: IDO_CONTRACT_TAILWIND_COLORS[key as TierKeys],
      img: IDO_CONTRACT_ICON_PATHS[key as TierKeys],
    };
  });

  return (
    <>
      <Hero />
      <Counter />
      <Work stepNum={isConnected ? (userTierIndex ? 2 : 1) : 0} />
      <Upcoming
        data={data?.data?.filter((item) => item.sale.status === "UPCOMING")}
        isLoading={isLoading}
      />
      <Opening />
      <Completed
        data={data?.data?.filter((item) => item.sale.status === "CLOSED")}
        isLoading={isLoading}
      />
      <Benefits />
      <Tier tierList={tierList} currentTier={isConnected} />
      <Team />
    </>
  );
}

export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
});
