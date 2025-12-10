/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black py-12 border-t border-white/10">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-white font-bold text-2xl mb-6 tracking-tight">
          Product Santa
        </h3>
        <div className="flex justify-center gap-8 mb-8 text-sm text-gray-400">
          <Link href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Creator Guide
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Support
          </Link>
        </div>
        <p className="text-gray-600 text-xs">
          © 2025 Product Santa. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
