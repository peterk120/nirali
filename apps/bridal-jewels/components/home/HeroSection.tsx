'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

/* ── Types ─────────────────────────────────────────────────────────── */
interface CTA { label: string; href: string; }

interface HeroSectionProps {
  title: string;
  subtitle: string;
  eyebrow?: string;
  ctaPrimary: CTA;
  ctaSecondary?: CTA;
  backgroundImage: string;
  backgroundVideo?: string;
  brand?: 'boutique' | 'bridal-jewels' | 'sasthik' | 'tamilsmakeover';
}

/* ── Brand accent map ───────────────────────────────────────────────── */
const brandAccent: Record<string, { primary: string; hover: string; text: string }> = {
  'bridal-jewels': { primary: 'var(--amber-300)',  hover: 'var(--gold-light)', text: 'var(--amber-900)' },
  boutique:        { primary: '#f43f5e',           hover: '#fb7185',          text: '#fff' },
  sasthik:         { primary: '#14b8a6',           hover: '#2dd4bf',          text: '#fff' },
  tamilsmakeover:  { primary: '#7c3aed',           hover: '#a78bfa',          text: '#fff' },
};

/* ── HeroSection ────────────────────────────────────────────────────── */
const HeroSection = ({
  title = 'Where Every Jewel\nBegins as a Dream',
  subtitle = 'Premium 22K gold, diamond & Kundan bridal jewellery sets — curated for the bride who deserves nothing but the finest.',
  eyebrow = 'Nirali Sai Bridal Jewels',
  ctaPrimary = { label: 'Explore Collection', href: '/catalog' },
  ctaSecondary = { label: 'Book a Consultation', href: '/booking' },
  backgroundImage = '/hero-bg.jpg',
  backgroundVideo,
  brand = 'bridal-jewels',
}: Partial<HeroSectionProps>) => {
  const [videoError, setVideoError]     = useState(false);
  const [videoReady, setVideoReady]     = useState(false);
  const accent = brandAccent[brand] ?? brandAccent['bridal-jewels'];

  const { scrollY } = useScroll();
  const bgY         = useTransform(scrollY, [0, 600], ['0%', '25%']);
  const contentY    = useTransform(scrollY, [0, 600], ['0%', '12%']);
  const opacity     = useTransform(scrollY, [0, 400], [1, 0]);

  /* stagger children */
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.14, delayChildren: 0.35 } },
  };
  const item = {
    hidden: { opacity: 0, y: 32 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.25,0.1,0.25,1] } },
  };

  const showVideo = backgroundVideo && !videoError;

  return (
    <>
      <style>{`
        .hero-cta-primary {
          background: ${accent.primary};
          color: ${accent.text};
          border: none;
          transition: background 0.35s cubic-bezier(0.25, 0.1, 0.25, 1),
                      transform 0.18s cubic-bezier(0.25, 0.1, 0.25, 1),
                      box-shadow 0.35s cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        .hero-cta-primary:hover {
          background: ${accent.hover};
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(201,150,12,0.35);
        }
        .hero-cta-secondary {
          background: transparent;
          color: rgba(253,246,233,0.85);
          border: 1px solid rgba(253,246,233,0.35);
          transition: background 0.35s cubic-bezier(0.25, 0.1, 0.25, 1),
                      border-color 0.35s cubic-bezier(0.25, 0.1, 0.25, 1),
                      transform 0.18s cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        .hero-cta-secondary:hover {
          background: rgba(253,246,233,0.08);
          border-color: rgba(253,246,233,0.65);
          transform: translateY(-2px);
        }
        .hero-badge {
          animation: badge-shimmer 3s ease-in-out infinite;
        }
        @keyframes badge-shimmer {
          0%,100% { opacity:0.7; } 50% { opacity:1; }
        }
      `}</style>

      <section style={{ position:'relative', minHeight:'100svh', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>

        {/* ── Background ── */}
        <motion.div style={{ position:'absolute', inset:0, y: bgY, scale: 1.08 }}>
          {showVideo ? (
            <>
              <video
                src={backgroundVideo}
                autoPlay muted loop playsInline
                onLoadedData={() => setVideoReady(true)}
                onError={() => setVideoError(true)}
                style={{ width:'100%', height:'100%', objectFit:'cover', opacity: videoReady ? 1 : 0, transition:'opacity 0.6s' }}
              />
              {!videoReady && (
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg, #4a1e04, #6b3006)' }} />
              )}
            </>
          ) : (
            <Image src={backgroundImage} alt="" fill priority sizes="100vw" style={{ objectFit:'cover' }} />
          )}
        </motion.div>

        {/* ── Layered overlays ── */}
        {/* Rich dark gradient so text always pops */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(170deg, rgba(74,30,4,0.82) 0%, rgba(74,30,4,0.55) 45%, rgba(74,30,4,0.75) 100%)', zIndex:1 }} />
        {/* Vignette edge */}
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(30,10,0,0.6) 100%)', zIndex:1 }} />
        {/* Gold shimmer bar — decorative diagonal */}
        <div style={{ position:'absolute', top:0, left:'-40%', width:'80%', height:'100%', background:'linear-gradient(105deg, transparent 45%, rgba(240,192,64,0.04) 50%, transparent 55%)', zIndex:2, pointerEvents:'none' }} />

        {/* ── Decorative rings ── */}
        {[380, 580, 780].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity:0, scale:0.85 }}
            animate={{ opacity:1, scale:1 }}
            transition={{ delay: 0.2 + i*0.2, duration:1.4, ease:'easeOut' }}
            style={{
              position:'absolute', width:s, height:s, borderRadius:'50%',
              border:`1px solid rgba(240,192,64,${0.1 - i*0.028})`,
              top:'50%', left:'50%', transform:'translate(-50%,-50%)',
              zIndex:2, pointerEvents:'none',
            }}
          />
        ))}

        {/* ── Eyebrow badge ── */}
        {eyebrow && (
          <motion.div
            initial={{ opacity:0, y:-16 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.9, delay:0.1 }}
            className="hero-badge"
            style={{
              position:'absolute', top: 'clamp(1.5rem,5vh,3rem)',
              left:'50%', transform:'translateX(-50%)',
              zIndex:10,
              display:'flex', alignItems:'center', gap:'0.6rem',
              padding:'6px 20px',
              border:'1px solid rgba(240,192,64,0.35)',
              borderRadius:2,
              background:'rgba(74,30,4,0.5)',
              backdropFilter:'blur(8px)',
            }}
          >
            <span style={{ width:4, height:4, borderRadius:'50%', background:'var(--gold-light)', display:'inline-block' }} />
            <span style={{ fontFamily:"var(--font-label)", fontSize:'0.55rem', letterSpacing:'0.35em', textTransform:'uppercase', color:'var(--amber-200)' }}>
              {eyebrow}
            </span>
            <span style={{ width:4, height:4, borderRadius:'50%', background:'var(--gold-light)', display:'inline-block' }} />
          </motion.div>
        )}

        {/* ── Main content ── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={{ position:'relative', zIndex:10, textAlign:'center', padding:'0 clamp(1.5rem,6vw,4rem)', maxWidth:860, width:'100%', y: contentY, opacity }}
        >
          {/* Title */}
          <motion.h1 variants={item} style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem,8vw,6.5rem)',
            fontWeight: 300,
            color: '#fdf6e9',
            lineHeight: 1.0,
            letterSpacing: '-0.015em',
            marginBottom: '1.75rem',
            whiteSpace: 'pre-line',
          }}>
            {title.split('\n').map((line, i) => (
              <span key={i} style={{ display:'block' }}>
                {i % 2 === 1
                  ? <em style={{ fontWeight:600, color:'var(--gold-light)', fontStyle:'italic' }}>{line}</em>
                  : line}
              </span>
            ))}
          </motion.h1>

          {/* Rule */}
          <motion.div variants={item} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'1rem', marginBottom:'1.75rem' }}>
            <div style={{ flex:1, maxWidth:80, height:1, background:'linear-gradient(90deg,transparent,rgba(240,192,64,0.5))' }} />
            <span style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:'1.2rem', color:'var(--amber-300)', letterSpacing:'0.1em' }}>✦</span>
            <div style={{ flex:1, maxWidth:80, height:1, background:'linear-gradient(90deg,rgba(240,192,64,0.5),transparent)' }} />
          </motion.div>

          {/* Subtitle */}
          <motion.p variants={item} style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1.05rem,2.2vw,1.3rem)',
            color: 'rgba(253,246,233,0.75)',
            maxWidth: 580,
            lineHeight: 1.75,
            margin: '0 auto 2.75rem',
          }}>
            {subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'1rem', marginBottom:'1rem' }}>
            <Link href={ctaPrimary.href as any}>
              <button className="hero-cta-primary" style={{
                fontFamily: 'var(--font-label)',
                fontSize: 'clamp(0.6rem,1.2vw,0.7rem)',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                padding: 'clamp(0.85rem,2vw,1rem) clamp(2rem,4vw,2.5rem)',
                borderRadius: 2, cursor:'pointer',
              }}>
                {ctaPrimary.label}
              </button>
            </Link>

            {ctaSecondary && (
              <Link href={ctaSecondary.href as any}>
                <button className="hero-cta-secondary" style={{
                  fontFamily: 'var(--font-label)',
                  fontSize: 'clamp(0.6rem,1.2vw,0.7rem)',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  padding: 'clamp(0.85rem,2vw,1rem) clamp(2rem,4vw,2.5rem)',
                  borderRadius: 2, cursor:'pointer',
                }}>
                  {ctaSecondary.label}
                </button>
              </Link>
            )}
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={item} style={{ display:'flex', justifyContent:'center', gap:'1.5rem', flexWrap:'wrap', marginTop:'1.5rem' }}>
            {['22K Gold', 'Fully Insured', 'Free Delivery', '100% Original'].map(badge => (
              <span key={badge} style={{
                fontFamily: 'var(--font-label)',
                fontSize: '0.5rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(253,246,233,0.45)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}>
                <span style={{ width:3, height:3, borderRadius:'50%', background:'var(--amber-400)', display:'inline-block', opacity:0.7 }} />
                {badge}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Scroll cue ── */}
        <motion.div
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:2.2 }}
          style={{ position:'absolute', bottom:'clamp(1.5rem,4vh,2.5rem)', left:'50%', transform:'translateX(-50%)', zIndex:10, display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem' }}
        >
          <span style={{ fontFamily:'var(--font-label)', fontSize:'0.48rem', letterSpacing:'0.35em', textTransform:'uppercase', color:'rgba(253,246,233,0.3)' }}>Scroll</span>
          {/* Mouse outline */}
          <div style={{ width:26, height:42, borderRadius:13, border:'1px solid rgba(253,246,233,0.25)', display:'flex', justifyContent:'center', padding:'6px 0' }}>
            <motion.div
              animate={{ y:[0, 12, 0] }}
              transition={{ repeat:Infinity, duration:1.8, ease:'easeInOut' }}
              style={{ width:4, height:4, borderRadius:'50%', background:'rgba(240,192,64,0.7)' }}
            />
          </div>
        </motion.div>

      </section>
    </>
  );
};

export default HeroSection;