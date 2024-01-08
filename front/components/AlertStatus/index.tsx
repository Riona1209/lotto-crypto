import { BarChart2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { useContract } from "@/contexts/ContractContext";
import { useEffect, useRef, useState } from "react";
import { toNumber } from "ethers";
import moment from "moment";

export const AlertStatus = () => {
  const { lastLottery } = useContract();
  const [counter, setCounter] = useState("");
  const started = useRef(false);
  const loopRef = useRef<any>();

  useEffect(() => {
    if (!lastLottery || started.current == true) return;
    started.current = true;

    alert("started");

    if (!lastLottery.finishTrigger) return;

    counterLoop();
  }, [lastLottery]);

  const counterLoop = () => {
    const timestampFinish = toNumber(lastLottery?.timeToFinish) * 1000;

    const timestampFinishMoment = moment(timestampFinish);
    const timestampNowMoment = moment();

    const diff = timestampFinishMoment.diff(timestampNowMoment);
    const diffFormatted = moment.utc(diff).format("HH:mm:ss");

    setCounter(diffFormatted);

    if (diff <= 0) return clearTimeout(loopRef.current);

    loopRef.current = setTimeout(() => {
      counterLoop();
    }, 1000);
  };

  return (
    <Alert className="mt-1">
      <BarChart2 className="h-4 w-4" />
      <AlertTitle>Status</AlertTitle>
      <AlertDescription>Time to finish: {counter}</AlertDescription>
    </Alert>
  );
};
