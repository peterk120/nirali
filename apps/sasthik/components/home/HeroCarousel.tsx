'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface HeroSlide {
  title: string;
  subtitle: string;
  color: string;
  image: string;
  mobileImage?: string;
  buttonText: string;
  buttonLink: string;
}

const heroSlides: HeroSlide[] = [
  { title: "", subtitle: "", color: "bg-brand-teal", image: "/img/banner 1.png", mobileImage: "/img/banner 1 mob.png", buttonText: "Shop Temple Jewelry", buttonLink: "/jewellery" },
  { title: "", subtitle: "", color: "bg-brand-rose-gold", image: "/img/banner 2.png", mobileImage: "/img/banner 2 mob.png", buttonText: "Explore Collection", buttonLink: "/jewellery" },
  { title: "", subtitle: "", color: "bg-[#1A1A2E]", image: "/img/banner 3.png", mobileImage: "/img/banner 3 mob.png", buttonText: "Shop New Arrivals", buttonLink: "/jewellery" },
];

export default function HeroCarousel() {
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[80vh] h-[80dvh] md:h-[75vh] md:min-h-[500px] md:max-h-[700px] overflow-hidden bg-brand-dark">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentHero}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className={`absolute inset-0 ${heroSlides[currentHero].color} flex items-center justify-center`}
        >
          <div className="absolute inset-0 overflow-hidden z-0">
            {heroSlides[currentHero].image ? (
              <>
                <div className="hidden md:block absolute inset-0">
                  <Image 
                    src={heroSlides[currentHero].image}
                    alt={heroSlides[currentHero].title || "Banner"}
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="100vw"
                  />
                </div>
                <div className="block md:hidden absolute inset-0">
                  <Image 
                    src={heroSlides[currentHero].mobileImage || heroSlides[currentHero].image}
                    alt={heroSlides[currentHero].title || "Banner"}
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="100vw"
                  />
                </div>
                <div className="absolute inset-0 bg-black/20 md:bg-black/10" />
              </>
            ) : (
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            )}
          </div>
          
          <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center justify-end pb-12 md:pb-24 text-center text-white h-full uppercase font-bold tracking-widest">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href={heroSlides[currentHero].buttonLink as any} className="bg-white text-[#1A1A2E] px-10 py-4 md:px-12 md:py-5 font-body text-[10px] md:text-[11px] tracking-[0.2em] uppercase hover:bg-brand-rose-gold hover:text-white transition-all shadow-2xl font-bold flex items-center gap-3 active:scale-95">
                {heroSlides[currentHero].buttonText} <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {heroSlides.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrentHero(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentHero === i ? 'bg-brand-rose-gold w-8' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </section>
  );
}
