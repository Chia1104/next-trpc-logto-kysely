"use client";

import { type FC, type ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/react";

const RootProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <NextUIProvider>{children}</NextUIProvider>
    </ThemeProvider>
  );
};

export default RootProvider;
