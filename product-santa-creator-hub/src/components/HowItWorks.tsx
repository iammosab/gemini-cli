/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';
import { UserPlus, Share2, DollarSign } from 'lucide-react';

const steps = [
  {
    icon: <UserPlus className="w-8 h-8 text-[#CCFF00]" />,
    title: '1. Join the Club',
    description:
      'Create your profile in seconds. No lengthy forms. Instant access to the hottest drops.',
  },
  {
    icon: <Share2 className="w-8 h-8 text-cyan-400" />,
    title: '2. Share Your Faves',
    description:
      'Curate your wishlist and share it on your socials. Your followers shop, you vibe.',
  },
  {
    icon: <DollarSign className="w-8 h-8 text-pink-500" />,
    title: '3. Get Paid',
    description:
      'Earn commission on every sale. Real cash, deposited weekly. Track it all in your dashboard.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-zinc-900/50 border-y border-white/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            HOW IT WORKS
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Three simple steps to turning your influence into income.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-[#CCFF00] via-cyan-400 to-pink-500 opacity-20 z-0"></div>

          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-6 shadow-xl shadow-black/50">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-gray-400 leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
