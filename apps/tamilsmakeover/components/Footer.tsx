export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold font-heading mb-4 text-brand-rose">Nirali Sai Boutique</h3>
            <p className="text-gray-400">
              Exquisite bridal wear and traditional outfits for your special occasions.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/dresses" className="text-gray-400 hover:text-brand-rose">Dresses</a></li>
              <li><a href="/jewellery" className="text-gray-400 hover:text-brand-rose">Jewellery</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-brand-rose">About Us</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-brand-rose">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="/faq" className="text-gray-400 hover:text-brand-rose">FAQ</a></li>
              <li><a href="/shipping" className="text-gray-400 hover:text-brand-rose">Shipping</a></li>
              <li><a href="/returns" className="text-gray-400 hover:text-brand-rose">Returns</a></li>
              <li><a href="/size-guide" className="text-gray-400 hover:text-brand-rose">Size Guide</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <address className="text-gray-400 not-italic">
              <p>123 Fashion Street</p>
              <p>Mumbai, India 400001</p>
              <p className="mt-2">Phone: +91 98765 43210</p>
              <p>Email: info@niralisaiboutique.com</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Nirali Sai Boutique. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}