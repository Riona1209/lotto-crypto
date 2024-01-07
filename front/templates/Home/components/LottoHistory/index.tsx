import { RoundInfoCard } from "@/components/RoundInfoCard";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useContract } from "@/contexts/ContractContext";

import { TrendingUp } from "lucide-react";

export const LottoHistory = () => {
  const { lastRounds } = useContract();

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
            <RoundInfoCard key={round.id} round={round} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
