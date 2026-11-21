import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="topbar">
      <Link className="brand" href="/" aria-label="BAHATI home">
        <span className="brand-mark" aria-hidden="true">
          <span className="brand-monogram">B</span>
        </span>
        <span className="brand-name">BAHATI</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/">Home</Link>
        <Link href="/heroes">Heroes</Link>
        <Link href="/calculator">Pricing</Link>
        <Link href="/order">Order</Link>
        <Link href="/vouches">Vouches</Link>
        <Link href="/contacts">Contacts</Link>
      </nav>
    </header>
  );
}
