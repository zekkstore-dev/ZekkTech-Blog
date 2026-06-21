'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Users, MessageSquare, User, FolderOpen } from 'lucide-react';

const navItems = [
  { name: 'Artikel', href: '/admin-zt', icon: FileText },
  { name: 'Subscribers', href: '/admin-zt/subscribers', icon: Users },
  { name: 'Komentar', href: '/admin-zt/comments', icon: MessageSquare },
  { name: 'Tentang Saya', href: '/admin-zt/about', icon: User },
  { name: 'Media', href: '/admin-zt/media', icon: FolderOpen },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-6 text-sm font-medium overflow-x-auto pb-1 scrollbar-hide">
      {navItems.map((item) => {
        let isActive = false;
        
        if (item.href === '/admin-zt') {
          isActive =
            pathname === '/admin-zt' ||
            pathname === '/admin-zt/new' ||
            pathname.startsWith('/admin-zt/edit/') ||
            (pathname.startsWith('/admin-zt') &&
              !pathname.startsWith('/admin-zt/subscribers') &&
              !pathname.startsWith('/admin-zt/comments') &&
              !pathname.startsWith('/admin-zt/about') &&
              !pathname.startsWith('/admin-zt/media'));
        } else {
          isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        }

        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              `inline-flex items-center gap-1.5 pb-2 flex-shrink-0 transition-all ` +
              (isActive
                ? 'admin-nav-link text-gray-900 border-b-2 border-gray-900 font-semibold'
                : 'admin-nav-link-inactive text-gray-500 hover:text-gray-900')
            }
          >
            <Icon className="w-4 h-4" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
