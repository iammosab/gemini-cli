/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/hero-bg.png"
          alt="Abstract Background"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center flex flex-col items-center">
        <div className="inline-block mb-4 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-xs text-[#CCFF00] font-mono animate-fade-in-up">
          WAITLIST OPEN: LIMITED SPOTS
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter drop-shadow-lg max-w-4xl leading-tight">
          TURN YOUR{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CCFF00] to-cyan-400">
            FEED
          </span>{' '}
          INTO{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            CASH
          </span>
        </h1>
        <p className="text-gray-200 text-lg md:text-xl mb-8 max-w-xl mx-auto font-light">
          The creator platform that pays you to showcase the products you
          already love. No friction. Just vibes and earnings.
        </p>
        <Link
          href="#join"
          className="group relative inline-flex items-center gap-2 bg-[#CCFF00] text-black font-bold py-4 px-8 rounded-full text-lg transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(204,255,0,0.5)]"
        >
          Start Earning Today
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Link>

        <div className="mt-12 flex items-center gap-4 text-sm text-gray-400">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-black bg-gray-600 overflow-hidden relative"
              >
                <Image
                  src={`/assets/avatar-${i}.png`}
                  alt="Member"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <p>Joined by 500+ creators today</p>
        </div>
      </div>
    </section>
  );
}
