"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

type Item = { href: string; label: string; children?: { href: string; label: string }[] };

export function SiteNavigation({ items }: { items: Item[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  const active = (item: Item) => pathname === item.href ||
    (item.href !== "/" && pathname.startsWith(item.href + "/")) ||
    Boolean(item.children?.some((child) => pathname.startsWith(child.href)));

  return (
    <nav aria-label="주 메뉴" className="site-navigation">
      <button type="button" className="mobile-menu-toggle" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(!open)}>
        <span>{open ? "메뉴 닫기" : "전체 메뉴"}</span>{open ? <X size={19} /> : <Menu size={19} />}
      </button>
      <ul id="site-menu" className={`site-menu ${open ? "is-open" : ""}`}>
        {items.map((item) => <li key={item.href} className={active(item) ? "is-active" : ""}>
          <Link href={item.href} aria-current={pathname === item.href ? "page" : undefined} onClick={() => setOpen(false)}>{item.label}</Link>
          {item.children && <ul className="site-submenu">{item.children.map((child) => <li key={child.href}>
            <Link href={child.href} aria-current={pathname === child.href ? "page" : undefined} onClick={() => setOpen(false)}>{child.label}<ArrowUpRight size={14} /></Link>
          </li>)}</ul>}
        </li>)}
      </ul>
    </nav>
  );
}
