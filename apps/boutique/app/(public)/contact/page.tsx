'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, Instagram, Facebook, Twitter } from 'lucide-react';
import { Button } from '../../../components/ui/button';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6 text-brand-gold" />,
      title: "Call Us",
      detail: "+91 93426 61671",
      subtext: "Mon-Sat 10AM-8PM"
    },
    {
      icon: <Mail className="w-6 h-6 text-brand-gold" />,
      title: "Email Us",
      detail: "niralisaijewels@gmail.com",
      subtext: "We'll respond within 24 hours"
    },
    {
      icon: <MapPin className="w-6 h-6 text-brand-gold" />,
      title: "Visit Us",
      detail: "Shop No. 17, Kandhaswarna Shopping Mall",
      subtext: "Salem, Tamil Nadu 636016"
    },
    {
      icon: <Clock className="w-6 h-6 text-brand-gold" />,
      title: "Store Hours",
      detail: "Mon-Sat: 10AM-8PM",
      subtext: "Sun: 12PM-6PM"
    }
  ];

  const socialLinks = [
    {
      icon: <Instagram className="w-6 h-6" />,
      name: "Instagram",
      url: "https://instagram.com/niralisaijewels"
    },
    {
      icon: <Facebook className="w-6 h-6" />,
      name: "Facebook",
      url: "https://facebook.com/niralisaijewels"
    },
    {
      icon: <Twitter className="w-6 h-6" />,
      name: "Twitter",
      url: "https://twitter.com/niralisaijewels"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would be an actual API call
      console.log('Form submitted:', formData);
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-ivory">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-rose/20 to-brand-gold/20 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-brand-rose font-heading mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Have questions or need assistance? We're here to help make your experience exceptional.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-brand-rose font-heading mb-8">
              Contact Information
            </h2>
            
            <div className="space-y-8 mb-12">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex-shrink-0 p-3 bg-brand-rose/10 rounded-full">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{info.title}</h3>
                    <p className="text-gray-900 font-medium">{info.detail}</p>
                    <p className="text-gray-600 text-sm">{info.subtext}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Media */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {social.icon}
                    <span className="font-medium text-gray-700">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-rose focus:border-brand-rose"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-rose focus:border-brand-rose"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-rose focus:border-brand-rose"
                      placeholder="+91 93426 61671"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-rose focus:border-brand-rose"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="booking">Booking Question</option>
                      <option value="returns">Returns & Exchanges</option>
                      <option value="customization">Customization Request</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-rose focus:border-brand-rose"
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-rose hover:bg-brand-rose/90 flex items-center justify-center gap-2 py-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </Button>
                
                {submitStatus === 'success' && (
                  <motion.div
                    className="p-4 bg-green-100 border border-green-200 rounded-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-green-800 text-center">
                      <strong>Thank you!</strong> Your message has been sent successfully. We'll get back to you soon.
                    </p>
                  </motion.div>
                )}
                
                {submitStatus === 'error' && (
                  <motion.div
                    className="p-4 bg-red-100 border border-red-200 rounded-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-red-800 text-center">
                      <strong>Oops!</strong> Something went wrong. Please try again or contact us directly.
                    </p>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Visit Our Store</h2>
              <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
                Come experience our collection in person. Our showroom is designed to help you 
                find the perfect outfit for your special occasion.
              </p>
              
              <div className="aspect-video bg-gradient-to-br from-brand-rose/20 to-brand-gold/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-brand-rose mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900">Shop No. 17, Kandhaswarna Shopping Mall</p>
                  <p className="text-gray-600">Fairlands, Salem, TN 636016</p>
                  <Button className="mt-4 bg-brand-rose hover:bg-brand-rose/90">
                    Get Directions
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-brand-rose font-heading text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "How far in advance should I book?",
                answer: "We recommend booking at least 2-3 weeks in advance for regular items, and 1-2 months for peak wedding seasons."
              },
              {
                question: "What is your cancellation policy?",
                answer: "Cancellations made more than 7 days before booking date are eligible for a 90% refund. Cancellations made 3-7 days before are eligible for a 50% refund."
              },
              {
                question: "Do you offer customization services?",
                answer: "Yes, we offer customization services for most of our dresses. Please contact us to discuss your specific requirements."
              },
              {
                question: "How do I care for rented items?",
                answer: "We provide detailed care instructions with each rental. Most items should be dry cleaned only. Please follow the specific instructions provided."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;