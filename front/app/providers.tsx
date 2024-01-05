"use client";
import { Toaster } from "@/components/ui/sonner";
import AccountProvider from "@/contexts/AccountContext";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AccountProvider>
      <Toaster closeButton />
      {children}
    </AccountProvider>
  );
};
