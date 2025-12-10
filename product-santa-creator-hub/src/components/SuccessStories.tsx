/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';
import Image from 'next/image';

const creators = [
  {
    name: 'Alex M.',
    handle: '@alexvibe',
    earnings: '$4.2k this month',
    quote: `Product Santa is a cheat code. I just posted my sneaker rotation and paid my rent.`,
    image: '/assets/avatar-1.png',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    name: 'Jordan T.',
    handle: '@j_tech',
    earnings: '$8.5k this month',
    quote: `The easiest onboarding ever. I was verified in 2 minutes and earning in 24 hours.`,
    image: '/assets/avatar-2.png',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    name: 'Casey R.',
    handle: '@casey_looks',
    earnings: '$3.1k this month',
    quote: `Finally a platform that gets it. No corporate BS, just cool products and good payouts.`,
    image: '/assets/avatar-3.png',
    color: 'from-pink-500 to-rose-500',
  },
];

export default function SuccessStories() {
  return (
    <section className="py-20 bg-black text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-black text-center mb-16">
          CREATOR{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CCFF00] to-green-400">
            WINS
          </span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {creators.map((creator, idx) => (
            <div
              key={idx}
              className="relative p-1 rounded-3xl bg-gradient-to-br from-white/10 to-transparent hover:from-[#CCFF00]/50 transition-colors duration-500 group"
            >
              <div className="bg-zinc-900/90 backdrop-blur-sm rounded-[22px] p-6 h-full flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`p-0.5 rounded-full bg-gradient-to-br ${creator.color}`}
                  >
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-zinc-900">
                      <Image
                        src={creator.image}
                        alt={creator.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold">{creator.name}</h4>
                    <p className="text-sm text-gray-500">{creator.handle}</p>
                  </div>
                  <div className="ml-auto bg-green-500/10 text-green-400 text-xs font-mono py-1 px-2 rounded border border-green-500/20">
                    {creator.earnings}
                  </div>
                </div>
                <p className="text-lg font-medium leading-snug mb-4">
                  {creator.quote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
