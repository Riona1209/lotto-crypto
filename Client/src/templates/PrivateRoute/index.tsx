import { useEthersStore } from "@/store/ethersStore";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentWallet, isOwner } = useEthersStore();
  const router = useRouter();
  const isBrowser = typeof window !== "undefined";

  useEffect(() => {
    if (!currentWallet || !isOwner) {
      router.push("/");
    }
  }, [currentWallet, isOwner]);

  return (
    <>
      {!isBrowser && null}
      {isBrowser && currentWallet && isOwner && children}
    </>
  );
};
