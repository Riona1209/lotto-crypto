import { useEthersStore } from "@/store/ethersStore";
import { useEffect, useState } from "react";

type EditPropeties = {
  name: string;
  ticketPrice: number;
  minTicket: number;
  configFinishTime: number;
  configTimeToClaim: number;
  fee: number;
};

export const useAdmin = () => {
  const contract = useEthersStore((state) => state.lottoContract);
  const setIsOwner = useEthersStore((state) => state.setIsOwner);
  const currentWallet = useEthersStore((state) => state.currentWallet);

  const getOwner = async () => {
    if (!contract) return;
    const owner = await contract.owner();
    if (owner.toLowerCase() == currentWallet.toLowerCase()) {
      setIsOwner(true);
      return;
    }
    setIsOwner(false);
  };

  const editPropeties = async (newPropeties: EditPropeties) => {
    if (!contract) return;
    try {
      const tx = await contract.setProperties(
        newPropeties.name,
        newPropeties.ticketPrice,
        newPropeties.minTicket,
        newPropeties.configFinishTime,
        newPropeties.configTimeToClaim,
        newPropeties.fee
      );
      await tx.wait();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    editPropeties,
    getOwner,
  };
};
