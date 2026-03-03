'use client';

import { motion } from 'framer-motion';
import { Star, Award, Users, Heart, Truck, Shield } from 'lucide-react';

// ─── Brand tokens (rose palette) ─────────────────────────────────────────────
// deep:    #6B1F2A   accent: #C96E82   blush: #F0C4CC
// stone:   #F5E6E8   ivory: #FFF8F8    muted: #A0525E

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

const features = [
  { icon: Star,   title: 'Premium Quality',      description: 'Every piece is handpicked for exceptional craftsmanship and lasting beauty.' },
  { icon: Award,  title: 'Award Winning',         description: 'Recognised for excellence in bridal fashion and service across India.' },
  { icon: Users,  title: 'Trusted by Thousands',  description: 'Over 10,000 brides have chosen us for their most unforgettable moments.' },
  { icon: Heart,  title: 'Passion for Fashion',   description: 'We believe every woman deserves to feel extraordinary on her special day.' },
];

const stats = [
  { number: '10,000+', label: 'Happy Customers' },
  { number: '500+',    label: 'Dresses Available' },
  { number: '50+',     label: 'Jewellery Pieces' },
  { number: '5',       label: 'Years Experience' },
];

const team = [
  { name: 'Priya Sharma',  role: 'Founder & Creative Director', bio: 'With over 15 years in bridal fashion, Priya brings passion and expertise to every collection.' },
  { name: 'Rahul Mehta',   role: 'Operations Manager',          bio: 'Ensures seamless operations and exceptional customer experience across all touchpoints.' },
  { name: 'Anjali Patel',  role: 'Lead Designer',               bio: 'Creates stunning designs that blend traditional elegance with contemporary style.' },
];

const values = [
  { icon: Shield, label: 'Trust',       sub: 'Built through consistent excellence' },
  { icon: Heart,  label: 'Passion',     sub: 'For beauty and craftsmanship' },
  { icon: Truck,  label: 'Reliability', sub: 'On-time delivery, every time' },
  { icon: Star,   label: 'Excellence',  sub: 'In every stitch and detail' },
];

export default function AboutPage() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap"
      />
      <style>{`
        .about-root { font-family: 'Jost', sans-serif; font-weight: 300; color: #6B1F2A; background: #FFF8F8; }
        .serif { font-family: 'Cormorant Garamond', serif; }
        .label-tag {
          display: inline-block;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.35em; text-transform: uppercase;
          color: #C96E82; margin-bottom: 16px;
        }
        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 5vw, 54px);
          font-weight: 300; line-height: 1.1;
          color: #6B1F2A; margin: 0 0 20px;
        }
        .section-title em { font-style: italic; color: #C96E82; }
        .body-text { font-size: 15px; line-height: 1.85; color: #7A5560; }
        .gold-bar { width: 40px; height: 1px; background: #C96E82; margin: 20px 0; }
        .divider { border: none; border-top: 1px solid #F5E6E8; margin: 0; }
      `}</style>

      <div className="about-root">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section style={{ position: 'relative', padding: '120px 60px 100px', overflow: 'hidden', textAlign: 'center' }}>
          {/* background rings */}
          <div style={{ position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, borderRadius: '50%', border: '1px solid #F0C4CC', pointerEvents: 'none', opacity: 0.5 }} />
          <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', width: 500, height: 500, borderRadius: '50%', border: '1px solid #F5E6E8', pointerEvents: 'none', opacity: 0.8 }} />
          {/* gradient blob */}
          <div style={{ position: 'absolute', top: 0, right: 0, width: 420, height: 420, background: 'radial-gradient(circle, #F0C4CC 0%, transparent 70%)', opacity: 0.25, pointerEvents: 'none' }} />

          <motion.div {...fade(0)} style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
            <span className="label-tag">Est. 2019 · Hyderabad</span>
            <h1 className="section-title" style={{ fontSize: 'clamp(48px, 7vw, 88px)', marginBottom: 28 }}>
              Our <em>Story</em>
            </h1>
            <div className="gold-bar" style={{ margin: '0 auto 28px' }} />
            <p className="body-text" style={{ fontSize: 17, maxWidth: 560, margin: '0 auto' }}>
              At Nirali Sai Boutique, we believe every woman deserves to feel extraordinary. 
              Since 2019, we've been crafting unforgettable experiences through our exquisite 
              collection of bridal wear and fine jewellery.
            </p>
          </motion.div>
        </section>

        <hr className="divider" />

        {/* ── Story ────────────────────────────────────────────────────────── */}
        <section style={{ padding: '100px 60px', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <motion.div {...fade(0)}>
            <span className="label-tag">Our Journey</span>
            <h2 className="section-title">From Passion<br /><em>to Legacy</em></h2>
            <div className="gold-bar" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p className="body-text">
                What started as a small boutique in Hyderabad has grown into a beloved destination 
                for brides across India. Our journey began with a simple vision: to make every 
                woman feel like a queen on her special day.
              </p>
              <p className="body-text">
                Today, we offer an extensive collection of handpicked dresses, traditional wear, 
                and stunning jewellery — each piece a testament to craftsmanship, heritage, and 
                timeless beauty.
              </p>
              <p className="body-text">
                We understand that your occasion deserves nothing less than perfection. That's why 
                we've built our reputation on exceptional quality, personalised service, and an 
                unwavering commitment to making your dreams come true.
              </p>
            </div>
          </motion.div>

          <motion.div {...fade(0.15)} style={{ position: 'relative' }}>
            {/* decorative image placeholder */}
            <div style={{
              aspectRatio: '4/5',
              background: 'linear-gradient(135deg, #F5E6E8 0%, #FFF8F8 100%)',
              border: '1px solid #F0C4CC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 16,
            }}>
              <Heart size={48} style={{ color: '#C96E82', opacity: 0.5 }} />
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: '#A0525E', fontStyle: 'italic', letterSpacing: '0.05em' }}>Our Collection</span>
            </div>
            {/* offset accent box */}
            <div style={{
              position: 'absolute',
              bottom: -24, right: -24,
              width: 140, height: 140,
              border: '1px solid #F0C4CC',
              background: '#FFF8F8',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6,
            }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: '#6B1F2A', lineHeight: 1 }}>5</span>
              <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C96E82' }}>Years</span>
            </div>
          </motion.div>
        </section>

        {/* ── Stats ────────────────────────────────────────────────────────── */}
        <section style={{ background: '#6B1F2A', padding: '80px 60px' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
            {stats.map((s, i) => (
              <motion.div
                key={i}
                {...fade(i * 0.1)}
                style={{
                  textAlign: 'center',
                  padding: '0 40px',
                  borderRight: i < 3 ? '1px solid rgba(240,196,204,0.2)' : 'none',
                }}
              >
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 300, color: '#F0C4CC', lineHeight: 1, marginBottom: 8 }}>
                  {s.number}
                </div>
                <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,196,204,0.6)' }}>
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Why Choose Us ─────────────────────────────────────────────────── */}
        <section style={{ padding: '100px 60px', background: '#FFF8F8' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <motion.div {...fade(0)} style={{ textAlign: 'center', marginBottom: 72 }}>
              <span className="label-tag">Our Difference</span>
              <h2 className="section-title">Why Choose <em>Us</em></h2>
              <div className="gold-bar" style={{ margin: '0 auto' }} />
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={i}
                    {...fade(i * 0.1)}
                    style={{
                      padding: '48px 32px',
                      background: i % 2 === 0 ? '#FFF8F8' : '#F5E6E8',
                      borderTop: '2px solid transparent',
                      transition: 'border-color 0.3s',
                      cursor: 'default',
                    }}
                    whileHover={{ borderColor: '#C96E82' } as any}
                  >
                    <div style={{ marginBottom: 20 }}>
                      <Icon size={28} style={{ color: '#C96E82' }} />
                    </div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: '#6B1F2A', marginBottom: 12 }}>
                      {f.title}
                    </h3>
                    <p className="body-text" style={{ fontSize: 13 }}>{f.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* ── Team ─────────────────────────────────────────────────────────── */}
        <section style={{ padding: '100px 60px', maxWidth: 1200, margin: '0 auto' }}>
          <motion.div {...fade(0)} style={{ textAlign: 'center', marginBottom: 72 }}>
            <span className="label-tag">The People</span>
            <h2 className="section-title">Meet Our <em>Team</em></h2>
            <div className="gold-bar" style={{ margin: '0 auto' }} />
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            {team.map((m, i) => (
              <motion.div
                key={i}
                {...fade(i * 0.12)}
                style={{ background: '#FFF8F8', border: '1px solid #F5E6E8', overflow: 'hidden' }}
              >
                {/* photo placeholder */}
                <div style={{
                  aspectRatio: '1',
                  background: `linear-gradient(135deg, #F5E6E8 ${i * 10}%, #FFF8F8 100%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderBottom: '1px solid #F0C4CC',
                }}>
                  <Users size={40} style={{ color: '#D4A0A8' }} />
                </div>
                <div style={{ padding: '28px 28px 32px' }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: '#6B1F2A', marginBottom: 4 }}>
                    {m.name}
                  </h3>
                  <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C96E82', marginBottom: 16 }}>
                    {m.role}
                  </p>
                  <p className="body-text" style={{ fontSize: 13 }}>{m.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Values ───────────────────────────────────────────────────────── */}
        <section style={{ background: '#6B1F2A', padding: '100px 60px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <motion.div {...fade(0)}>
              <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 500, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#F0C4CC', marginBottom: 16 }}>
                What Guides Us
              </span>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 300, color: '#FFF8F8', lineHeight: 1.1, marginBottom: 20 }}>
                Our Core <em style={{ fontStyle: 'italic', color: '#F0C4CC' }}>Values</em>
              </h2>
              <div style={{ width: 40, height: 1, background: '#C96E82', marginBottom: 36 }} />
              {[
                { title: 'Quality First',         desc: 'We never compromise. Every piece undergoes rigorous quality checks to ensure perfection.' },
                { title: 'Customer Centric',      desc: 'Your satisfaction is our priority. We go above and beyond to create memorable experiences.' },
                { title: 'Heritage & Innovation', desc: 'We honour traditional craftsmanship while embracing modern innovation.' },
              ].map((v, i) => (
                <motion.div key={i} {...fade(i * 0.1)} style={{ marginBottom: 32, paddingLeft: 20, borderLeft: '1px solid rgba(240,196,204,0.3)' }}>
                  <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, color: '#FFF8F8', marginBottom: 6 }}>{v.title}</h4>
                  <p style={{ fontSize: 13, lineHeight: 1.8, color: 'rgba(240,196,204,0.7)' }}>{v.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div {...fade(0.15)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div
                    key={i}
                    style={{
                      padding: '36px 28px',
                      background: 'rgba(255,248,248,0.05)',
                      border: '1px solid rgba(240,196,204,0.15)',
                      transition: 'background 0.25s',
                      cursor: 'default',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,248,248,0.1)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,248,248,0.05)'}
                  >
                    <Icon size={24} style={{ color: '#C96E82', marginBottom: 16 }} />
                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, color: '#FFF8F8', marginBottom: 6 }}>{v.label}</h4>
                    <p style={{ fontSize: 12, letterSpacing: '0.04em', color: 'rgba(240,196,204,0.55)', lineHeight: 1.6 }}>{v.sub}</p>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ── CTA strip ────────────────────────────────────────────────────── */}
        <section style={{ padding: '80px 60px', textAlign: 'center', background: '#FFF8F8', borderTop: '1px solid #F5E6E8' }}>
          <motion.div {...fade(0)}>
            <span className="label-tag">Begin Your Journey</span>
            <h2 className="section-title" style={{ marginBottom: 12 }}>
              Find Your <em>Perfect</em> Look
            </h2>
            <div className="gold-bar" style={{ margin: '0 auto 32px' }} />
            <a
              href="/catalog/dresses"
              style={{
                display: 'inline-block',
                padding: '14px 48px',
                background: '#6B1F2A',
                color: '#FFF8F8',
                fontFamily: "'Jost', sans-serif",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.target as HTMLElement).style.background = '#A0525E'}
              onMouseLeave={e => (e.target as HTMLElement).style.background = '#6B1F2A'}
            >
              Explore Collection
            </a>
          </motion.div>
        </section>

      </div>
    </>
  );
}