"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/cards", label: "Cards" },
  { href: "/passwords", label: "Passwords" },
  { href: "/post", label: "Post" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-border bg-background w-full border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-lg font-semibold">
          🔐 PassGuard
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden gap-4 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "hover:text-primary text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Controls (Theme + Auth) */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ModeToggle />

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="animate-in slide-in-from-left w-[250px] duration-500 sm:hidden"
              >
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <nav className="mt-10 flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "rounded-md px-4 py-2 text-base font-medium transition-colors",
                        pathname === link.href
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
