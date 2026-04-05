'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Heart, Phone, Mail, MapPin, Instagram, 
  Facebook, Youtube, Share2, ExternalLink
} from 'lucide-react';

const footerLinks = [
  {
    title: "Quick Links",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Store Locator", href: "https://share.google/MHAIIcO5uzrsAp2xv" },
      { label: "Our Boutique", href: "https://nirali-boutique.vercel.app/" },
      { label: "Tamil Bridal Makeover", href: "#" }, // Coming Soon
      { label: "Wholesale Enquiry", href: "/wholesale" },
    ]
  },
  {
    title: "Help & Support",
    links: [
      { label: "Track Order", href: "/track-order" },
      { label: "Returns & Exchange", href: "/returns" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
      { label: "WhatsApp Us", href: "https://wa.me/919342661671" },
    ]
  }
];

export default function Footer() {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin');

  if (isAdminPath) return null;

  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-white font-body pt-10 pb-6 md:pt-16 md:pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16">
          
          {/* Column 1: Branding & Social */}
          <div className="flex flex-col gap-4 md:gap-6">
            <div>
              <div className="font-heading text-2xl md:text-3xl mb-2 text-white">Niralisai Jewels</div>
              <p className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-brand-rose-gold font-medium">
                Premium Indian Jewellery
              </p>
            </div>
            <p className="text-[12px] md:text-[13px] text-gray-400 leading-relaxed max-w-xs">
              Look Royal. Pay Less. Discover exquisite imitation jewellery inspired by tradition, crafted for the modern woman.
            </p>
            <div className="flex gap-3 md:gap-4 mt-1 md:mt-2">
              {[Instagram, Facebook, Youtube, Share2].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-9 h-9 md:w-10 md:h-10 border border-white/10 flex items-center justify-center text-brand-rose-gold hover:bg-brand-rose-gold hover:text-white transition-all duration-300 rounded-sm"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Columns 2 & 3: Links */}
          {footerLinks.map((section, idx) => (
            <div key={idx} className={idx === 1 ? "hidden md:block" : ""}>
              <h4 className="text-[13px] md:text-[14px] font-heading text-white border-b border-white/5 pb-3 md:pb-4 mb-4 md:mb-6 tracking-wider">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-2 md:gap-3">
                {section.links.map((link, i) => (
                  <li key={i}>
                    {link.href.startsWith('http') ? (
                       <a 
                        href={link.href} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] md:text-[13px] text-gray-400 hover:text-brand-rose-gold transition-colors flex items-center gap-1.5"
                      >
                        {link.label} {link.label !== "Tamil Bridal Makeover" && <ExternalLink size={10} />}
                      </a>
                    ) : (
                      <Link 
                        href={link.href as any} 
                        className="text-[12px] md:text-[13px] text-gray-400 hover:text-brand-rose-gold transition-colors block"
                      >
                        {link.label} {link.label === "Tamil Bridal Makeover" && <span className="text-[8px] bg-brand-rose-gold/20 text-brand-rose-gold px-1.5 py-0.5 rounded ml-1 font-bold">SOON</span>}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-[13px] md:text-[14px] font-heading text-white border-b border-white/5 pb-3 md:pb-4 mb-4 md:mb-6 tracking-wider">
              Visit Our Store
            </h4>
            <div className="flex flex-col gap-4 md:gap-5">
              <div className="flex items-start gap-3 group cursor-pointer" onClick={() => window.open('https://share.google/MHAIIcO5uzrsAp2xv', '_blank')}>
                <MapPin size={14} className="text-brand-rose-gold mt-1 shrink-0" />
                <p className="text-[12px] md:text-[13px] text-gray-400 group-hover:text-white transition-colors">
                  Shop No. 17, Kandhaswarna Shopping Mall, Saradha College Main Road, Fairlands, Salem, TN 636016
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-brand-rose-gold shrink-0" />
                <a href="tel:9342661671" className="text-[12px] md:text-[13px] text-gray-400 hover:text-white transition-colors">+91 93426 61671</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={14} className="text-brand-rose-gold shrink-0" />
                <a href="mailto:niralisaijewels@gmail.com" className="text-[12px] md:text-[13px] text-gray-400 hover:text-white transition-colors">niralisaijewels@gmail.com</a>
              </div>
              
              <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                <p className="text-[10px] uppercase tracking-widest text-brand-rose-gold font-bold">Connect for Styling</p>
                <Link href="https://wa.me/919342661671" target="_blank" className="bg-white/5 hover:bg-white/10 p-3 rounded-lg flex items-center justify-between group transition-all">
                  <span className="text-[11px] text-gray-400 group-hover:text-white">Chat on WhatsApp</span>
                  <ExternalLink size={12} className="text-brand-rose-gold" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
          <p className="text-[10px] md:text-[11px] text-gray-500 tracking-wide order-2 md:order-1 text-center md:text-left">
            © {year} Niralisai Jewels. All rights reserved. &nbsp; | &nbsp; 
            <Link href={"/privacy" as any} className="hover:text-white transition-colors">Privacy</Link> &nbsp; | &nbsp; 
            <Link href={"/terms" as any} className="hover:text-white transition-colors">Terms</Link>
          </p>
          
          <div className="flex items-center gap-3 md:gap-4 opacity-40 order-1 md:order-2">
            <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-white mr-1 md:mr-2">Trusted Payments:</span>
            <div className="flex gap-2 md:gap-3 h-4 md:h-5 text-[7px] md:text-[8px] items-center">
              <span className="border border-white/20 px-1.5 md:px-2 py-0.5 rounded">VISA</span>
              <span className="border border-white/20 px-1.5 md:px-2 py-0.5 rounded">UPI</span>
              <span className="border border-white/20 px-1.5 md:px-2 py-0.5 rounded">RAZORPAY</span>
            </div>
          </div>

          <div className="text-[10px] md:text-[11px] text-gray-500 flex flex-col items-center md:items-end gap-1 order-3">
            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400">
              Handcrafted within India
            </p>
            <p className="text-[9px] tracking-[0.3em] uppercase text-brand-rose-gold/60 font-bold mt-0.5">
               <a 
                href="https://prajan-portfoli.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-brand-rose-gold transition-colors duration-300"
               >
                 Prajan
               </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}