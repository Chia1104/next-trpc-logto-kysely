"use client";

import { type FC, type ReactNode } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster as ST } from "sonner";

const Toaster: FC = () => {
  const { theme } = useTheme();
  return <ST theme={theme as never} position="bottom-left" richColors />;
};

const RootProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <NextUIProvider>
        <Toaster />
        {children}
      </NextUIProvider>
    </ThemeProvider>
  );
};

export default RootProvider;
