import { toNumber } from "ethers";
import { Loader2, Trophy } from "lucide-react";
import moment from "moment";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useContract } from "@/contexts/ContractContext";
import { useAccount } from "@/contexts/AccountContext";
import { useState } from "react";

export const RoundInfoCard = ({ round }: any) => {
  const { claim } = useContract();
  const { address } = useAccount();

  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(round.claimed);

  const handleClaim = async () => {
    setLoading(true);
    await claim(round.id);
    setLoading(false);
    setClaimed(true);
  };

  return (
    <Card key={round.id}>
      <CardHeader>
        <CardTitle>LottoTicket</CardTitle>
        <CardDescription>
          Started Time:{" "}
          {moment(toNumber(round.startedTime) * 1000).format(
            "MM/DD/YYYY HH:mm:ss"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Winner</span>
            <span className="text-neutral-400">{round.winner}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Status</span>
            <span className="text-neutral-400">
              {round.claimed ? "Claimed" : "Not claimed"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Date</span>
            <span className="text-neutral-400">
              {moment(toNumber(round.timeToFinish) * 1000).format(
                "MM/DD/YYYY HH:mm:ss"
              )}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {round.winner.toLowerCase() == address.toLowerCase() && !claimed && (
          <div className=" flex items-center space-x-4 rounded-md border p-4 w-full">
            <Trophy />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">You won!</p>
              <p className="text-sm text-muted-foreground">Claim your prize!</p>
            </div>
            <Button disabled={claimed} variant="default" onClick={handleClaim}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Claim
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
