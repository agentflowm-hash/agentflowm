'use client';

import { motion } from 'framer-motion';

/**
 * Premium CSS Visuals for Services
 * Rich animations, depth, and visual impact
 */

// ═══════════════════════════════════════════════════════════════
//                    WEBSEITEN VISUAL
// Modern browser with live website preview
// ═══════════════════════════════════════════════════════════════

export function WebseitenVisual({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      {/* Ambient glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#FC682C]/30 rounded-full blur-[80px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#9D65C9]/20 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Main browser window */}
      <motion.div
        className="relative w-[90%] max-w-[400px]"
        initial={{ opacity: 0, y: 30, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Browser frame with glass effect */}
        <div className="relative bg-gradient-to-b from-white/[0.12] to-white/[0.04] rounded-2xl border border-white/[0.15] shadow-2xl shadow-black/50 overflow-hidden backdrop-blur-sm">
          
          {/* Browser header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.05] border-b border-white/[0.1]">
            <div className="flex gap-2">
              <motion.div 
                className="w-3 h-3 rounded-full bg-[#FF5F57]"
                whileHover={{ scale: 1.2 }}
              />
              <motion.div 
                className="w-3 h-3 rounded-full bg-[#FFBD2E]"
                whileHover={{ scale: 1.2 }}
              />
              <motion.div 
                className="w-3 h-3 rounded-full bg-[#28CA41]"
                whileHover={{ scale: 1.2 }}
              />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center gap-2 px-4 py-1.5 bg-white/[0.05] rounded-lg border border-white/[0.1] max-w-[200px] w-full">
                <svg className="w-3 h-3 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-[10px] text-white/40 truncate">ihrefirma.de</span>
              </div>
            </div>
          </div>
          
          {/* Website content */}
          <div className="p-5 space-y-4">
            {/* Hero area */}
            <motion.div 
              className="relative h-28 rounded-xl overflow-hidden"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FC682C]/40 via-[#FC682C]/20 to-[#9D65C9]/30" />
              <div className="absolute inset-0 flex flex-col justify-center px-4">
                <motion.div 
                  className="h-3 w-32 bg-white/40 rounded mb-2"
                  animate={{ width: ['60%', '70%', '60%'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="h-2 w-24 bg-white/20 rounded mb-3" />
                <motion.div 
                  className="h-6 w-20 bg-[#FC682C] rounded-md"
                  whileHover={{ scale: 1.05 }}
                  animate={{ boxShadow: ['0 0 20px rgba(252,104,44,0.3)', '0 0 30px rgba(252,104,44,0.5)', '0 0 20px rgba(252,104,44,0.3)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
            
            {/* Feature cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: '⚡', delay: 0 },
                { icon: '🎯', delay: 0.2 },
                { icon: '📱', delay: 0.4 },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="relative h-20 bg-white/[0.04] rounded-lg border border-white/[0.08] p-3 flex flex-col items-center justify-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + item.delay }}
                  whileHover={{ scale: 1.05, borderColor: 'rgba(252,104,44,0.3)' }}
                >
                  <motion.span 
                    className="text-xl mb-1"
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 2, repeat: Infinity, delay: item.delay }}
                  >
                    {item.icon}
                  </motion.span>
                  <div className="h-1.5 w-10 bg-white/10 rounded" />
                </motion.div>
              ))}
            </div>
            
            {/* Content lines */}
            <div className="space-y-2 pt-2">
              <motion.div 
                className="h-2 bg-white/[0.08] rounded"
                animate={{ width: ['85%', '90%', '85%'] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <div className="h-2 bg-white/[0.05] rounded w-3/4" />
              <div className="h-2 bg-white/[0.05] rounded w-1/2" />
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <motion.div
          className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-[#FC682C] to-[#e55a1f] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FC682C]/30"
          animate={{ 
            y: [-8, 8, -8],
            rotate: [-5, 5, -5],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-2xl">🚀</span>
        </motion.div>
        
        <motion.div
          className="absolute -bottom-4 -left-6 w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30"
          animate={{ 
            y: [6, -6, 6],
            rotate: [5, -5, 5],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        
        <motion.div
          className="absolute top-1/2 -right-10 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20"
          animate={{ 
            x: [0, 8, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <span className="text-lg">💡</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    PUBLISHING VISUAL
// Content workflow dashboard
// ═══════════════════════════════════════════════════════════════

export function PublishingVisual({ className = '' }: { className?: string }) {
  const stages = [
    { name: 'Entwurf', status: 'done', color: '#10B981' },
    { name: 'Review', status: 'done', color: '#10B981' },
    { name: 'Freigabe', status: 'active', color: '#FC682C' },
    { name: 'Live', status: 'pending', color: '#6B7280' },
  ];

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      {/* Ambient glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-56 h-56 bg-[#9D65C9]/25 rounded-full blur-[70px] animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-[#FC682C]/20 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>
      
      <motion.div
        className="relative w-[90%] max-w-[400px]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Main dashboard */}
        <div className="relative bg-gradient-to-b from-white/[0.12] to-white/[0.04] rounded-2xl border border-white/[0.15] shadow-2xl shadow-black/50 overflow-hidden backdrop-blur-sm p-5">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h4 className="text-white font-semibold text-sm">Content Pipeline</h4>
              <p className="text-white/40 text-xs">3 Beiträge diese Woche</p>
            </div>
            <motion.div 
              className="w-10 h-10 bg-[#FC682C]/20 rounded-xl flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <span className="text-lg">📅</span>
            </motion.div>
          </div>
          
          {/* Workflow stages */}
          <div className="relative mb-6">
            {/* Connection line */}
            <div className="absolute top-5 left-5 right-5 h-1 bg-white/[0.1] rounded-full">
              <motion.div 
                className="h-full bg-gradient-to-r from-green-500 via-[#FC682C] to-transparent rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '65%' }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </div>
            
            <div className="relative flex justify-between">
              {stages.map((stage, i) => (
                <motion.div 
                  key={stage.name}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 * i }}
                >
                  <motion.div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                      stage.status === 'done' 
                        ? 'bg-green-500/20 border-green-500 text-green-400' 
                        : stage.status === 'active'
                        ? 'bg-[#FC682C]/20 border-[#FC682C] text-[#FC682C]'
                        : 'bg-white/5 border-white/20 text-white/40'
                    }`}
                    animate={stage.status === 'active' ? {
                      boxShadow: ['0 0 0 0 rgba(252,104,44,0.4)', '0 0 0 10px rgba(252,104,44,0)', '0 0 0 0 rgba(252,104,44,0.4)']
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {stage.status === 'done' ? '✓' : i + 1}
                  </motion.div>
                  <span className={`text-[10px] mt-2 ${stage.status === 'pending' ? 'text-white/40' : 'text-white/70'}`}>
                    {stage.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Content cards */}
          <div className="space-y-3">
            {[
              { title: 'Blog: SEO Tipps 2026', status: 'Bereit', color: '#10B981', icon: '📝' },
              { title: 'LinkedIn Post', status: 'In Prüfung', color: '#FC682C', icon: '💼' },
              { title: 'Newsletter März', status: 'Entwurf', color: '#9D65C9', icon: '📧' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 p-3 bg-white/[0.04] rounded-xl border border-white/[0.08]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.15 }}
                whileHover={{ scale: 1.02, borderColor: 'rgba(252,104,44,0.3)' }}
              >
                <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center">
                  <span>{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-xs font-medium truncate">{item.title}</p>
                  <p className="text-white/40 text-[10px]">Letzte Änderung: heute</p>
                </div>
                <div 
                  className="px-2 py-1 rounded-md text-[10px] font-medium"
                  style={{ backgroundColor: `${item.color}20`, color: item.color }}
                >
                  {item.status}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Floating elements */}
        <motion.div
          className="absolute -top-5 -right-5 w-14 h-14 bg-gradient-to-br from-[#9D65C9] to-[#7C3AED] rounded-2xl flex items-center justify-center shadow-lg shadow-[#9D65C9]/30"
          animate={{ 
            y: [-6, 6, -6],
            rotate: [-3, 3, -3],
          }}
          transition={{ duration: 3.5, repeat: Infinity }}
        >
          <span className="text-xl">✨</span>
        </motion.div>
        
        <motion.div
          className="absolute -bottom-3 -left-5 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-xl"
          animate={{ 
            y: [4, -4, 4],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <span className="text-green-400 text-xs font-medium">+12 diese Woche</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    LEADS VISUAL
// Lead funnel & conversion dashboard
// ═══════════════════════════════════════════════════════════════

export function LeadsVisual({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      {/* Ambient glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-52 h-52 bg-[#FC682C]/25 rounded-full blur-[70px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-44 h-44 bg-[#FFB347]/20 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <motion.div
        className="relative w-[90%] max-w-[400px]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Main dashboard */}
        <div className="relative bg-gradient-to-b from-white/[0.12] to-white/[0.04] rounded-2xl border border-white/[0.15] shadow-2xl shadow-black/50 overflow-hidden backdrop-blur-sm p-5">
          
          {/* Header with live indicator */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h4 className="text-white font-semibold text-sm">Lead Dashboard</h4>
              <div className="flex items-center gap-2 mt-1">
                <motion.div 
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-green-400 text-xs">Live</span>
              </div>
            </div>
            <motion.div 
              className="text-right"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <p className="text-2xl font-bold text-white">247</p>
              <p className="text-green-400 text-xs">+18% ↑</p>
            </motion.div>
          </div>
          
          {/* Funnel visualization */}
          <div className="relative h-36 mb-5">
            {[
              { width: '100%', label: 'Besucher', value: '2.847', color: 'from-[#FC682C]/50 to-[#FC682C]/30' },
              { width: '65%', label: 'Interessenten', value: '486', color: 'from-[#FFB347]/50 to-[#FFB347]/30' },
              { width: '35%', label: 'Leads', value: '247', color: 'from-green-500/50 to-green-500/30' },
            ].map((stage, i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 -translate-x-1/2 h-10 rounded-lg flex items-center justify-between px-4"
                style={{ 
                  width: stage.width,
                  top: `${i * 44}px`,
                  background: `linear-gradient(90deg, ${stage.color.split(' ')[0].replace('from-', '').replace('/50', '')}40, ${stage.color.split(' ')[1].replace('to-', '').replace('/30', '')}20)`,
                  borderLeft: `3px solid ${stage.color.includes('FC682C') ? '#FC682C' : stage.color.includes('FFB347') ? '#FFB347' : '#10B981'}`,
                }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.2 }}
              >
                <span className="text-white/70 text-xs">{stage.label}</span>
                <span className="text-white font-semibold text-sm">{stage.value}</span>
              </motion.div>
            ))}
            
            {/* Animated data flow dots */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-[#FC682C] rounded-full left-1/2 -translate-x-1/2"
                initial={{ top: 0, opacity: 0 }}
                animate={{ 
                  top: ['0%', '100%'],
                  opacity: [0, 1, 1, 0],
                  scale: [1, 0.7, 0.5],
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: 'easeIn'
                }}
              />
            ))}
          </div>
          
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Conversion', value: '8.7%', trend: '+2.1%', trendUp: true },
              { label: 'Ø Zeit', value: '2.4 Min', trend: '-18s', trendUp: true },
              { label: 'Heute', value: '12', trend: '+5', trendUp: true },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="p-3 bg-white/[0.04] rounded-xl border border-white/[0.08] text-center"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                whileHover={{ scale: 1.05, borderColor: 'rgba(252,104,44,0.3)' }}
              >
                <p className="text-white font-bold text-lg">{stat.value}</p>
                <p className="text-white/40 text-[10px] mb-1">{stat.label}</p>
                <p className={`text-[10px] font-medium ${stat.trendUp ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.trend}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Floating notification */}
        <motion.div
          className="absolute -top-4 -right-4 px-3 py-2 bg-gradient-to-r from-[#FC682C] to-[#e55a1f] rounded-xl shadow-lg shadow-[#FC682C]/30"
          initial={{ opacity: 0, scale: 0, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          <motion.div
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-white text-xs font-medium">🔥 Neuer Lead!</span>
          </motion.div>
        </motion.div>
        
        <motion.div
          className="absolute -bottom-3 -left-4 w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30"
          animate={{ 
            y: [4, -4, 4],
            rotate: [-5, 5, -5],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <span className="text-xl">📈</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default { WebseitenVisual, PublishingVisual, LeadsVisual };
