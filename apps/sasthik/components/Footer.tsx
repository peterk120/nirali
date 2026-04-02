'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Heart, Phone, Mail, MapPin, Instagram, 
  Facebook, Youtube, Share2 
} from 'lucide-react';

const footerLinks = [
  {
    title: "Quick Links",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Store Locator", href: "/stores" },
      { label: "Careers", href: "/careers" },
      { label: "Wholesale Enquiry", href: "/wholesale" },
    ]
  },
  {
    title: "Help",
    links: [
      { label: "Track Order", href: "/track-order" },
      { label: "Returns & Exchange", href: "/returns" },
      { label: "Size Guide", href: "/size-guide" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
      { label: "WhatsApp Us", href: "https://wa.me/91XXXXXXXXXX" },
    ]
  }
];

export default function Footer() {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin');

  if (isAdminPath) return null;

  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-white font-body pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Branding & Social */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="font-heading text-3xl mb-2 text-white">Sashti Sparkle</div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-brand-rose-gold font-medium">
                Premium Imitation Jewellery
              </p>
            </div>
            <p className="text-[13px] text-gray-400 leading-relaxed max-w-xs">
              Look Royal. Pay Less. Discover exquisite imitation jewellery inspired by tradition, crafted for the modern woman.
            </p>
            <div className="flex gap-4 mt-2">
              {[Instagram, Facebook, Youtube, Share2].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 border border-white/10 flex items-center justify-center text-brand-rose-gold hover:bg-brand-rose-gold hover:text-white transition-all duration-300 rounded-sm"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Columns 2 & 3: Links */}
          {footerLinks.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-[14px] font-heading text-white border-b border-white/5 pb-4 mb-6 tracking-wider">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link 
                      href={link.href as any} 
                      className="text-[13px] text-gray-400 hover:text-brand-rose-gold transition-colors block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Column 4: Contact & Apps */}
          <div>
            <h4 className="text-[14px] font-heading text-white border-b border-white/5 pb-4 mb-6 tracking-wider">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-brand-rose-gold mt-1 shrink-0" />
                <p className="text-[13px] text-gray-400">456 Sparkle Lane, Ground Floor, T. Nagar, Chennai - 600017</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-brand-rose-gold shrink-0" />
                <p className="text-[13px] text-gray-400">+91 XXXXX XXXXX</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-brand-rose-gold shrink-0" />
                <p className="text-[13px] text-gray-400">hello@sashtisparkle.com</p>
              </div>
              
              <div className="pt-4 flex flex-col gap-4">
                <p className="text-[11px] uppercase tracking-widest text-brand-rose-gold font-bold">Download our App</p>
                <div className="flex gap-2">
                  <div className="h-10 w-28 bg-white/5 border border-white/10 rounded flex items-center justify-center text-[10px] text-gray-400 cursor-pointer hover:bg-white/10">App Store</div>
                  <div className="h-10 w-28 bg-white/5 border border-white/10 rounded flex items-center justify-center text-[10px] text-gray-400 cursor-pointer hover:bg-white/10">Play Store</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] text-gray-500 tracking-wide order-2 md:order-1">
            © {year} Sashti Sparkle. All rights reserved. &nbsp; | &nbsp; 
            <Link href={"/privacy" as any} className="hover:text-white transition-colors">Privacy Policy</Link> &nbsp; | &nbsp; 
            <Link href={"/terms" as any} className="hover:text-white transition-colors">Terms of Use</Link>
          </p>
          
          <div className="flex items-center gap-4 opacity-40 order-1 md:order-2">
            <span className="text-[10px] uppercase tracking-widest text-white mr-2">We Accept:</span>
            {/* Payment icons placeholder */}
            <div className="flex gap-3 h-5 text-[8px] items-center">
              <span className="border border-white/20 px-2 py-0.5 rounded">VISA</span>
              <span className="border border-white/20 px-2 py-0.5 rounded">MASTERCARD</span>
              <span className="border border-white/20 px-2 py-0.5 rounded">UPI</span>
              <span className="border border-white/20 px-2 py-0.5 rounded">RAZORPAY</span>
            </div>
          </div>

          <p className="text-[11px] text-gray-500 flex items-center gap-1.5 order-3">
            Handcrafted with <Heart size={10} className="text-brand-rose-gold fill-brand-rose-gold" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
}