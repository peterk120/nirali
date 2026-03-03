'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

interface FooterProps {
  brand: 'boutique' | 'bridal-jewels' | 'sasthik' | 'tamilsmakeover';
}

const Footer = ({ brand }: FooterProps) => {
  const [email, setEmail] = useState('');

  const brandName = {
    boutique: 'Nirali Sai Boutique',
    'bridal-jewels': 'Bridal Jewels',
    sasthik: 'Sasthik',
    tamilsmakeover: 'Tamilsmakeover'
  }[brand];

  const brandTagline = {
    boutique: 'Exquisite bridal wear for your special day',
    'bridal-jewels': 'Premium bridal jewellery collection',
    sasthik: 'Traditional and contemporary products',
    tamilsmakeover: 'Professional beauty and makeover services'
  }[brand];

  const brandColor = {
    boutique: 'bg-rose-500',
    'bridal-jewels': 'bg-gold-500',
    sasthik: 'bg-teal-500',
    tamilsmakeover: 'bg-plum-500'
  }[brand];

  const brandAccent = {
    boutique: 'text-rose-500',
    'bridal-jewels': 'text-gold-500',
    sasthik: 'text-teal-500',
    tamilsmakeover: 'text-plum-500'
  }[brand];

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Catalog', href: '/catalog' },
    { name: 'Contact', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
  ];

  const services = {
    boutique: [
      { name: 'Dress Rental', href: '/rental' },
      { name: 'Slot Booking', href: '/booking' },
      { name: 'Virtual Try-On', href: '/virtual-try-on' },
    ],
    'bridal-jewels': [
      { name: 'Jewellery Booking', href: '/booking' },
      { name: 'Try-On Service', href: '/try-on' },
      { name: 'Custom Design', href: '/custom-design' },
    ],
    sasthik: [
      { name: 'Product Catalog', href: '/products' },
      { name: 'Custom Orders', href: '/custom' },
      { name: 'Gift Wrapping', href: '/gift-wrap' },
    ],
    tamilsmakeover: [
      { name: 'Makeover Booking', href: '/booking' },
      { name: 'Consultation', href: '/consultation' },
      { name: 'Trial Session', href: '/trial' },
    ]
  }[brand];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribed with:', email);
    setEmail('');
  };

  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8">
      {/* Newsletter Section */}
      <div className="container mx-auto px-4 mb-12">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-xl font-bold font-heading mb-4">Subscribe to Our Newsletter</h3>
          <p className="text-gray-300 mb-6">Stay updated with our latest offers and collections</p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-grow px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              required
            />
            <button
              type="submit"
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${brandColor} text-white`}
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Content - Desktop View */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 container mx-auto px-4 mb-12">
        {/* Column 1: Brand Info */}
        <div>
          <h3 className="text-xl font-bold font-heading mb-4 text-rose-500">{brandName}</h3>
          <p className="text-gray-300 mb-6">{brandTagline}</p>
          <div className="flex space-x-4">
            <a href="#" className={`w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:${brandColor} hover:text-white transition-colors`}>
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className={`w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:${brandColor} hover:text-white transition-colors`}>
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className={`w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:${brandColor} hover:text-white transition-colors`}>
              <Youtube className="w-5 h-5" />
            </a>
            <a href="#" className={`w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:${brandColor} hover:text-white transition-colors`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-lg font-bold font-heading mb-4">Quick Links</h3>
          <ul className="space-y-3">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href as any} className="text-gray-300 hover:text-rose-500 transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Services */}
        <div>
          <h3 className="text-lg font-bold font-heading mb-4">Services</h3>
          <ul className="space-y-3">
            {services.map((service) => (
              <li key={service.name}>
                <Link href={service.href as any} className="text-gray-300 hover:text-rose-500 transition-colors">
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div>
          <h3 className="text-lg font-bold font-heading mb-4">Contact Us</h3>
          <ul className="space-y-3">
            <li className="flex items-center">
              <Phone className="w-5 h-5 mr-3 text-rose-500" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center">
              <Mail className="w-5 h-5 mr-3 text-rose-500" />
              <span>info@niralisaiboutique.com</span>
            </li>
            <li className="flex items-start">
              <MapPin className="w-5 h-5 mr-3 mt-1 text-rose-500" />
              <span>123 Fashion Street, Mumbai, India 400001</span>
            </li>
            <li>
              <a 
                href="https://wa.me/919876543210" 
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center w-fit px-4 py-2 rounded-lg ${brandColor} text-white mt-4`}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Footer - Accordion View */}
      <div className="md:hidden container mx-auto px-4 mb-12">
        <Accordion.Root type="single" collapsible className="w-full space-y-4">
          {/* Brand Info Accordion */}
          <Accordion.Item value="brand" className="border-b border-gray-700">
            <Accordion.Header>
              <Accordion.Trigger className="flex justify-between items-center w-full py-4 font-bold font-heading text-left">
                {brandName}
                <ChevronDown className="w-5 h-5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="pb-4">
              <p className="text-gray-300 mb-4">{brandTagline}</p>
              <div className="flex space-x-4 mb-4">
                <a href="#" className={`w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:${brandColor} hover:text-white transition-colors`}>
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className={`w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:${brandColor} hover:text-white transition-colors`}>
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className={`w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:${brandColor} hover:text-white transition-colors`}>
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="#" className={`w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:${brandColor} hover:text-white transition-colors`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                  </svg>
                </a>
              </div>
            </Accordion.Content>
          </Accordion.Item>

          {/* Quick Links Accordion */}
          <Accordion.Item value="links" className="border-b border-gray-700">
            <Accordion.Header>
              <Accordion.Trigger className="flex justify-between items-center w-full py-4 font-bold font-heading">
                Quick Links
                <ChevronDown className="w-5 h-5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="pb-4">
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href as any} className="text-gray-300 hover:text-rose-500 transition-colors block">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Accordion.Content>
          </Accordion.Item>

          {/* Services Accordion */}
          <Accordion.Item value="services" className="border-b border-gray-700">
            <Accordion.Header>
              <Accordion.Trigger className="flex justify-between items-center w-full py-4 font-bold font-heading">
                Services
                <ChevronDown className="w-5 h-5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="pb-4">
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service.name}>
                    <Link href={service.href as any} className="text-gray-300 hover:text-rose-500 transition-colors block">
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Accordion.Content>
          </Accordion.Item>

          {/* Contact Accordion */}
          <Accordion.Item value="contact" className="border-b border-gray-700">
            <Accordion.Header>
              <Accordion.Trigger className="flex justify-between items-center w-full py-4 font-bold font-heading">
                Contact Us
                <ChevronDown className="w-5 h-5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="pb-4">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-rose-500" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-rose-500" />
                  <span>info@niralisaiboutique.com</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 mt-1 text-rose-500" />
                  <span>123 Fashion Street, Mumbai, India 400001</span>
                </li>
                <li>
                  <a 
                    href="https://wa.me/919876543210" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center w-fit px-4 py-2 rounded-lg ${brandColor} text-white mt-4`}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat on WhatsApp
                  </a>
                </li>
              </ul>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 pt-8 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-4 md:mb-0">
            <Link href={'/privacy-policy' as any} className="text-gray-400 hover:text-rose-500 transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href={'/terms-of-service' as any} className="text-gray-400 hover:text-rose-500 transition-colors text-sm">
              Terms of Service
            </Link>
            <Link href={'/refund-policy' as any} className="text-gray-400 hover:text-rose-500 transition-colors text-sm">
              Refund Policy
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-gray-400 text-sm">Payment Methods:</div>
            <div className="flex space-x-2">
              <div className="w-12 h-6 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-300">
                Razorpay
              </div>
              <div className="w-10 h-6 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-300">
                UPI
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;