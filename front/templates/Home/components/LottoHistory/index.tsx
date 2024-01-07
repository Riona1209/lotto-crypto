import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAccount } from "@/contexts/AccountContext";
import { useContract } from "@/contexts/ContractContext";
import { toNumber } from "ethers";
import { Coins, TrendingUp, Trophy } from "lucide-react";
import moment from "moment";

export const LottoHistory = () => {
  const { lastRounds, claim } = useContract();
  const { address } = useAccount();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="mb-4">
          <TrendingUp className="mr-2" /> See lotto history.
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Last lotto's</DialogTitle>
          <DialogDescription>
            Here you can see the last lotto's and their winners.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 flex-col">
          {lastRounds.map((round: any) => (
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
                {round.winner.toLowerCase() == address.toLowerCase() &&
                  !round.claimed && (
                    <div className=" flex items-center space-x-4 rounded-md border p-4 w-full">
                      <Trophy />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          You won!
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Claim your prize!
                        </p>
                      </div>
                      <Button variant="default" onClick={() => claim(round.id)}>
                        Claim
                      </Button>
                    </div>
                  )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
