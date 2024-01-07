import { Contract, ethers, toNumber } from "ethers";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import LottoAbi from "../deployments/polygonMumbai/Lottery.json";
import { toast } from "sonner";
import { useAccount } from "./AccountContext";

type ContractContextType = {
  buyTicket: () => Promise<void>;
  lastLottery: any;
  lastRounds: any;
  claim: (loteryId: number | string) => Promise<void>;
  currentStep?: "idle" | "waitAccept" | "waitTransition" | "finished";
};

const ContractContext = createContext({} as ContractContextType);

export const useContract = () => useContext(ContractContext);

export default function ContractProvider({ children }: any) {
  const { setAccountData, address, accountData } = useAccount();
  const [lastLottery, setLastLottery] = useState<any>(null);
  const [lastRounds, setLastRounds] = useState<any>([]);
  const refreshInterval = useRef<any>(null);

  const [currentStep, setCurrentStep] = useState<
    "idle" | "waitAccept" | "waitTransition" | "finished"
  >("idle");

  useEffect(() => {
    refreshInterval.current = setInterval(() => {
      refresh();
    }, 6000);
  }, []);

  useEffect(() => {
    if (!address) return;
    refresh();
    getLastRounds();
  }, [address]);

  const getProvider = () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider;
  };

  const getContract = async () => {
    const provider = getProvider();
    const signer = await provider.getSigner();
    const contract = new Contract(LottoAbi.address, LottoAbi.abi, signer);

    return contract;
  };

  const refresh = async () => {
    const signer = await getProvider().getSigner();
    if (!signer.getAddress()) return;
    try {
      updateLastLotteryInfo();
      getUserStatus();
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastLotteryInfo = async () => {
    const lastLottery = (await getLastLottery()).toObject();

    setLastLottery(lastLottery);
  };

  const buyTicket = async () => {
    try {
      const lottoContract = await getContract();
      const lastLottery = await getLastLottery();
      const lotteryPrice = await lastLottery.ticketPrice;

      console.log("abriu metamask");
      setCurrentStep("waitAccept");

      const tx = await lottoContract.buyTicket({
        value: lotteryPrice,
      });

      setCurrentStep("waitTransition");

      const receipt = await tx.wait();

      setCurrentStep("finished");

      toast.success("Ticket bought successfully");
      refresh();
    } catch (error: any) {
      handleError(error);
    }
  };

  const getLastLottery = async () => {
    try {
      const lottoContract = await getContract();
      const currentLottoId = await lottoContract.lotteryId();
      const lotteryStatus = await lottoContract.getLotteryStatus(
        currentLottoId
      );

      return lotteryStatus;
    } catch (error) {
      toast.error("Error getting last lottery");
    }
  };

  const getUserStatus = async () => {
    try {
      const lottoContract = await getContract();
      const currentWallet = (await getProvider().getSigner()).getAddress();
      const currentLottoId = await lottoContract.lotteryId();
      const userStatusInLastLottery = await lottoContract.getUserStatus(
        currentLottoId,
        currentWallet
      );

      const tickets = userStatusInLastLottery.tickets.map((ticket: any) => ({
        ticketId: toNumber(ticket.ticketId),
        timestamp: toNumber(ticket.timestamp),
      }));

      setAccountData({
        ...accountData,
        tickets,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getLastRounds = async () => {
    try {
      const lottoContract = await getContract();

      const currentLottoId = await lottoContract.lotteryId();
      console.log(currentLottoId);

      const lastRounds = [];

      for (let i = 1; i < currentLottoId; i++) {
        const roundData = await lottoContract.getLotteryStatus(i);
        const roundObject = roundData.toObject();

        lastRounds.push({ ...roundObject, id: i });
      }

      setLastRounds(lastRounds);
    } catch (error) {
      console.log(error);
    }
  };

  const claim = async (loteryId: number | string) => {
    try {
      const lottoContract = await getContract();
      const tx = await lottoContract.claim(loteryId);
      const receipt = await tx.wait();
      toast.success("Claimed successfully");
      refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const handleError = (error: any) => {
    toast.error(error.message);
  };

  return (
    <ContractContext.Provider
      value={{
        buyTicket,
        lastLottery,
        lastRounds,
        claim,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
}
