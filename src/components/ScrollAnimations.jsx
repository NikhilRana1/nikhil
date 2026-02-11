'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

// ============================================
// ScrollReveal - Animates element when it enters viewport
// ============================================
export function ScrollReveal({
  children,
  direction = 'up', // 'up', 'down', 'left', 'right', 'none'
  delay = 0,
  duration = 0.6,
  distance = 60,
  once = true,
  threshold = 0.2,
  className = '',
  scale = 1,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance, x: 0 };
      case 'down': return { y: -distance, x: 0 };
      case 'left': return { y: 0, x: distance };
      case 'right': return { y: 0, x: -distance };
      case 'none': return { y: 0, x: 0 };
      default: return { y: distance, x: 0 };
    }
  };

  const initial = getInitialPosition();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...initial, scale: scale === 1 ? 1 : 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, x: 0, scale: 1 } : {}}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// StaggerChildren - Animate children with staggered delays
// ============================================
export function StaggerChildren({
  children,
  staggerDelay = 0.1,
  containerDelay = 0,
  direction = 'up',
  distance = 40,
  duration = 0.5,
  once = true,
  threshold = 0.1,
  className = '',
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
      default: return { y: distance };
    }
  };

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: containerDelay,
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, ...getInitialPosition() },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : <motion.div variants={itemVariants}>{children}</motion.div>
      }
    </motion.div>
  );
}

// ============================================
// TextReveal - Word by word text animation
// ============================================
export function TextReveal({
  text,
  delay = 0,
  staggerDelay = 0.05,
  once = true,
  threshold = 0.5,
  className = '',
  wordClassName = '',
  as: Component = 'p',
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const words = text.split(' ');

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDelay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: 90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
      style={{ perspective: '1000px' }}
    >
      <Component className="flex flex-wrap">
        {words.map((word, index) => (
          <motion.span
            key={index}
            variants={wordVariants}
            className={`inline-block mr-[0.25em] ${wordClassName}`}
            style={{ transformOrigin: 'center bottom' }}
          >
            {word}
          </motion.span>
        ))}
      </Component>
    </motion.div>
  );
}

// ============================================
// CharacterReveal - Character by character animation
// ============================================
export function CharacterReveal({
  text,
  delay = 0,
  staggerDelay = 0.02,
  once = true,
  threshold = 0.5,
  className = '',
  charClassName = '',
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const characters = text.split('');

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDelay,
      },
    },
  };

  const charVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <motion.span
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={charVariants}
          className={`inline-block ${charClassName}`}
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// ============================================
// ParallaxWrapper - Parallax scrolling effect
// ============================================
export function ParallaxWrapper({
  children,
  speed = 0.5, // negative for opposite direction
  className = '',
  offset = ['start end', 'end start'],
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * -100, speed * 100]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div ref={ref} style={{ y: smoothY }} className={className}>
      {children}
    </motion.div>
  );
}

// ============================================
// HorizontalParallax - Horizontal parallax effect
// ============================================
export function HorizontalParallax({
  children,
  speed = 0.5,
  className = '',
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], [speed * -100, speed * 100]);
  const smoothX = useSpring(x, { stiffness: 100, damping: 30 });

  return (
    <motion.div ref={ref} style={{ x: smoothX }} className={className}>
      {children}
    </motion.div>
  );
}

// ============================================
// ScaleOnScroll - Scale element based on scroll
// ============================================
export function ScaleOnScroll({
  children,
  scaleRange = [0.8, 1],
  className = '',
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], scaleRange);
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

  return (
    <motion.div ref={ref} style={{ scale: smoothScale }} className={className}>
      {children}
    </motion.div>
  );
}

// ============================================
// RotateOnScroll - Rotate element based on scroll
// ============================================
export function RotateOnScroll({
  children,
  rotateRange = [0, 360],
  className = '',
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const rotate = useTransform(scrollYProgress, [0, 1], rotateRange);
  const smoothRotate = useSpring(rotate, { stiffness: 100, damping: 30 });

  return (
    <motion.div ref={ref} style={{ rotate: smoothRotate }} className={className}>
      {children}
    </motion.div>
  );
}

// ============================================
// MagneticButton - Button that follows cursor
// ============================================
export function MagneticButton({
  children,
  className = '',
  strength = 0.3,
  as: Component = 'button',
  ...props
}) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;
    setPosition({ x: distanceX, y: distanceY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const MotionComponent = motion[Component] || motion.button;

  return (
    <MotionComponent
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}

// ============================================
// FadeInWhenVisible - Simple fade in on scroll
// ============================================
export function FadeInWhenVisible({
  children,
  delay = 0,
  duration = 0.6,
  once = true,
  threshold = 0.3,
  className = '',
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// SlideReveal - Reveal with sliding mask
// ============================================
export function SlideReveal({
  children,
  direction = 'left', // 'left', 'right', 'up', 'down'
  delay = 0,
  duration = 0.8,
  once = true,
  threshold = 0.3,
  className = '',
  bgColor = 'bg-indigo-500',
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const getSlideProps = () => {
    switch (direction) {
      case 'left':
        return { initial: { x: '-100%' }, animate: { x: '100%' } };
      case 'right':
        return { initial: { x: '100%' }, animate: { x: '-100%' } };
      case 'up':
        return { initial: { y: '100%' }, animate: { y: '-100%' } };
      case 'down':
        return { initial: { y: '-100%' }, animate: { y: '100%' } };
      default:
        return { initial: { x: '-100%' }, animate: { x: '100%' } };
    }
  };

  const slideProps = getSlideProps();

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.01, delay: delay + duration * 0.5 }}
      >
        {children}
      </motion.div>
      <motion.div
        initial={slideProps.initial}
        animate={isInView ? slideProps.animate : slideProps.initial}
        transition={{ duration, delay, ease: [0.76, 0, 0.24, 1] }}
        className={`absolute inset-0 ${bgColor}`}
      />
    </div>
  );
}

// ============================================
// CountUp - Animated counter with scroll trigger
// ============================================
export function CountUp({
  end,
  start = 0,
  duration = 2,
  delay = 0,
  suffix = '',
  prefix = '',
  decimals = 0,
  once = true,
  threshold = 0.5,
  className = '',
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (!isInView) return;

    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = start + (end - start) * easeOutQuart;
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    const timeout = setTimeout(() => {
      requestAnimationFrame(animate);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isInView, start, end, duration, delay]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}{decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}{suffix}
    </span>
  );
}

// ============================================
// ScrollProgress - Progress indicator based on scroll
// ============================================
export function ScrollProgress({ className = '' }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0%' }}
      className={`fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50 ${className}`}
    />
  );
}

// ============================================
// BlurReveal - Reveal with blur effect
// ============================================
export function BlurReveal({
  children,
  delay = 0,
  duration = 0.8,
  once = true,
  threshold = 0.3,
  className = '',
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: 'blur(20px)' }}
      animate={isInView ? { opacity: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// SectionWrapper - Combines common section animations
// ============================================
export function SectionWrapper({
  children,
  className = '',
  id,
  parallaxSpeed = 0,
}) {
  const content = parallaxSpeed !== 0 ? (
    <ParallaxWrapper speed={parallaxSpeed}>
      {children}
    </ParallaxWrapper>
  ) : children;

  return (
    <section id={id} className={className}>
      {content}
    </section>
  );
}
