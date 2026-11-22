"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Heroes", href: "/heroes" },
  { label: "Order", href: "/order" },
  { label: "Vouches", href: "/vouches" },
  { label: "Contacts", href: "/contacts" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="topbar">
      <Link className="brand" href="/" aria-label="BAHATI home">
        <span className="brand-mark" aria-hidden="true">
          <span className="brand-monogram">B</span>
        </span>
        <span className="brand-name">BAHATI</span>
      </Link>

      <nav aria-label="Main navigation" className="flex items-center gap-3 sm:gap-5">
        {navLinks.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <div
              key={item.href}
              className={
                isActive
                  ? "inline-block bg-white/30 [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)]"
                  : "inline-block transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0.5"
              }
            >
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "block !px-5 !py-2 !h-auto !w-auto min-w-[84px] text-center bg-white !text-black font-black tracking-[0.16em] -translate-x-1 -translate-y-1 transition-all [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)]"
                    : "block !px-3.5 !py-2 !h-auto text-white/75 hover:!text-white tracking-[0.14em] transition-colors"
                }
              >
                {item.label}
              </Link>
            </div>
          );
        })}
      </nav>
    </header>
  );
}
