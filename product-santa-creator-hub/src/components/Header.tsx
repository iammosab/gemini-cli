/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20">
            <Image
              src="/assets/logo.png"
              alt="Product Santa Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Product Santa
          </span>
        </Link>
        <Link
          href="#join"
          className="bg-[#CCFF00] hover:bg-[#b3e600] text-black font-bold py-2 px-4 rounded-full text-sm transition-transform hover:scale-105"
        >
          Join Now
        </Link>
      </div>
    </header>
  );
}
