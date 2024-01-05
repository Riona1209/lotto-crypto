import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

declare global {
  interface Window {
    ethereum: any;
  }
}

type AccountContextProps = {
  address: string;
  connectMetaMask: () => void;
  logout: () => void;
};

const AccountContext = createContext({} as AccountContextProps);

export const useAccount = () => {
  return useContext(AccountContext);
};

export default function AccountProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [address, setAddress] = useState("");

  useEffect(() => {
    initAuthIfUserConnectedBefore();
  }, []);

  const connectMetaMask = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log(accounts);

      setAddress(accounts[0]);
      toast.success("MetaMask connected successfully.");
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    setAddress("");
    toast.info("MetaMask disconnected successfully.");
  };

  const initAuthIfUserConnectedBefore = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        setAddress(accounts[0]);
      }
    }
  };

  return (
    <AccountContext.Provider
      value={{
        address,
        connectMetaMask,
        logout,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}
