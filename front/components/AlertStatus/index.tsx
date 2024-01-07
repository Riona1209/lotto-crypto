import { BarChart2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { useContract } from "@/contexts/ContractContext";
import { useEffect, useRef, useState } from "react";
import { toNumber } from "ethers";

export const AlertStatus = () => {
  const { lastLottery } = useContract();
  const [counter, setCounter] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!lastLottery || started.current == true) return;
    started.current = true;

    const timestampFinish = toNumber(lastLottery?.timeToFinish);
  }, [lastLottery]);

  return (
    <Alert className="mt-1">
      <BarChart2 className="h-4 w-4" />
      <AlertTitle>Status</AlertTitle>
      <AlertDescription>Time to finish: 00:00:00</AlertDescription>
    </Alert>
  );
};
