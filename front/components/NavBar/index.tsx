import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export const Navbar = () => {
  const wallet = "0x56DFC05c1ec7759f065b10815949ee464D0f73B7";

  const walletMini = `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;

  return (
    <>
      <nav className="flex items-center justify-between p-4 px-6">
        <div>
          <h1 className="font-bold text-xl">LottoCrypto</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-neutral-400">{walletMini}</span>
          <Button size="icon" variant="ghost">
            <LogOut></LogOut>
          </Button>
        </div>
      </nav>
      <Separator />
    </>
  );
};
