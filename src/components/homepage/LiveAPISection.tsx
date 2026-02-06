"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

// ═══════════════════════════════════════════════════════════════
//           🎨 LIVE API SECTION - Elegant Design with i18n
// ═══════════════════════════════════════════════════════════════

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function LiveAPISection() {
  const t = useTranslations('liveAPI');
  const [crypto, setCrypto] = useState<any>(null);
  const [fearGreed, setFearGreed] = useState<any>(null);
  const [quote, setQuote] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/insane?tool=bitcoin').then(r => r.json()),
      fetch('/api/insane?tool=fear-greed').then(r => r.json()),
      fetch('/api/powertools?tool=german-quote').then(r => r.json()),
    ]).then(([btc, fg, q]) => {
      setCrypto(btc);
      setFearGreed(fg);
      setQuote(q);
    });
  }, []);

  const categories = [
    { icon: '💰', label: t('categories.finance'), count: 5 },
    { icon: '🔧', label: t('categories.devTools'), count: 12 },
    { icon: '🎲', label: t('categories.fun'), count: 8 },
    { icon: '🌍', label: t('categories.geo'), count: 6 },
    { icon: '🎨', label: t('categories.media'), count: 8 },
    { icon: '🔐', label: t('categories.security'), count: 7 },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#FC682C]/10 via-[#FFB347]/5 to-transparent blur-[120px]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#FFB347]/5 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6"
            whileHover={{ scale: 1.02 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FC682C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FC682C]"></span>
            </span>
            <span className="text-sm font-medium text-white/70">{t('badge')}</span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            {t('title')}{" "}
            <span className="bg-gradient-to-r from-[#FC682C] via-[#FFB347] to-[#FC682C] bg-clip-text text-transparent">
              {t('titleHighlight')}
            </span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </motion.div>

        {/* Live Data Cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Bitcoin */}
          <motion.div 
            variants={fadeInUp}
            className="group relative rounded-[20px] p-6 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:bg-white/[0.05] hover:border-[#F7931A]/30 transition-all duration-500"
          >
            <div className="absolute inset-0 rounded-[20px] bg-gradient-to-br from-[#F7931A]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#F7931A]/20 flex items-center justify-center">
                  <span className="text-[#F7931A] font-bold">₿</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{t('btc')}</div>
                  <div className="text-xs text-white/40">BTC</div>
                </div>
              </div>
              {crypto?.bitcoin ? (
                <>
                  <div className="text-2xl font-semibold text-white mb-1">
                    €{crypto.bitcoin.eur?.toLocaleString('de-DE', { maximumFractionDigits: 0 })}
                  </div>
                  <div className={`text-sm font-medium ${crypto.bitcoin.eur_24h_change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {crypto.bitcoin.eur_24h_change >= 0 ? '↑' : '↓'} {Math.abs(crypto.bitcoin.eur_24h_change || 0).toFixed(2)}%
                  </div>
                </>
              ) : <LoadingPulse />}
            </div>
          </motion.div>

          {/* Ethereum */}
          <motion.div 
            variants={fadeInUp}
            className="group relative rounded-[20px] p-6 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:bg-white/[0.05] hover:border-[#627EEA]/30 transition-all duration-500"
          >
            <div className="absolute inset-0 rounded-[20px] bg-gradient-to-br from-[#627EEA]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#627EEA]/20 flex items-center justify-center">
                  <span className="text-[#627EEA] font-bold">Ξ</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{t('eth')}</div>
                  <div className="text-xs text-white/40">ETH</div>
                </div>
              </div>
              {crypto?.ethereum ? (
                <>
                  <div className="text-2xl font-semibold text-white mb-1">
                    €{crypto.ethereum.eur?.toLocaleString('de-DE', { maximumFractionDigits: 0 })}
                  </div>
                  <div className={`text-sm font-medium ${crypto.ethereum.eur_24h_change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {crypto.ethereum.eur_24h_change >= 0 ? '↑' : '↓'} {Math.abs(crypto.ethereum.eur_24h_change || 0).toFixed(2)}%
                  </div>
                </>
              ) : <LoadingPulse />}
            </div>
          </motion.div>

          {/* Fear & Greed */}
          <motion.div 
            variants={fadeInUp}
            className="group relative rounded-[20px] p-6 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:bg-white/[0.05] hover:border-[#FC682C]/30 transition-all duration-500"
          >
            <div className="absolute inset-0 rounded-[20px] bg-gradient-to-br from-[#FC682C]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#FC682C]/20 flex items-center justify-center">
                  <span className="text-lg">{fearGreed?.emoji || '📊'}</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{t('marketMood')}</div>
                  <div className="text-xs text-white/40">{t('fearGreed')}</div>
                </div>
              </div>
              {fearGreed ? (
                <>
                  <div className="text-2xl font-semibold text-white mb-1">{fearGreed.value}/100</div>
                  <div className="text-sm text-white/50">{fearGreed.label}</div>
                </>
              ) : <LoadingPulse />}
            </div>
          </motion.div>

          {/* Solana */}
          <motion.div 
            variants={fadeInUp}
            className="group relative rounded-[20px] p-6 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:bg-white/[0.05] hover:border-[#00FFA3]/30 transition-all duration-500"
          >
            <div className="absolute inset-0 rounded-[20px] bg-gradient-to-br from-[#00FFA3]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#00FFA3]/20 flex items-center justify-center">
                  <span className="text-[#00FFA3] font-bold">◎</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{t('sol')}</div>
                  <div className="text-xs text-white/40">SOL</div>
                </div>
              </div>
              {crypto?.solana ? (
                <>
                  <div className="text-2xl font-semibold text-white mb-1">
                    €{crypto.solana.eur?.toLocaleString('de-DE', { maximumFractionDigits: 0 })}
                  </div>
                  <div className={`text-sm font-medium ${crypto.solana.eur_24h_change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {crypto.solana.eur_24h_change >= 0 ? '↑' : '↓'} {Math.abs(crypto.solana.eur_24h_change || 0).toFixed(2)}%
                  </div>
                </>
              ) : <LoadingPulse />}
            </div>
          </motion.div>
        </motion.div>

        {/* Quote Section */}
        {quote && (
          <motion.div 
            className="max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative rounded-[24px] p-8 bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.08] backdrop-blur-xl text-center">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-[#FC682C] to-[#FFB347] flex items-center justify-center text-white shadow-[0_0_20px_rgba(252,104,44,0.4)]">
                „
              </div>
              <blockquote className="text-xl text-white/80 leading-relaxed mb-4 pt-2">
                {quote.quote}
              </blockquote>
              <cite className="text-sm text-[#FC682C] font-medium">— {quote.author}</cite>
            </div>
          </motion.div>
        )}

        {/* API Categories */}
        <motion.div 
          className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-12"
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ scale: 1.05, y: -5 }}
              className="rounded-2xl p-4 bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm text-center hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300 cursor-pointer"
            >
              <div className="text-2xl mb-2">{cat.icon}</div>
              <div className="text-xs text-white/50 mb-1">{cat.label}</div>
              <div className="text-sm font-semibold text-[#FC682C]">{cat.count}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/playground">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(252,104,44,0.4)' }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FC682C] to-[#FFB347] text-white font-semibold text-lg shadow-[0_0_30px_rgba(252,104,44,0.3)] transition-all duration-300"
            >
              <span>{t('openPlayground')}</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>
          </Link>
          <p className="text-sm text-white/30 mt-4">
            {t('freeNoLimits')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function LoadingPulse() {
  return (
    <div className="space-y-2">
      <div className="h-7 w-24 bg-white/5 rounded-lg animate-pulse" />
      <div className="h-4 w-16 bg-white/5 rounded-lg animate-pulse" />
    </div>
  );
}
