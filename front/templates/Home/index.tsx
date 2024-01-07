"use client";

import { AlertStatus } from "@/components/AlertStatus";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccount } from "@/contexts/AccountContext";
import { useContract } from "@/contexts/ContractContext";
import {
  BarChart2,
  Car,
  CircleDollarSign,
  Coins,
  Dice1,
  Moon,
  TrendingUp,
} from "lucide-react";

import moment from "moment";
import { LottoHistory } from "./components/LottoHistory";

export const Home = () => {
  const { connectMetaMask, address, accountData } = useAccount();
  const { buyTicket } = useContract();

  return (
    <div
      style={{
        backgroundImage: "url('https://i.imgur.com/SRFBp3L.png')",

        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className="h-3/4 grid grid-cols-2"
    >
      <div className="flex h-7/8 flex-col gap-8 justify-center">
        <div>
          <Alert className="mb-5">
            <Moon className="h-4 w-4" />
            <AlertTitle>Beta!</AlertTitle>
            <AlertDescription>
              We are in beta in MUMBAI testnet, get some faucets{" "}
              <a
                href="https://faucet.polygon.technology/"
                target="_blank"
                rel="noreferrer"
                className="underline font-bold"
              >
                here!
              </a>
            </AlertDescription>
          </Alert>
          <div className="flex items-center gap-2">
            <h1
              className="text-5xl font-bold mb-3"
              style={{ color: "var(--color-primary)" }}
            >
              Lotto.
            </h1>
            <CircleDollarSign />
          </div>
          <div>
            <p className="text-neutral-400 text-base">
              Welcome to our cryptocurrency lottery site! Here you have the
              chance to win big prizes by purchasing tickets with your favorite
              cryptocurrencies. We've made buying tickets simple and easy, with
              no need to provide personal information. You can buy as many
              tickets as you want and increase your chances of winning the grand
              cryptocurrency prize. With a fair and transparent lottery system,
              you can be sure that all tickets have an equal chance of being
              selected. And with our fast and secure cryptocurrency payments,
              you can receive your prize within minutes. So what are you waiting
              for? Buy your tickets now and start dreaming of the big
              cryptocurrency prize
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardHeader>
              <CardTitle>
                <Dice1 className="mb-1" />
                Really random
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-400 text-sm">
                The lottery is completely random, we use a random number
                generator to select the winner.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Car className="mb-1" />
                Fast and secure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-400 text-sm">
                We use the Polygon network to make fast and secure payments.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Coins className="mb-1" />
                Cryptocurrency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-400 text-sm">
                We accept payments in MATIC, ETH, USDC, USDT, DAI and WBTC.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            disabled={address ? true : false}
            onClick={() => connectMetaMask()}
            variant="outline"
          >
            {address ? "Connected!" : "Connect wallet"}
          </Button>
          <Button disabled={address ? false : true} onClick={() => buyTicket()}>
            Buy Ticket!
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 justify-center">
        <LottoHistory />

        <Tabs className="h-1/2 w-3/4" defaultValue="lotteryStatus">
          <TabsList>
            <TabsTrigger value="lotteryStatus">Lottery status</TabsTrigger>
            <TabsTrigger value="tickets">My tickets</TabsTrigger>
          </TabsList>
          <TabsContent className="flex flex-col gap-2" value="lotteryStatus">
            <AlertStatus />
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Lotto Session</CardTitle>
                <CardDescription>ID: 43322132</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Winner</span>
                    <span className="text-neutral-400">
                      0x56DFC05c19...4D0f73B7
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Status</span>
                    <span className="text-neutral-400">Finished</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Date</span>
                    <span className="text-neutral-400">
                      2021-08-11 12:00:00
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tickets">
            <Carousel className="w-full max-w-xl">
              <CarouselContent>
                {accountData?.tickets?.map((ticket: any) => (
                  <CarouselItem key={ticket.ticketId}>
                    <div className="p-1">
                      <Card>
                        <CardHeader>
                          <CardTitle>LottoTicket</CardTitle>
                          <CardDescription>
                            ID: {ticket.ticketId}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <span className="text-neutral-400">Price</span>
                              <span className="text-neutral-400">
                                0.1 MATIC
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-neutral-400">Status</span>
                              <span className="text-neutral-400">Pending</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-neutral-400">Date</span>
                              <span className="text-neutral-400">
                                {moment(ticket.timestamp * 1000).format(
                                  "YYYY-MM-DD HH:mm:ss"
                                )}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button
                            onClick={() => buyTicket()}
                            className="ml-auto mt-2"
                            variant="outline"
                          >
                            Buy another ticket!
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
