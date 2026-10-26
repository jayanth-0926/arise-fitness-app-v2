import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <p className="font-display text-2xl mb-3 gradient-text">ARISE</p>
          <p className="text-text-secondary text-sm max-w-xs">
            Train with purpose. Discipline builds results. Every rep counts.
          </p>
        </div>

        <div>
          <p className="text-xs tracking-widest text-text-secondary mb-4">NAVIGATION</p>
          <ul className="space-y-2 text-sm">
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About" },
              { href: "/training", label: "Training" },
              { href: "/progress", label: "Progress" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-text-secondary link-underline transition-colors duration-200 hover:text-accent-hover"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-widest text-text-secondary mb-4">CONTACT</p>
          <p className="text-sm text-text-secondary">hello@arisefitness.com</p>
          <p className="text-xs tracking-widest text-text-secondary mt-6 mb-2">SOCIAL</p>
          <p className="text-sm text-text-secondary">@arisefitness</p>
        </div>
      </div>

      <div className="border-t border-border py-6 text-center text-xs text-text-secondary">
        © {new Date().getFullYear()} ARISE. All rights reserved.
      </div>
    </footer>
  );
}
