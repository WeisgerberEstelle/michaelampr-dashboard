"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/deposit", label: "Versement" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-surface shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-title text-xl font-bold text-primary">
            Gedeon
          </Link>

          <div className="flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-title text-sm font-medium py-5 border-b-2 transition-colors ${
                  pathname === link.href
                    ? "border-primary text-primary"
                    : "border-transparent text-foreground-muted hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
