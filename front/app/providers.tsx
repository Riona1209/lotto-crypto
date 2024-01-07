"use client";
import { Toaster } from "@/components/ui/sonner";
import AccountProvider from "@/contexts/AccountContext";
import ContractProvider from "@/contexts/ContractContext";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AccountProvider>
      <ContractProvider>
        <Toaster closeButton />
        {children}
      </ContractProvider>
    </AccountProvider>
  );
};
