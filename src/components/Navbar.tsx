"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

const navLinks = [
  { href: "/cards", label: "cards" },
  { href: "/passwords", label: "Passwords" },
  { href: "/post", label: "post" },
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

        {/* Nav + Controls */}
        <div className="flex items-center gap-4">
          {/* Navigation */}
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

          {/* Theme Toggle */}
          <ModeToggle />

          {/* Clerk Auth Buttons */}
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
        </div>
      </div>
    </header>
  );
}
