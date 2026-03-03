'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Star, Heart } from 'lucide-react';
import { useRef } from 'react';

const AboutPage = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.18 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } },
  };

  const craftsmen = [
    { initials: 'RG', name: 'Rahul Gupta', title: 'Head Artisan', years: 32 },
    { initials: 'PM', name: 'Priya Mehta', title: 'Gem Setter', years: 27 },
    { initials: 'AS', name: 'Arjun Sharma', title: 'Filigree Master', years: 21 },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fdf6e9',
        fontFamily: "'EB Garamond', Georgia, serif",
        overflowX: 'hidden',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --amber-50: #fdf6e9;
          --amber-100: #fdedc8;
          --amber-200: #fad78a;
          --amber-300: #f5bc44;
          --amber-400: #e8a020;
          --amber-500: #c97f10;
          --amber-600: #a85f0a;
          --amber-700: #874508;
          --amber-800: #6b3006;
          --amber-900: #4a1e04;
          --gold: #c9960c;
          --gold-light: #f0c040;
        }

        .noise-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px;
        }

        .section-rule {
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          margin: 0 auto 1.5rem;
        }

        .ornament {
          font-family: 'Cormorant Garamond', serif;
          color: var(--amber-300);
          font-size: 2rem;
          line-height: 1;
          letter-spacing: 0.3em;
        }

        .hero-text-mask {
          background: linear-gradient(180deg, var(--amber-900) 0%, var(--amber-700) 60%, var(--amber-500) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .card-luxury {
          background: #fff;
          border: 1px solid rgba(201,150,12,0.15);
          border-radius: 2px;
          position: relative;
          overflow: hidden;
        }
        .card-luxury::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(253,237,200,0.4) 0%, transparent 60%);
          pointer-events: none;
        }

        .value-icon-ring {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: 1px solid var(--amber-300);
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--amber-50), var(--amber-100));
          margin: 0 auto 1.5rem;
          position: relative;
        }
        .value-icon-ring::after {
          content: '';
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          border: 1px dashed rgba(201,150,12,0.3);
        }

        .craftsman-avatar {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          margin: 0 auto 1.25rem;
          background: linear-gradient(135deg, var(--amber-200), var(--amber-400));
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          border: 3px solid var(--amber-100);
          box-shadow: 0 0 0 1px var(--amber-300), 0 8px 32px rgba(201,150,12,0.2);
        }

        .story-pull {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: clamp(1.4rem, 3vw, 2rem);
          line-height: 1.5;
          color: var(--amber-700);
          border-left: 2px solid var(--gold-light);
          padding-left: 2rem;
          margin: 2.5rem 0;
        }

        .grid-story {
          display: grid;
          grid-template-columns: 1fr 1px 1fr;
          gap: 0;
        }
        .grid-divider {
          background: linear-gradient(180deg, transparent, var(--amber-300), transparent);
          width: 1px;
        }

        @media (max-width: 768px) {
          .grid-story { grid-template-columns: 1fr; }
          .grid-divider { display: none; }
        }
      `}</style>

      <div className="noise-overlay" />

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: 'linear-gradient(160deg, #4a1e04 0%, #6b3006 40%, #a85f0a 100%)',
        }}
      >
        {/* Decorative gold rings */}
        {[300, 480, 660].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.2, duration: 1.2, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: s,
              height: s,
              borderRadius: '50%',
              border: `1px solid rgba(240,192,64,${0.15 - i * 0.04})`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          />
        ))}

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, textAlign: 'center', padding: '2rem', position: 'relative', zIndex: 1 }}
        >
          <motion.div
            initial={{ opacity: 0, letterSpacing: '0.6em' }}
            animate={{ opacity: 1, letterSpacing: '0.35em' }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(0.6rem, 1.5vw, 0.8rem)',
              color: 'var(--amber-300)',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              marginBottom: '2rem',
            }}
          >
            Est. 1950 · Mumbai · India
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(3.5rem, 10vw, 9rem)',
              fontWeight: 300,
              color: '#fdf6e9',
              lineHeight: 0.9,
              letterSpacing: '-0.01em',
              marginBottom: '1rem',
            }}
          >
            Our
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(3.5rem, 10vw, 9rem)',
              fontWeight: 600,
              fontStyle: 'italic',
              color: 'var(--gold-light)',
              lineHeight: 0.9,
              letterSpacing: '-0.01em',
              marginBottom: '2.5rem',
            }}
          >
            Heritage
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--gold-light), transparent)', maxWidth: 300, margin: '0 auto 2rem' }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              color: 'rgba(253,246,233,0.75)',
              maxWidth: 540,
              lineHeight: 1.7,
              margin: '0 auto',
            }}
          >
            For over three generations, we have been crafting exquisite bridal jewellery
            that celebrates the timeless beauty of Indian traditions.
          </motion.p>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={{ position: 'absolute', bottom: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
        >
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.55rem', letterSpacing: '0.3em', color: 'var(--amber-400)', textTransform: 'uppercase' }}>Scroll</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            style={{ width: 1, height: 40, background: 'linear-gradient(180deg, var(--gold-light), transparent)' }}
          />
        </motion.div>
      </section>

      {/* ── STORY ── */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(4rem,10vw,9rem) clamp(1.5rem,6vw,4rem)' }}
      >
        <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="ornament">✦ ✦ ✦</div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(0.65rem,1.5vw,0.75rem)', letterSpacing: '0.4em', color: 'var(--amber-500)', textTransform: 'uppercase', margin: '1rem 0 0.75rem' }}>The Story</h2>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 300, color: 'var(--amber-900)', lineHeight: 1.1 }}>
            A Journey of <em>Craft & Soul</em>
          </h3>
        </motion.div>

        <motion.div variants={fadeUp} className="card-luxury" style={{ padding: 'clamp(2.5rem,6vw,5rem)' }}>
          <div className="grid-story">
            <div style={{ paddingRight: 'clamp(1.5rem,4vw,3.5rem)' }}>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(1.05rem,2vw,1.2rem)', color: '#4a3520', lineHeight: 1.85 }}>
                Founded in 1950, Bridal Jewels began as a small family workshop in the heart of Mumbai.
                What started as a humble venture with a single craftsman has grown into one of India's
                most revered destinations for bridal jewellery.
              </p>

              <div className="story-pull">
                "Every gem we set carries the weight of a story — yours."
              </div>

              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(1.05rem,2vw,1.2rem)', color: '#4a3520', lineHeight: 1.85 }}>
                Our founder, Shri Rajesh Gupta, learned the ancient art of jewellery making from his grandfather,
                who was a court jeweller to the royal families of Rajasthan. This rich heritage continues to define
                every piece we create.
              </p>
            </div>

            <div className="grid-divider" />

            <div style={{ paddingLeft: 'clamp(1.5rem,4vw,3.5rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2rem' }}>
              {[
                { num: '75+', label: 'Years of Heritage' },
                { num: '3', label: 'Generations of Mastery' },
                { num: '12K+', label: 'Bridal Stories Told' },
              ].map(({ num, label }) => (
                <div key={label} style={{ borderBottom: '1px solid rgba(201,150,12,0.15)', paddingBottom: '1.5rem' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.8rem,5vw,4rem)', fontWeight: 600, color: 'var(--amber-700)', lineHeight: 1 }}>{num}</div>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--amber-500)', marginTop: '0.4rem' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* ── VALUES ── */}
      <section style={{ background: 'linear-gradient(180deg, #fdf6e9, #fdedc8 50%, #fdf6e9)', padding: 'clamp(4rem,10vw,8rem) clamp(1.5rem,6vw,4rem)' }}>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          style={{ maxWidth: 1100, margin: '0 auto' }}
        >
          <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="ornament">✦</div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(0.65rem,1.5vw,0.75rem)', letterSpacing: '0.4em', color: 'var(--amber-500)', textTransform: 'uppercase', margin: '1rem 0 0.75rem' }}>What Guides Us</h2>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem,6vw,4rem)', fontWeight: 300, color: 'var(--amber-900)', lineHeight: 1.1 }}>
              Our <em>Values</em>
            </h3>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            {[
              { Icon: Star, title: 'Excellence', body: 'We maintain the highest standards of quality in every piece, ensuring each bride feels truly regal on her most cherished day.' },
              { Icon: Clock, title: 'Heritage', body: 'Three generations of expertise in traditional Indian jewellery craftsmanship — an unbroken lineage of artistry and devotion.' },
              { Icon: Heart, title: 'Passion', body: 'Every piece is crafted with love and dedication to celebrate life\'s most precious moments, from betrothal to vows.' },
            ].map(({ Icon, title, body }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(201,150,12,0.15)' }}
                transition={{ duration: 0.4 }}
                className="card-luxury"
                style={{ padding: 'clamp(2rem,4vw,3rem)', textAlign: 'center' }}
              >
                <div className="value-icon-ring">
                  <Icon size={26} color="var(--amber-600)" strokeWidth={1.5} />
                </div>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '0.85rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--amber-800)', marginBottom: '1rem' }}>{title}</h3>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1.1rem', color: '#5a3d22', lineHeight: 1.75 }}>{body}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── TEAM ── */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(4rem,10vw,9rem) clamp(1.5rem,6vw,4rem)' }}
      >
        <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="ornament">✦ ✦ ✦</div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(0.65rem,1.5vw,0.75rem)', letterSpacing: '0.4em', color: 'var(--amber-500)', textTransform: 'uppercase', margin: '1rem 0 0.75rem' }}>The Hands Behind Every Gem</h2>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem,6vw,4rem)', fontWeight: 300, color: 'var(--amber-900)', lineHeight: 1.1 }}>
            Master <em>Craftsmen</em>
          </h3>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem' }}>
          {craftsmen.map(({ initials, name, title, years }, i) => (
            <motion.div
              key={name}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4 }}
              style={{ textAlign: 'center' }}
            >
              <div className="craftsman-avatar">
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', fontWeight: 600, color: 'var(--amber-900)', letterSpacing: '0.05em' }}>{initials}</span>
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 600, color: 'var(--amber-800)' }}>{name}</h3>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--amber-500)', margin: '0.4rem 0 0.75rem' }}>{title}</p>
              <div style={{ width: 30, height: 1, background: 'var(--amber-300)', margin: '0 auto 0.75rem' }} />
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1.05rem', color: '#6b4c2a', lineHeight: 1.6 }}>
                {years} years crafting heirloom jewellery that becomes the cornerstone of family histories.
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── FOOTER BAND ── */}
      <div style={{ background: 'var(--amber-900)', padding: '2.5rem', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 'clamp(1.1rem,2.5vw,1.5rem)', color: 'var(--amber-200)', letterSpacing: '0.02em' }}>
          Where every jewel begins as a dream, and ends as a legacy.
        </p>
        <div style={{ width: 40, height: 1, background: 'var(--gold-light)', margin: '1.2rem auto 0', opacity: 0.5 }} />
      </div>
    </div>
  );
};

export default AboutPage;