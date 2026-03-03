'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { showAddedToWishlist } from '../../lib/toast';

interface DressCardProps {
  id: string;
  name: string;
  category: string;
  images?: string[];
  image?: string;
  rentalPricePerDay: number;
  depositAmount: number;
  sizes: string[];
  isAvailable: boolean;
  rating: number;
  slug: string;
  tags: string[];
}

export const DressCard: React.FC<DressCardProps> = ({
  id,
  name,
  category,
  images,
  image,
  rentalPricePerDay,
  depositAmount,
  sizes,
  isAvailable,
  rating,
  slug,
  tags,
}) => {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const availabilityStatus = isAvailable
    ? 'Available'
    : sizes.length > 0
      ? 'Limited'
      : 'Booked';

  const availabilityColor =
    availabilityStatus === 'Available'
      ? '#4ade80'
      : availabilityStatus === 'Limited'
        ? '#fbbf24'
        : '#9ca3af';

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsWishlisted(prev => !prev);
      if (!isWishlisted) showAddedToWishlist(name);
    } catch {
      setIsWishlisted(isWishlisted);
    }
  };

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/book/dress?dressId=${id}`);
  };

  const mainImage = images?.[0] || image || '/placeholder-product.jpg';
  const hoverImage = images && images.length > 1 ? images[1] : null;

  return (
    <motion.div
      style={{
        background: '#fff',
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        boxShadow: '0 1px 3px rgba(107,31,42,0.06)',
        transition: 'box-shadow 0.3s ease',
      }}
      whileHover={{ boxShadow: '0 12px 48px rgba(107,31,42,0.14)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(`/book/dress?dressId=${id}`)}
    >
      {/* ── Image area ── */}
      <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>

        {/* Base image */}
        <Image
          src={mainImage}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{
            transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)',
            transform: isHovered ? 'scale(1.06)' : 'scale(1)',
          }}
          onError={e => { e.currentTarget.src = '/placeholder-product.jpg'; }}
        />

        {/* Hover: second image crossfade */}
        {hoverImage && (
          <AnimatePresence>
            {isHovered && (
              <motion.div
                style={{ position: 'absolute', inset: 0 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Image
                  src={hoverImage}
                  alt={`${name} alternate`}
                  fill
                  className="object-cover"
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Gradient overlay — always present, intensifies on hover */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(107,31,42,0.75) 0%, rgba(107,31,42,0.1) 45%, transparent 70%)',
          opacity: isHovered ? 1 : 0.4,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
        }} />

        {/* ── Top row badges ── */}
        {/* Category pill — top left */}
        <div style={{
          position: 'absolute', top: 14, left: 14,
          background: 'rgba(201,110,130,0.92)',
          color: '#FFF8F8',
          fontSize: 10,
          fontFamily: 'Jost, sans-serif',
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          padding: '4px 12px',
          backdropFilter: 'blur(4px)',
        }}>
          {category}
        </div>

        {/* Availability dot — top right */}
        <div style={{
          position: 'absolute', top: 14, right: 52,
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'rgba(255,248,248,0.88)',
          backdropFilter: 'blur(4px)',
          padding: '4px 10px',
          fontSize: 10,
          fontFamily: 'Jost, sans-serif',
          letterSpacing: '0.1em',
          color: '#6B1F2A',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: availabilityColor, display: 'inline-block', flexShrink: 0 }} />
          {availabilityStatus}
        </div>

        {/* Wishlist — top right */}
        <motion.button
          style={{
            position: 'absolute', top: 14, right: 14,
            width: 32, height: 32,
            background: 'rgba(255,248,248,0.88)',
            backdropFilter: 'blur(4px)',
            border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 2,
          }}
          onClick={handleWishlistClick}
          whileTap={{ scale: 1.3 }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={15}
            style={{
              color: isWishlisted ? '#C96E82' : '#A0525E',
              fill: isWishlisted ? '#C96E82' : 'none',
              transition: 'all 0.2s ease',
            }}
          />
        </motion.button>

        {/* ── Bottom info overlay (slides up on hover) ── */}
        <motion.div
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '20px 20px 18px',
            display: 'flex', flexDirection: 'column', gap: 12,
          }}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: isHovered ? 0 : 8, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          {/* Sizes row */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {sizes.slice(0, 4).map((s, i) => (
              <span key={i} style={{
                padding: '3px 10px',
                background: 'rgba(255,248,248,0.18)',
                border: '1px solid rgba(255,248,248,0.4)',
                color: '#FFF8F8',
                fontSize: 10,
                fontFamily: 'Jost, sans-serif',
                letterSpacing: '0.12em',
              }}>
                {s}
              </span>
            ))}
            {sizes.length > 4 && (
              <span style={{
                padding: '3px 10px',
                background: 'rgba(255,248,248,0.18)',
                border: '1px solid rgba(255,248,248,0.4)',
                color: '#F0C4CC',
                fontSize: 10,
                fontFamily: 'Jost, sans-serif',
              }}>
                +{sizes.length - 4}
              </span>
            )}
          </div>

          {/* Book Now CTA */}
          <motion.button
            style={{
              width: '100%',
              padding: '11px 0',
              background: '#C96E82',
              color: '#FFF8F8',
              border: 'none',
              fontFamily: 'Jost, sans-serif',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
            whileHover={{ background: '#A0525E' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBookNow}
          >
            <ShoppingBag size={13} />
            Book Now
          </motion.button>
        </motion.div>
      </div>

      {/* ── Card footer ── */}
      <div style={{ padding: '16px 16px 18px', background: '#fff' }}>
        {/* Name */}
        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 18,
          fontWeight: 400,
          color: '#6B1F2A',
          margin: '0 0 6px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          letterSpacing: '0.01em',
        }}>
          {name}
        </p>

        {/* Rating + price row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Stars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                style={{
                  color: i < Math.floor(rating) ? '#C96E82' : '#F0C4CC',
                  fill: i < Math.floor(rating) ? '#C96E82' : 'none',
                }}
              />
            ))}
            <span style={{ fontSize: 11, color: '#D4A0A8', marginLeft: 4, fontFamily: 'Jost, sans-serif', letterSpacing: '0.06em' }}>
              {rating.toFixed(1)}
            </span>
          </div>

          {/* Price */}
          <div style={{ textAlign: 'right' }}>
            <span style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 17,
              fontWeight: 500,
              color: '#A0525E',
              letterSpacing: '0.02em',
            }}>
              ₹{rentalPricePerDay.toLocaleString()}
            </span>
            <span style={{
              fontFamily: 'Jost, sans-serif',
              fontSize: 10,
              color: '#D4A0A8',
              letterSpacing: '0.1em',
              marginLeft: 3,
            }}>
              /day
            </span>
          </div>
        </div>

        {/* Thin accent line */}
        <div style={{
          marginTop: 14,
          height: 1,
          background: `linear-gradient(to right, #C96E82 ${Math.round(rating / 5 * 100)}%, #F5E6E8 0%)`,
        }} />
      </div>
    </motion.div>
  );
};