import type { ReactNode } from 'react';

const links = [
  { href: '/', label: 'Overview' },
  { href: '/content', label: 'Site content' },
  { href: '/media', label: 'Photography' },
  { href: '/projects', label: 'Projects' },
  { href: '/settings', label: 'Site text' },
];

export default function AdminNav({ active, children }: { active?: string; children?: ReactNode }) {
  return (
    <aside className="side">
      <div className="brand">CE<span>_</span> / CMS</div>
      <nav>
        {links.map((link) => (
          <a key={link.href} className={active === link.href ? 'active' : ''} href={link.href}>{link.label}</a>
        ))}
      </nav>
      {children}
    </aside>
  );
}
