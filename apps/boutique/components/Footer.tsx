'use client';

import Link from 'next/link';
import { Heart, Phone, Mail, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';

function FooterColumn({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C96E82', marginBottom: 20 }}>
        {title}
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
        {items.map(({ label, href }) => (
          <li key={href}>
            <Link
              href={href as any}
              style={{ fontSize: 13, color: 'rgba(240,196,204,0.6)', textDecoration: 'none', letterSpacing: '0.04em', transition: 'color 0.2s' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = '#FFF8F8')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(240,196,204,0.6)')}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const exploreLinks = [
  { label: 'New Arrivals', href: '/' },
  { label: 'Lehengas',     href: '/catalog/dresses' },
  { label: 'Sarees',       href: '/catalog/dresses' },
  { label: 'Gowns',        href: '/catalog/dresses' },
  { label: 'Jewellery',    href: '/jewellery' },
  { label: 'About Us',     href: '/about' },
];

const supportLinks = [
  { label: 'FAQ',        href: '/faq' },
  { label: 'Shipping',   href: '/shipping' },
  { label: 'Returns',    href: '/returns' },
  { label: 'Size Guide', href: '/size-guide' },
  { label: 'Contact',    href: '/contact' },
];

const contactItems: { Icon: React.ElementType; text: string; href?: string }[] = [
  { Icon: MapPin, text: '123 Fashion Street, Mumbai 400001' },
  { Icon: Phone,  text: '+91 98765 43210',            href: 'tel:+919876543210' },
  { Icon: Mail,   text: 'info@niralisaiboutique.com', href: 'mailto:info@niralisaiboutique.com' },
];

const socialLinks: { Icon: React.ElementType; href: string }[] = [
  { Icon: Instagram, href: '#' },
  { Icon: Facebook,  href: '#' },
  { Icon: Youtube,   href: '#' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <footer
        style={{
          background: '#6B1F2A',
          fontFamily: "'Jost', sans-serif",
          fontWeight: 300,
          color: 'rgba(240,196,204,0.7)',
        }}
      >
        {/* Top accent line */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #C96E82, transparent)' }} />

        {/* Main grid */}
        <div
          className="footer-grid"
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '72px 60px 56px',
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1.4fr',
            gap: 60,
          }}
        >
          {/* Brand column */}
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: '#FFF8F8', lineHeight: 1 }}>
                Nirali Sai
              </div>
              <div style={{ fontSize: 9, letterSpacing: '0.38em', textTransform: 'uppercase', color: '#C96E82', marginTop: 4 }}>
                Boutique
              </div>
            </div>
            <div style={{ width: 32, height: 1, background: '#C96E82', marginBottom: 20 }} />
            <p style={{ fontSize: 13, lineHeight: 1.85, color: 'rgba(240,196,204,0.6)', maxWidth: 240 }}>
              Exquisite bridal wear and fine jewellery for your most unforgettable occasions. Crafted with love since 2019.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              {socialLinks.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  style={{
                    width: 36, height: 36,
                    border: '1px solid rgba(240,196,204,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(240,196,204,0.5)',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#C96E82';
                    (e.currentTarget as HTMLElement).style.color = '#C96E82';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,196,204,0.2)';
                    (e.currentTarget as HTMLElement).style.color = 'rgba(240,196,204,0.5)';
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore links */}
          <FooterColumn title="Explore" items={exploreLinks} />

          {/* Support links */}
          <FooterColumn title="Support" items={supportLinks} />

          {/* Contact */}
          <div>
            <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C96E82', marginBottom: 20 }}>
              Get in Touch
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {contactItems.map(({ Icon, text, href }, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <Icon size={13} style={{ color: '#C96E82', marginTop: 2, flexShrink: 0 }} />
                  {href ? (
                    <a
                      href={href}
                      style={{ fontSize: 13, color: 'rgba(240,196,204,0.6)', lineHeight: 1.5, textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => ((e.target as HTMLElement).style.color = '#FFF8F8')}
                      onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(240,196,204,0.6)')}
                    >
                      {text}
                    </a>
                  ) : (
                    <span style={{ fontSize: 13, color: 'rgba(240,196,204,0.6)', lineHeight: 1.5 }}>{text}</span>
                  )}
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 24,
                padding: '10px 20px',
                border: '1px solid rgba(240,196,204,0.25)',
                color: 'rgba(240,196,204,0.7)',
                fontSize: 11,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = '#C96E82';
                (e.currentTarget as HTMLElement).style.color = '#FFF8F8';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,196,204,0.25)';
                (e.currentTarget as HTMLElement).style.color = 'rgba(240,196,204,0.7)';
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat with Us
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="footer-bottom"
          style={{
            borderTop: '1px solid rgba(240,196,204,0.1)',
            padding: '20px 60px',
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p style={{ fontSize: 11, letterSpacing: '0.08em', color: 'rgba(240,196,204,0.35)', margin: 0 }}>
            © {year} Nirali Sai Boutique. All rights reserved.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <p style={{ fontSize: 11, letterSpacing: '0.06em', color: 'rgba(240,196,204,0.3)', display: 'flex', alignItems: 'center', gap: 5, margin: 0 }}>
              Made with <Heart size={10} style={{ color: '#C96E82' }} fill="#C96E82" /> in India
            </p>
            <p style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(201,110,130,0.5)', fontWeight: 500, margin: 0 }}>
              Crafted by Prajan
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 40px !important;
            padding: 48px 24px 40px !important;
          }
          .footer-bottom {
            padding: 16px 24px !important;
            flex-direction: column !important;
            gap: 8px !important;
            text-align: center !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid { 
            grid-template-columns: 1fr !important;
            padding: 36px 20px 32px !important;
          }
          /* Adjust font sizes for mobile */
          .footer-grid h3,
          .footer-grid p {
            font-size: clamp(12px, 2.5vw, 13px) !important;
          }
        }
      `}</style>
    </>
  );
}