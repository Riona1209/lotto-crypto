"use client";
import { Toaster } from "@/components/ui/sonner";
import AccountProvider from "@/contexts/AccountContext";
import ContractProvider from "@/contexts/ContractContext";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, theme } from "antd";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AccountProvider>
      <ContractProvider>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              algorithm: theme.darkAlgorithm,
            }}
          >
            {children}
          </ConfigProvider>
        </AntdRegistry>
        <Toaster closeButton />
      </ContractProvider>
    </AccountProvider>
  );
};
