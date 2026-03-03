'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Shirt, Calendar, Scissors, User, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useBookingStore } from '../../lib/stores/bookingStore';

// ─── Styles ──────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400&family=Jost:wght@300;400;500&display=swap');

  :root {
    --ivory:    #FFF8F8;
    --stone:    #F5E6E8;
    --mink:     #D4A0A8;
    --umber:    #A0525E;
    --espresso: #6B1F2A;
    --gold:     #C96E82;
    --gold-lt:  #F0C4CC;
  }

  .progress-root {
    position: sticky;
    top: 0;
    z-index: 50;
    background: #fff;
    border-bottom: 1px solid var(--stone);
    font-family: 'Jost', sans-serif;
    user-select: none;
    -webkit-user-select: none;
  }
  .progress-root::before {
    content: '';
    display: block;
    height: 2px;
    background: linear-gradient(to right, var(--gold-lt), var(--espresso), var(--gold-lt));
  }

  .progress-inner {
    max-width: 860px;
    margin: 0 auto;
    padding: 20px 60px 22px;
  }

  /* ── Steps row ── */
  .steps-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    position: relative;
    z-index: 1;
  }
  .step-item.disabled { cursor: default; }

  .step-icon {
    width: 40px; height: 40px;
    border: 1px solid var(--stone);
    display: flex; align-items: center; justify-content: center;
    transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
    background: #fff;
    position: relative;
  }
  .step-icon.completed {
    background: var(--espresso);
    border-color: var(--espresso);
  }
  .step-icon.active {
    background: var(--ivory);
    border-color: var(--gold);
    box-shadow: 0 0 0 3px var(--gold-lt);
  }
  .step-icon.completed::after {
    content: '✓';
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    color: var(--ivory); font-size: 14px; font-weight: 500;
  }
  .step-icon.completed svg { opacity: 0; }

  .step-label {
    font-size: 9px; letter-spacing: 0.28em;
    text-transform: uppercase; color: var(--mink);
    white-space: nowrap; transition: color 0.3s;
    pointer-events: none;
  }
  .step-label.active    { color: var(--espresso); font-weight: 500; }
  .step-label.completed { color: var(--umber); }

  .step-connector {
    flex: 1; height: 1px;
    background: var(--stone);
    margin: 0 8px;
    margin-bottom: 28px;
    position: relative; overflow: hidden;
  }
  .step-connector-fill {
    position: absolute; top: 0; left: 0; bottom: 0;
    background: var(--espresso);
    transition: width 0.45s ease;
  }

  /* ── Scrub track ── */
  .scrub-wrap {
    margin-top: 16px;
    position: relative;
    height: 24px;
    display: flex;
    align-items: center;
    cursor: grab;
    touch-action: pan-y;
  }
  .scrub-wrap.dragging { cursor: grabbing; }

  .scrub-track {
    position: relative;
    width: 100%;
    height: 1px;
    background: var(--stone);
  }

  /* tick dots at each step position */
  .scrub-tick {
    position: absolute;
    top: 50%; transform: translate(-50%, -50%);
    width: 5px; height: 5px;
    background: var(--stone);
    pointer-events: none;
    transition: background 0.3s, width 0.2s, height 0.2s;
  }
  .scrub-tick.done   { background: var(--espresso); }
  .scrub-tick.current {
    width: 8px; height: 8px;
    background: var(--espresso);
  }

  /* draggable thumb */
  .scrub-thumb {
    position: absolute;
    top: 50%;
    width: 14px; height: 14px;
    background: var(--espresso);
    border: 2px solid #fff;
    outline: 1px solid var(--espresso);
    transform: translateY(-50%);
    transition: outline-color 0.2s, outline-offset 0.2s;
    pointer-events: none;
    z-index: 3;
  }
  .scrub-wrap.dragging .scrub-thumb {
    outline-color: var(--gold);
    outline-offset: 3px;
    outline-width: 2px;
  }

  /* tooltip above thumb while dragging */
  .scrub-tooltip {
    position: absolute;
    bottom: calc(100% + 10px);
    transform: translateX(-50%);
    background: var(--espresso);
    color: var(--ivory);
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    padding: 5px 10px;
    white-space: nowrap;
    pointer-events: none;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .scrub-tooltip::after {
    content: '';
    position: absolute;
    top: 100%; left: 50%; transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: var(--espresso);
  }
  .scrub-wrap.dragging .scrub-tooltip { opacity: 1; }

  @media (max-width: 640px) {
    .progress-inner { padding: 14px 20px 16px; }
    .step-label     { display: none; }
    .step-icon      { width: 32px; height: 32px; }
    .step-connector { margin: 0 4px; margin-bottom: 20px; }
  }
`;

// ─── Data ────────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, name: 'Select Dress', icon: Shirt,      route: '/book/dress'     },
  { id: 2, name: 'Select Date',  icon: Calendar,   route: '/book/date'      },
  { id: 3, name: 'Customise',    icon: Scissors,   route: '/book/customise' },
  { id: 4, name: 'Review',       icon: User,        route: '/book/review'   },
  { id: 5, name: 'Payment',      icon: CreditCard, route: '/book/payment'   },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const BookingProgressBar = () => {
  const router = useRouter();

  // ── Untouched store connection ─────────────────────────────────────────────
  const currentStep = useBookingStore(state => state.step);
  const setStep     = useBookingStore(state => state.setStep);

  const totalSteps  = STEPS.length;
  const progressPct = ((currentStep - 1) / (totalSteps - 1)) * 100;

  // live drag state (doesn't trigger re-renders)
  const trackRef    = useRef<HTMLDivElement>(null);
  const dragging    = useRef(false);
  const wrapRef     = useRef<HTMLDivElement>(null);
  const thumbRef    = useRef<HTMLDivElement>(null);
  const tooltipRef  = useRef<HTMLDivElement>(null);
  const fillRef     = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStep, setDragStep]     = React.useState(currentStep);

  // navigate to a step (only previously visited steps)
  const goToStep = (stepId: number) => {
    if (stepId < 1 || stepId > totalSteps) return;
    if (stepId <= currentStep) {
      setStep(stepId);
      const t = STEPS.find(s => s.id === stepId);
      if (t) router.push(t.route as any);
    }
  };

  // convert clientX → step number (1-based)
  const clientXToStep = (clientX: number): number => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return currentStep;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.max(1, Math.min(totalSteps, Math.round(pct * (totalSteps - 1) + 1)));
  };

  // update visual position instantly during drag (no react re-render)
  const updateDragVisuals = (stepId: number) => {
    const pct = ((stepId - 1) / (totalSteps - 1)) * 100;
    if (thumbRef.current)   thumbRef.current.style.left   = `calc(${pct}% - 7px)`;
    if (fillRef.current)    fillRef.current.style.width   = `${pct}%`;
    if (tooltipRef.current) {
      tooltipRef.current.style.left = `${pct}%`;
      const name = STEPS.find(s => s.id === stepId)?.name ?? '';
      tooltipRef.current.textContent = name;
    }
  };

  const onDragStart = (clientX: number) => {
    dragging.current = true;
    setIsDragging(true);
    const step = clientXToStep(clientX);
    setDragStep(step);
    updateDragVisuals(step);
  };

  const onDragMove = (clientX: number) => {
    if (!dragging.current) return;
    const step = clientXToStep(clientX);
    setDragStep(step);
    updateDragVisuals(step);
  };

  const onDragEnd = () => {
    if (!dragging.current) return;
    dragging.current = false;
    setIsDragging(false);
    // snap: only navigate to accessible steps
    goToStep(dragStep);
    // reset visuals to currentStep (goToStep updates store, which re-renders)
  };

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onDragStart(e.clientX);
    const onMove = (ev: MouseEvent) => onDragMove(ev.clientX);
    const onUp   = () => {
      onDragEnd();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    onDragStart(e.touches[0].clientX);
    const onMove = (ev: TouchEvent) => onDragMove(ev.touches[0].clientX);
    const onEnd  = () => {
      onDragEnd();
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend',  onEnd);
    };
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend',  onEnd);
  };

  return (
    <>
      <style>{css}</style>

      <div className="progress-root">
        <div className="progress-inner">

          {/* ── Step nodes ── */}
          <div className="steps-row">
            {STEPS.map((step, index) => {
              const Icon        = step.icon;
              const isCompleted = step.id < currentStep;
              const isActive    = step.id === currentStep;
              const isClickable = step.id <= currentStep;

              return (
                <div
                  key={step.id}
                  style={{ display: 'flex', alignItems: 'center', flex: index < STEPS.length - 1 ? 1 : 'unset' }}
                >
                  <motion.div
                    className={`step-item${!isClickable ? ' disabled' : ''}`}
                    onClick={() => isClickable && goToStep(step.id)}
                    whileTap={isClickable ? { scale: 0.85 } : {}}
                    style={{ opacity: isClickable ? 1 : 0.4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <div className={`step-icon ${isCompleted ? 'completed' : isActive ? 'active' : ''}`}>
                      <Icon
                        size={15}
                        style={{
                          color: isCompleted ? 'transparent' : isActive ? 'var(--gold)' : 'var(--mink)',
                          transition: 'color 0.3s',
                        }}
                      />
                    </div>
                    <span className={`step-label ${isCompleted ? 'completed' : isActive ? 'active' : ''}`}>
                      {step.name}
                    </span>
                  </motion.div>

                  {index < STEPS.length - 1 && (
                    <div className="step-connector">
                      <div className="step-connector-fill" style={{ width: isCompleted ? '100%' : '0%' }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Scrub track ── */}
          <div
            ref={wrapRef}
            className={`scrub-wrap${isDragging ? ' dragging' : ''}`}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div className="scrub-track" ref={trackRef}>

              {/* filled bar — spring animates when not dragging */}
              <motion.div
                ref={fillRef}
                style={{
                  position: 'absolute',
                  top: 0, left: 0, height: '100%',
                  background: 'var(--espresso)',
                  pointerEvents: 'none',
                }}
                animate={!isDragging ? { width: `${progressPct}%` } : undefined}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              />

              {/* tick dots */}
              {STEPS.map((step, i) => {
                const pct       = (i / (totalSteps - 1)) * 100;
                const isDone    = step.id < currentStep;
                const isCurrent = step.id === currentStep;
                return (
                  <div
                    key={step.id}
                    className={`scrub-tick${isDone ? ' done' : isCurrent ? ' current' : ''}`}
                    style={{ left: `${pct}%` }}
                  />
                );
              })}

              {/* thumb — spring snaps when not dragging */}
              <motion.div
                ref={thumbRef}
                className="scrub-thumb"
                animate={!isDragging ? { left: `calc(${progressPct}% - 7px)` } : undefined}
                transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              />

              {/* tooltip */}
              <div
                ref={tooltipRef}
                className="scrub-tooltip"
                style={{ left: `${progressPct}%` }}
              >
                {STEPS.find(s => s.id === currentStep)?.name}
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
};