"use client";

import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tabs,
  Tab,
} from "@nextui-org/react";
import ToggleTheme from "@/components/toggle-theme";
import Image from "@/components/image";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import { type FC } from "react";
import { type LogtoContext } from "@logto/next";

interface MenuProps {
  status: "authenticated" | "unauthenticated";
  user?: LogtoContext;
}

const User: FC<MenuProps> = ({ status, user }) => {
  return (
    <>
      {status === "unauthenticated" ? (
        <NavbarItem>
          <Button
            as={Link}
            color="primary"
            variant="flat"
            onClickCapture={() => window.location.assign("/api/logto/sign-in")}>
            Sign Up
          </Button>
        </NavbarItem>
      ) : (
        <NavbarItem>
          <Dropdown>
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                size="sm"
                src={user?.userInfo?.picture ?? ""}
              />
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                key="logout"
                className="text-danger"
                color="danger"
                onClick={() => window.location.assign("/api/logto/sign-out")}>
                Sign Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      )}
    </>
  );
};

const Menu: FC<MenuProps> = ({ status }) => {
  const router = useRouter();
  const selectedLayoutSegments = useSelectedLayoutSegments();
  return (
    <Navbar
      position="sticky"
      maxWidth="full"
      isBordered={false}
      className="trainstion-all fixed border-0"
      shouldHideOnScroll>
      <NavbarBrand className="cursor-pointer" onClick={() => router.push("/")}>
        <Image
          src="/icon.png"
          alt="icon"
          className="overflow-hidden rounded-full"
          width={50}
          height={50}
          blur={false}
        />
      </NavbarBrand>
      <NavbarContent className="hidden md:flex" justify="center">
        <Tabs
          size="md"
          variant="solid"
          radius="lg"
          selectedKey={selectedLayoutSegments[0] ?? "todo"}>
          <Tab
            title="Todo"
            key="todo"
            onClickCapture={() => router.push("/")}
          />
          <Tab
            title="Guestbook"
            key="guestbook"
            onClickCapture={() => router.push("/guestbook")}
          />
        </Tabs>
      </NavbarContent>
      <NavbarContent justify="end">
        <User status={status} />
        <NavbarItem>
          <ToggleTheme />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Menu;
