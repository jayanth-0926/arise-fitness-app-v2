"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT" },
  { href: "/training", label: "TRAINING" },
  { href: "/progress", label: "PROGRESS" },
  { href: "/contact", label: "CONTACT" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setIsAuthed(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session?.user);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const ctaHref = isAuthed ? "/dashboard" : "/signup";
  const ctaLabel = isAuthed ? "DASHBOARD" : "JOIN NOW";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-bg-primary/95 backdrop-blur-md border-b border-border shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          : "bg-transparent"
        }`}
    >
      <nav className="mx-auto max-w-7xl px-6 md:px-10 h-20 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-wide focus-ring group">
          <span className="gradient-text">ARISE</span>
        </Link>

        <ul className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative text-sm tracking-widest transition-colors duration-200 focus-ring link-underline ${active ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                    }`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute -bottom-2 left-0 right-0 h-[2px] rounded-full"
                      style={{ background: "linear-gradient(90deg, #06B6D4, #22D3EE)" }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden md:block">
          <Link
            href={ctaHref}
            className="btn-press inline-flex items-center rounded-sm px-6 py-2.5 text-sm font-semibold tracking-widest text-bg-primary transition-all duration-200 focus-ring"
            style={{ background: "linear-gradient(135deg, #06B6D4, #22D3EE)" }}
          >
            {ctaLabel}
          </Link>
        </div>

        <button
          className="md:hidden text-text-primary focus-ring p-1 transition-transform duration-200 active:scale-90"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <AnimatePresence mode="wait" initial={false}>
            {menuOpen ? (
              <motion.span
                key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={26} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={26} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden bg-bg-secondary border-b border-border"
          >
            <ul className="flex flex-col px-6 py-6 gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={`block py-3 text-lg tracking-wide focus-ring transition-colors ${pathname === link.href ? "text-accent-cyan" : "text-text-primary hover:text-accent-hover"
                      }`}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                className="pt-4"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: NAV_LINKS.length * 0.05 }}
              >
                <Link
                  href={ctaHref}
                  className="btn-press block text-center rounded-sm px-6 py-3 text-sm font-semibold tracking-widest text-bg-primary focus-ring"
                  style={{ background: "linear-gradient(135deg, #06B6D4, #22D3EE)" }}
                >
                  {ctaLabel}
                </Link>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
