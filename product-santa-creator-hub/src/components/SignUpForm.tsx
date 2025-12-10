/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';
export default function SignUpForm() {
  return (
    <section id="join" className="py-24 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-black z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#CCFF00] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10 max-w-4xl">
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black text-white mb-6">
                READY TO <br />
                <span className="text-[#CCFF00]">LEVEL UP?</span>
              </h2>
              <ul className="space-y-4 text-gray-300 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#CCFF00]/20 flex items-center justify-center text-[#CCFF00] text-sm">
                    ✓
                  </div>
                  Instant Verification
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#CCFF00]/20 flex items-center justify-center text-[#CCFF00] text-sm">
                    ✓
                  </div>
                  Access to Exclusive Drops
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#CCFF00]/20 flex items-center justify-center text-[#CCFF00] text-sm">
                    ✓
                  </div>
                  Weekly Payouts
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#CCFF00]/20 flex items-center justify-center text-[#CCFF00] text-sm">
                    ✓
                  </div>
                  Creator Support 24/7
                </li>
              </ul>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Santa Claus"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#CCFF00] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="santa@northpole.com"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#CCFF00] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1 uppercase tracking-wider">
                  Social Handle
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    @
                  </span>
                  <input
                    type="text"
                    placeholder="username"
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white focus:outline-none focus:border-[#CCFF00] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#CCFF00] hover:bg-[#b3e600] text-black font-bold py-4 rounded-xl text-lg mt-4 transition-transform active:scale-95 shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)]"
              >
                Join Waitlist
              </button>
              <p className="text-center text-xs text-gray-500 mt-4">
                By joining, you agree to our Terms & Creator Policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
