"use client";

import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tabs,
  Tab,
  NavbarMenuToggle,
} from "@nextui-org/react";
import ToggleTheme from "@/components/toggle-theme";
import Image from "@/components/image";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import { type FC, type Key, useState } from "react";
import { type LogtoContext } from "@logto/next";
import NextLink from "next/link";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handlePush = (key: Key) => {
    switch (key) {
      case "todo":
        router.push("/");
        break;
      case "guestbook":
        router.push("/guestbook");
        break;
      default:
        break;
    }
  };
  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      position="sticky"
      maxWidth="full"
      isBordered={false}
      className="trainstion-all fixed border-0"
      shouldHideOnScroll>
      <NavbarContent>
        <NavbarBrand
          className="hidden cursor-pointer md:block"
          onClick={() => router.push("/")}>
          <Image
            src="/icon.png"
            alt="icon"
            className="overflow-hidden rounded-full"
            width={50}
            height={50}
            blur={false}
          />
        </NavbarBrand>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden"
        />
      </NavbarContent>
      <NavbarContent className="hidden md:flex" justify="center">
        <Tabs
          size="md"
          variant="solid"
          radius="lg"
          onSelectionChange={(key) => handlePush(key)}
          selectedKey={selectedLayoutSegments[0] ?? "todo"}>
          <Tab title="Todo" key="todo" />
          <Tab title="Guestbook" key="guestbook" />
        </Tabs>
      </NavbarContent>
      <NavbarContent justify="end">
        <User status={status} />
        <NavbarItem>
          <ToggleTheme />
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        <NavbarMenuItem>
          <NextLink
            className="w-full text-primary"
            href="/"
            onClick={() => setIsMenuOpen(false)}>
            Todo
          </NextLink>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <NextLink
            className="w-full text-primary"
            href="/guestbook"
            onClick={() => setIsMenuOpen(false)}>
            Guestbook
          </NextLink>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default Menu;
