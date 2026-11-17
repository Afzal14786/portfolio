"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

export function HeroArtwork() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.figure
      className="hero-artwork"
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 28,
              scale: 0.96,
              rotate: 1.2,
            }
      }
      animate={
        shouldReduceMotion
          ? undefined
          : {
              opacity: 1,
              scale: 1,
              y: [0, -8, 0],
              rotate: [0, 0.35, 0],
            }
      }
      transition={
        shouldReduceMotion
          ? undefined
          : {
              opacity: {
                duration: 0.9,
                ease: "easeOut",
              },
              scale: {
                duration: 0.9,
                ease: "easeOut",
              },
              y: {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.9,
              },
              rotate: {
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.9,
              },
            }
      }
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              scale: 1.015,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            }
      }
    >
      <div className="hero-artwork-frame">
        <div className="hero-artwork-topline">
          <span>VISUAL STUDY / 001</span>
          <span>EST. MMXXVI</span>
        </div>

        <div className="hero-artwork-placeholder">
          {/* Slow image movement adds depth without distracting from the content. */}
          <motion.div
            className="hero-artwork-image-motion"
            initial={shouldReduceMotion ? false : { scale: 1.08 }}
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    scale: [1, 1.035, 1],
                  }
            }
            transition={
              shouldReduceMotion
                ? undefined
                : {
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.8,
                  }
            }
          >
            <Image
              src="/images/profile/hero.jpeg"
              alt="Conceptual geometric artwork representing creativity, engineering, and systems thinking"
              fill
              priority
              sizes="(max-width: 820px) 90vw, 42vw"
              className="hero-artwork-image"
            />
          </motion.div>
        </div>

        <figcaption className="hero-artwork-caption">
          <span>CLASSICAL FORM</span>
          <span>ENGINEERING MINDSET</span>
        </figcaption>
      </div>
    </motion.figure>
  );
}
