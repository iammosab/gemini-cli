/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';
import Image from 'next/image';
import { Plus } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Retro Vibe Headphones',
    price: '$120',
    image: '/assets/product-1.png',
    tag: 'Hot Drop',
  },
  {
    id: 2,
    name: 'Cyber Kicks X1',
    price: '$180',
    image: '/assets/product-2.png',
    tag: 'Selling Fast',
  },
  {
    id: 3,
    name: 'Glow Serum',
    price: '$45',
    image: '/assets/product-3.png',
    tag: 'Viral',
  },
  {
    id: 4,
    name: 'Mushroom Lamp',
    price: '$85',
    image: '/assets/product-4.png',
    tag: 'Restocked',
  },
];

export default function WishlistFeed() {
  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Trending Now
          </h2>
          <span className="text-gray-400 text-sm">Refresh Feed ↻</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-gray-900 rounded-2xl overflow-hidden border border-white/5 hover:border-[#CCFF00]/50 transition-all"
            >
              <div className="aspect-square relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-mono text-[#CCFF00] border border-[#CCFF00]/20">
                  {product.tag}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg leading-tight">
                    {product.name}
                  </h3>
                  <span className="text-sm font-mono text-gray-400">
                    {product.price}
                  </span>
                </div>
                <button className="w-full mt-2 py-2 rounded-xl bg-white/5 hover:bg-[#CCFF00] hover:text-black transition-colors flex items-center justify-center gap-2 font-medium text-sm border border-white/10 group-hover:border-[#CCFF00]">
                  <Plus className="w-4 h-4" /> Add to List
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
