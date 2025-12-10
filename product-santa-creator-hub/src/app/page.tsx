/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import WishlistFeed from '@/components/WishlistFeed';
import HowItWorks from '@/components/HowItWorks';
import SuccessStories from '@/components/SuccessStories';
import SignUpForm from '@/components/SignUpForm';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <Header />
      <Hero />
      <WishlistFeed />
      <HowItWorks />
      <SuccessStories />
      <SignUpForm />
      <Footer />
    </main>
  );
}
