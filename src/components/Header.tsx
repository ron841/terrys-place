import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/content";
import { LiveStatusPill } from "./LiveStatusPill";

/**
 * Site header — utility topbar + sticky white nav.
 *
 * Lifted from Home.html § .topbar / .nav. Class names match the comp.
 * Nav links currently use Next <Link> to the canonical 7 routes.
 *
 * Per CONTENT-INVENTORY: site.social.facebook is currently null. Brief
 * directive: hide the FB icon when empty rather than DraftField it (cleaner).
 */

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/menu", label: "Menu" },
  { href: "/specials", label: "Specials" },
  { href: "/sports", label: "Sports" },
  { href: "/visit", label: "Visit" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <>
      <div className="topbar">
        <span><Link href="/contact">Contact Us</Link></span>
        <span className="sep">·</span>
        <span><Link href="/menu">Our Menu</Link></span>
        <span className="sep">·</span>
        <span>
          Dial <a href={`tel:${site.phone}`} className="phone">{site.phoneDisplay}</a> Now!
        </span>
        {site.social.facebook && (
          <a href={site.social.facebook} aria-label="Facebook" className="icon-fb" target="_blank" rel="noopener noreferrer">f</a>
        )}
      </div>

      <header className="nav">
        <div className="nav-inner">
          <Link href="/" aria-label={`${site.name} — home`}>
            <Image
              src={site.logo.primary}
              alt={`${site.name} — ${site.tagline}`}
              width={429}
              height={136}
              className="nav-logo"
              priority
            />
          </Link>
          <nav className="nav-links" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href}>{l.label}</Link>
            ))}
          </nav>
          <div className="nav-status-mobile" aria-hidden="true">
            <LiveStatusPill compact />
          </div>
          <Link href="/menu" className="nav-cta">Menu</Link>
        </div>
      </header>
    </>
  );
}
