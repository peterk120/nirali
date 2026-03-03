'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold font-heading text-plum-500">
          Tamilsmakeover
        </Link>
        
        <div className="hidden md:flex space-x-8">
          <Link href={'/dresses' as any} className={`font-body ${pathname === '/dresses' ? 'text-plum-500 font-semibold' : 'text-gray-600'}`}>
            Dresses
          </Link>
          <Link href={'/jewellery' as any} className={`font-body ${pathname === '/jewellery' ? 'text-plum-500 font-semibold' : 'text-gray-600'}`}>
            Jewellery
          </Link>
          <Link href={'/about' as any} className={`font-body ${pathname === '/about' ? 'text-plum-500 font-semibold' : 'text-gray-600'}`}>
            About
          </Link>
          <Link href={'/contact' as any} className={`font-body ${pathname === '/contact' ? 'text-plum-500 font-semibold' : 'text-gray-600'}`}>
            Contact
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href={'/cart' as any} className="text-gray-600 hover:text-plum-500">
            Cart
          </Link>
          <Link href={'/account' as any} className="text-gray-600 hover:text-plum-500">
            Account
          </Link>
        </div>
      </div>
    </nav>
  );
}