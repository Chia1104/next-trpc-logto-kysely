"use client";

import { type FC, type ReactNode } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster as ST } from "sonner";
import { TRPCReactProvider } from "@/server/trpc/client";

interface Props {
  children: ReactNode;
  headers: Headers;
}

const Toaster: FC = () => {
  const { theme } = useTheme();
  return <ST theme={theme as never} position="bottom-left" richColors />;
};

const RootProvider: FC<Props> = ({ children, headers }) => {
  return (
    <TRPCReactProvider headers={headers}>
      <ThemeProvider attribute="class" defaultTheme="system">
        <NextUIProvider>
          <Toaster />
          {children}
        </NextUIProvider>
      </ThemeProvider>
    </TRPCReactProvider>
  );
};

export default RootProvider;
