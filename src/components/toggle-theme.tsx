"use client";

import { type FC, useId, type ComponentProps, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils";
import { useTheme } from "next-themes";
import {Button, type ButtonProps} from "@nextui-org/react";

interface ToggleThemeProps extends ButtonProps {
  toggleTheme?: () => void;
  isDark?: boolean;
}

const ToggleTheme: FC<ToggleThemeProps> = ({
  toggleTheme,
  isDark: propsIsDark,
  ...props
}) => {
  const { theme, setTheme } = useTheme();
  const isDark = useMemo(() => {
    if (propsIsDark !== undefined) return propsIsDark;
    return theme === "dark";
  }, [theme, propsIsDark]);
  const id = useId();
  const variants = {
    svgVariants: {
      dark: {
        rotate: 40,
      },
      light: {
        rotate: 90,
      },
    },
    circleVariants: {
      dark: {
        r: 9,
      },
      light: {
        r: 5,
      },
    },
    maskVariants: {
      dark: {
        cx: "50%",
        cy: "23%",
      },
      light: {
        cx: "100%",
        cy: "0%",
      },
    },
    linesVariants: {
      dark: {
        opacity: 0,
      },
      light: {
        opacity: 1,
      },
    },
  };
  return (
    <Button
      {...props}
      isIconOnly
      size="sm"
      onClick={(e) => {
        toggleTheme?.();
        setTheme(isDark ? "light" : "dark");
        props?.onClick?.(e);
      }}
      className={cn(
        "rounded-lg bg-light text-dark dark:bg-dark dark:text-light",
        props.className
      )}
      title={isDark ? "Activate light mode" : "Activate dark mode"}
      aria-label={isDark ? "Activate light mode" : "Activate dark mode"}>
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={variants.svgVariants}
        animate={isDark ? "dark" : "light"}>
        <mask id={`${id}-mask`}>
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <motion.circle
            r="9"
            fill="black"
            variants={variants.maskVariants}
            animate={isDark ? "dark" : "light"}
          />
        </mask>
        <motion.circle
          cx="12"
          cy="12"
          fill="currentColor"
          mask={`url(#${id}-mask)`}
          variants={variants.circleVariants}
          animate={isDark ? "dark" : "light"}
        />
        <motion.g
          stroke="currentColor"
          variants={variants.linesVariants}
          animate={isDark ? "dark" : "light"}>
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </motion.g>
      </motion.svg>
    </Button>
  );
};

export default ToggleTheme;
