"use client";

import { Flex } from "@chakra-ui/react";
import KPICard from "./KPICard";
import { useContractContext } from "@/app/contexts/contractContext";

const KPIs = () => {
  const { phase, projects, NatureDAOBalance, donationEvents } =
    useContractContext();

  const donators = [];
  const map = new Map();
  for (const event of donationEvents) {
    if (!map.has(event.address)) {
      map.set(event.address, true);
      donators.push(event.address);
    }
  }

  const electedProjects = projects.filter((project) => project.voteCount > 0);

  return (
    <Flex gap="4">
      <KPICard
        title={`${phase === 3 ? "Granted" : "Curated"} projects`}
        value={phase === 3 ? electedProjects.length : projects.length}
      />
      <KPICard title="Donators" value={donators.length} />
      <KPICard
        title={`${phase === 3 ? "Remaining funds" : "Funds raised"}`}
        value={NatureDAOBalance}
      />
    </Flex>
  );
};

export default KPIs;
