import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAccount } from "@/contexts/AccountContext";
import { Steps } from "antd";
import { useContract } from "@/contexts/ContractContext";
import { useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Hash, Terminal, Ticket } from "lucide-react";

export const BuyTicketModal = () => {
  const { address } = useAccount();
  const { buyTicket, currentTxInfo, currentStep } = useContract();

  const [open, setOpen] = useState(false);

  const handleBuyTicket = async () => {
    setOpen(true);
    await buyTicket().catch(() => setOpen(false));
  };

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button
          disabled={address ? false : true}
          onClick={() => handleBuyTicket()}
        >
          Buy Ticket!
        </Button>
      </DialogTrigger>
      <DialogContent closeButton={false} className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Processing payment...</DialogTitle>
          <DialogDescription>
            Please wait until the transaction is confirmed.
          </DialogDescription>
        </DialogHeader>

        <Steps
          size="small"
          current={currentStep}
          items={[
            {
              title: "Initializing",
            },
            {
              title: "Waiting for confirmation",
            },
            {
              title: "Processing payment",
            },
          ]}
        />

        {currentStep === 0 && (
          <div className="flex flex-col gap-4 mt-4">
            <span className="text-neutral-400">Initializing...</span>
            <span className="text-neutral-400">
              Please wait until the transaction is confirmed.
            </span>
          </div>
        )}

        {currentStep === 1 && (
          <div className="flex flex-col gap-4 mt-4">
            <span className="text-neutral-400">
              Waiting for confirmation...
            </span>
            <span className="text-neutral-400">
              Please wait until the transaction is confirmed.
            </span>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex flex-col gap-4 mt-4">
            <span className="text-neutral-400">Processing payment...</span>
            <span className="text-neutral-400">
              Please wait until the transaction is confirmed.
            </span>
            <Alert>
              <Hash className="h-5 w-5 mr-2" />
              <AlertTitle>Transition hash!</AlertTitle>
              <AlertDescription>{currentTxInfo?.hash}</AlertDescription>
            </Alert>
            <Button
              onClick={() => {
                window.open(
                  `https://mumbai.polygonscan.com/tx/${currentTxInfo?.hash}`,
                  "_blank"
                );
              }}
              variant="secondary"
            >
              View on explorer
            </Button>
          </div>
        )}

        {currentStep === 3 && (
          <>
            <Alert>
              <Ticket
                className="h-5 w-5 mr-2"
                style={{
                  color: "#10B981",
                }}
              />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                You have successfully bought a ticket!
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => {
                window.open(
                  `https://mumbai.polygonscan.com/tx/${currentTxInfo?.hash}`,
                  "_blank"
                );
              }}
              variant="secondary"
            >
              View on explorer
            </Button>
          </>
        )}

        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
