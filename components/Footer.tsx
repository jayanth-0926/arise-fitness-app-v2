import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <p className="font-display text-2xl mb-3">ARISE</p>
          <p className="text-text-secondary text-sm max-w-xs">
            Train with purpose. Discipline builds results.
          </p>
        </div>

        <div>
          <p className="text-xs tracking-widest text-text-secondary mb-4">NAVIGATION</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-accent-red transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-accent-red transition-colors">About</Link></li>
            <li><Link href="/training" className="hover:text-accent-red transition-colors">Training</Link></li>
            <li><Link href="/progress" className="hover:text-accent-red transition-colors">Progress</Link></li>
            <li><Link href="/contact" className="hover:text-accent-red transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-widest text-text-secondary mb-4">CONTACT</p>
          <p className="text-sm text-text-secondary">xxxxx</p>
          <p className="text-xs tracking-widest text-text-secondary mt-6 mb-2">SOCIAL</p>
          <p className="text-sm text-text-secondary">xxxxx</p>
        </div>
      </div>

      <div className="border-t border-border py-6 text-center text-xs text-text-secondary">
        © {new Date().getFullYear()} ARISE. All rights reserved.
      </div>
    </footer>
  );
}
