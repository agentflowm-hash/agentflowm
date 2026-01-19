'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui';
import { CTASection } from '@/components/sections';

// ═══════════════════════════════════════════════════════════════
//                    PROJECT DATA
// ═══════════════════════════════════════════════════════════════

const projects = [
  {
    id: 'autohaus-schmidt',
    title: 'Autohaus Schmidt',
    category: 'Automobile',
    subtitle: 'Premium Autohaus mit Service-Buchung',
    summary: 'Moderne Webpräsenz mit integriertem Service-Buchungssystem, Fahrzeug-Galerie und automatisiertem Lead-Management.',
    challenge: 'Veraltete Website ohne Online-Buchung. Kunden riefen an oder kamen vorbei - ineffizient für beide Seiten.',
    solution: 'Neue Website mit Online-Terminbuchung, Fahrzeug-Showcase mit Filterfunktion, und automatische Anfrage-Weiterleitung an den richtigen Berater.',
    results: [
      { value: '67%', label: 'Online-Buchungen' },
      { value: '+45%', label: 'Anfragen' },
      { value: '24/7', label: 'Erreichbar' },
    ],
    testimonial: '"Unsere Kunden lieben die Online-Buchung. Weniger Telefonzeit, mehr Beratungszeit."',
    scope: ['Website', 'Buchungssystem', 'Fahrzeug-Galerie', 'Lead-Routing', 'CRM-Anbindung'],
    timeline: '6 Wochen',
    package: 'Growth',
    color: '#FC682C',
  },
  {
    id: 'kanzlei-mueller',
    title: 'Kanzlei Müller & Partner',
    category: 'Recht & Beratung',
    subtitle: 'Anwaltskanzlei mit Mandanten-Portal',
    summary: 'Seriöse Kanzlei-Website mit geschütztem Mandantenbereich, Dokumenten-Upload und automatisierten Termin-Erinnerungen.',
    challenge: 'Dokumente wurden per E-Mail ausgetauscht, Termine telefonisch vereinbart. Keine zentrale Übersicht für Mandanten.',
    solution: 'Mandanten-Portal mit sicherer Dokumentenablage, Online-Terminbuchung mit Kalender-Sync, automatische Erinnerungen.',
    results: [
      { value: '80%', label: 'Weniger Anrufe' },
      { value: '100%', label: 'Dokumente digital' },
      { value: '0', label: 'Verpasste Termine' },
    ],
    testimonial: '"Das Portal spart uns täglich Stunden. Mandanten können alles selbst einsehen."',
    scope: ['Website', 'Mandanten-Portal', 'Dokumenten-System', 'Terminbuchung', 'Automatisierung'],
    timeline: '8 Wochen',
    package: 'Business',
    color: '#c9a227',
  },
  {
    id: 'praxis-gesund',
    title: 'Praxis Gesund',
    category: 'Gesundheit',
    subtitle: 'Physiotherapie-Praxis mit Online-Buchung',
    summary: 'Freundliche Praxis-Website mit Therapeuten-Vorstellung, Leistungsübersicht und nahtloser Online-Terminbuchung.',
    challenge: 'Rezeption war überlastet mit Terminanfragen. Patienten konnten Verfügbarkeiten nicht selbst prüfen.',
    solution: 'Online-Buchungskalender mit Therapeuten-Auswahl, automatische Bestätigungen und Erinnerungen, Wartelisten-Funktion.',
    results: [
      { value: '90%', label: 'Online gebucht' },
      { value: '-60%', label: 'Telefonzeit' },
      { value: '98%', label: 'Terminauslastung' },
    ],
    testimonial: '"Die Rezeption kann sich endlich auf die Patienten vor Ort konzentrieren."',
    scope: ['Website', 'Buchungskalender', 'Team-Seite', 'Erinnerungen', 'Warteliste'],
    timeline: '4 Wochen',
    package: 'Business',
    color: '#40916c',
  },
  {
    id: 'agentur-kreativ',
    title: 'Agentur Kreativ',
    category: 'Marketing',
    subtitle: 'Kreativagentur mit Portfolio & Workflow',
    summary: 'Dynamische Agentur-Website mit beeindruckendem Portfolio, Projekt-Anfrage-System und internem Publishing-Workflow.',
    challenge: 'Portfolio war veraltet, Projektanfragen unstrukturiert, Content-Veröffentlichung chaotisch.',
    solution: 'Portfolio mit Projekt-Showcase, strukturiertes Anfrage-Formular mit automatischem Briefing, Publishing-Pipeline für Social Media.',
    results: [
      { value: '3x', label: 'Mehr Anfragen' },
      { value: '+120%', label: 'Content Output' },
      { value: '0', label: 'Veröffentlichungsfehler' },
    ],
    testimonial: '"Endlich haben wir einen Prozess. Vom Briefing bis zur Veröffentlichung - alles fließt."',
    scope: ['Website', 'Portfolio', 'Anfrage-System', 'Publishing-Agent', 'Social Media'],
    timeline: '5 Wochen',
    package: 'Growth',
    color: '#ff6b6b',
  },
  {
    id: 'handwerk-meister',
    title: 'Meister Elektrotechnik',
    category: 'Handwerk',
    subtitle: 'Elektro-Fachbetrieb mit Notdienst',
    summary: 'Vertrauenserweckende Handwerker-Website mit Leistungsübersicht, Notdienst-Button und Anfrage-Management.',
    challenge: 'Keine professionelle Online-Präsenz. Anfragen gingen durcheinander, Notdienst-Anfragen wurden übersehen.',
    solution: 'Klare Website mit Vertrauenssignalen, prominenter Notdienst-CTA, priorisiertes Anfrage-Routing nach Dringlichkeit.',
    results: [
      { value: '+85%', label: 'Mehr Anfragen' },
      { value: '5 Min', label: 'Reaktionszeit' },
      { value: '100%', label: 'Notdienst bearbeitet' },
    ],
    testimonial: '"Endlich eine Website, die zeigt was wir können. Die Anfragen haben sich verdoppelt."',
    scope: ['Website', 'Notdienst-System', 'Anfrage-Routing', 'Bewertungen', 'Lokales SEO'],
    timeline: '3 Wochen',
    package: 'One-Page',
    color: '#f77f00',
  },
  {
    id: 'coach-erfolg',
    title: 'Erfolgscoach Berlin',
    category: 'Coaching',
    subtitle: 'Business Coach mit Buchungssystem',
    summary: 'Persönliche Coach-Website mit Methoden-Vorstellung, Paket-Auswahl und direkter Kalender-Buchung.',
    challenge: 'Zu viel Zeit mit Terminkoordination. Keine klare Darstellung der Coaching-Pakete und Preise.',
    solution: 'One-Page mit Storytelling, klare Paket-Übersicht mit Preisen, direkte Calendly-Integration für Erstgespräche.',
    results: [
      { value: '40%', label: 'Mehr Buchungen' },
      { value: '0', label: 'Terminkoordination' },
      { value: '4.9★', label: 'Kundenbewertung' },
    ],
    testimonial: '"Meine Interessenten buchen jetzt direkt. Ich kann mich voll auf meine Klienten konzentrieren."',
    scope: ['One-Page', 'Paket-Übersicht', 'Calendly', 'Testimonials', 'Blog-Anbindung'],
    timeline: '2 Wochen',
    package: 'One-Page',
    color: '#9d4edd',
  },
];

// ═══════════════════════════════════════════════════════════════
//                    BEFORE/AFTER SLIDER COMPONENT
// ═══════════════════════════════════════════════════════════════

interface BeforeAfterSliderProps {
  beforeContent: React.ReactNode;
  afterContent: React.ReactNode;
}

function BeforeAfterSlider({ beforeContent, afterContent }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-ew-resize select-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* After (bottom layer) */}
      <div className="absolute inset-0">
        {afterContent}
      </div>
      
      {/* Before (top layer with clip) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        {beforeContent}
      </div>
      
      {/* Slider handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize z-10"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        onMouseDown={handleMouseDown}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
      >
        {/* Handle circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="flex items-center gap-0.5">
            <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
            <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Labels */}
      <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-[10px] font-medium text-white/80 z-20">
        VORHER
      </div>
      <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-[10px] font-medium text-gray-700 z-20">
        NACHHER
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    BEFORE PAGES (Old/Ugly Designs)
// ═══════════════════════════════════════════════════════════════

function AutohausBefore() {
  return (
    <div className="w-full h-full bg-[#f0f0f0] p-2 font-sans">
      {/* Ugly old nav */}
      <div className="bg-[#003366] p-2 mb-2">
        <div className="text-[10px] text-yellow-300 font-bold">*** AUTOHAUS SCHMIDT ***</div>
        <div className="flex gap-2 mt-1">
          {['Home', 'Autos', 'Über uns', 'Kontakt'].map(item => (
            <span key={item} className="text-[8px] text-white underline">{item}</span>
          ))}
        </div>
      </div>
      {/* Ugly content */}
      <div className="bg-white border-2 border-gray-400 p-2 mb-2">
        <div className="text-[9px] font-bold text-red-600 mb-1">!! SONDERANGEBOTE !!</div>
        <div className="h-12 bg-gray-300 flex items-center justify-center text-[8px] text-gray-500">
          [Bild lädt nicht]
        </div>
      </div>
      <div className="bg-yellow-200 border border-black p-1 mb-2">
        <div className="text-[8px] text-red-600 font-bold blink">📞 Rufen Sie an: 030-123456</div>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {[1,2,3].map(i => (
          <div key={i} className="bg-gray-200 border border-gray-400 p-1">
            <div className="h-6 bg-gray-300 mb-1" />
            <div className="text-[6px] text-gray-600">Auto {i}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-[6px] text-gray-500 text-center">
        © 2010 - Besucher: 00001234
      </div>
    </div>
  );
}

function AutohausAfter() {
  return (
    <div className="w-full h-full bg-[#1a1a2e] rounded-sm overflow-hidden">
      <div className="h-6 bg-black/30 flex items-center px-2 gap-3">
        <div className="text-[8px] font-bold text-white tracking-wide">AUTOHAUS</div>
        <div className="flex gap-2 ml-auto">
          {['Fahrzeuge', 'Service', 'Kontakt'].map(item => (
            <span key={item} className="text-[7px] text-white/60">{item}</span>
          ))}
        </div>
        <div className="px-1.5 py-0.5 bg-[#e63946] rounded text-[6px] text-white">Termin</div>
      </div>
      <div className="p-2">
        <div className="h-16 bg-gradient-to-r from-[#e63946]/30 to-transparent rounded mb-2 flex items-center px-2">
          <div>
            <div className="h-1.5 w-16 bg-white/80 rounded mb-1" />
            <div className="h-1 w-10 bg-white/40 rounded mb-1.5" />
            <div className="h-3 w-12 bg-[#e63946] rounded text-[5px] text-white flex items-center justify-center">Jetzt buchen</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-10 bg-white/5 rounded border border-white/10">
              <div className="h-6 bg-gradient-to-br from-white/10 to-transparent rounded-t" />
              <div className="px-1 py-0.5">
                <div className="h-0.5 w-6 bg-white/30 rounded mb-0.5" />
                <div className="h-0.5 w-4 bg-[#e63946]/60 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KanzleiBefore() {
  return (
    <div className="w-full h-full bg-white p-2 font-serif">
      <div className="bg-[#800000] p-1.5 mb-2">
        <div className="text-[9px] text-yellow-200">Rechtsanwälte Müller & Partner</div>
      </div>
      <div className="border-2 border-[#800000] p-2 mb-2">
        <div className="text-[8px] font-bold mb-1">Herzlich Willkommen!</div>
        <div className="text-[6px] text-gray-600 leading-tight">
          Unsere Kanzlei berät Sie kompetent in allen rechtlichen Angelegenheiten...
        </div>
      </div>
      <table className="w-full border border-gray-400 text-[6px]">
        <tbody>
          <tr className="bg-gray-200">
            <td className="border border-gray-400 p-0.5">Arbeitsrecht</td>
            <td className="border border-gray-400 p-0.5">→</td>
          </tr>
          <tr>
            <td className="border border-gray-400 p-0.5">Familienrecht</td>
            <td className="border border-gray-400 p-0.5">→</td>
          </tr>
        </tbody>
      </table>
      <div className="mt-2 bg-gray-100 p-1 text-[6px]">
        <div className="font-bold">Kontakt:</div>
        <div>Tel: 030-9876543</div>
        <div>Fax: 030-9876544</div>
      </div>
    </div>
  );
}

function KanzleiAfter() {
  return (
    <div className="w-full h-full bg-[#0a1628] rounded-sm overflow-hidden">
      <div className="h-6 bg-[#0d1d35] flex items-center px-2">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#c9a227]" />
          <span className="text-[8px] font-serif text-white">Müller & Partner</span>
        </div>
      </div>
      <div className="p-2">
        <div className="text-center mb-2">
          <div className="h-1.5 w-20 bg-white/70 rounded mx-auto mb-1" />
          <div className="h-1 w-14 bg-white/30 rounded mx-auto" />
        </div>
        <div className="grid grid-cols-2 gap-1 mb-2">
          {['Arbeitsrecht', 'Familienrecht', 'Erbrecht', 'Vertragsrecht'].map((item, i) => (
            <div key={item} className="p-1.5 bg-white/5 rounded border border-[#c9a227]/20">
              <div className="h-1 w-full bg-[#c9a227]/40 rounded mb-0.5" />
              <div className="h-0.5 w-2/3 bg-white/20 rounded" />
            </div>
          ))}
        </div>
        <div className="h-5 bg-[#c9a227] rounded flex items-center justify-center">
          <span className="text-[7px] text-black font-medium">Mandanten-Portal →</span>
        </div>
      </div>
    </div>
  );
}

function PraxisBefore() {
  return (
    <div className="w-full h-full bg-[#e8f5e9] p-2">
      <div className="bg-[#2e7d32] p-1 mb-2">
        <div className="text-[9px] text-white">🏥 Praxis für Physiotherapie</div>
      </div>
      <div className="bg-white border border-gray-300 p-1.5 mb-2">
        <div className="text-[7px] font-bold text-green-800 mb-1">Öffnungszeiten:</div>
        <div className="text-[6px] text-gray-600">Mo-Fr: 8-18 Uhr</div>
        <div className="text-[6px] text-gray-600">Sa: nach Vereinbarung</div>
      </div>
      <div className="text-[7px] font-bold mb-1">Unsere Leistungen:</div>
      <ul className="text-[6px] text-gray-600 pl-2">
        <li>• Krankengymnastik</li>
        <li>• Massage</li>
        <li>• Lymphdrainage</li>
      </ul>
      <div className="mt-2 bg-yellow-100 border border-yellow-400 p-1">
        <div className="text-[6px] text-center">
          📞 Terminvereinbarung: 030-111222
        </div>
      </div>
    </div>
  );
}

function PraxisAfter() {
  return (
    <div className="w-full h-full bg-[#f0f7f4] rounded-sm overflow-hidden">
      <div className="h-6 bg-white flex items-center px-2 border-b border-[#40916c]/20">
        <span className="text-[8px] font-medium text-[#40916c]">Praxis Gesund</span>
        <div className="ml-auto px-1.5 py-0.5 bg-[#40916c] rounded text-[6px] text-white">Termin</div>
      </div>
      <div className="p-2">
        <div className="h-12 bg-gradient-to-r from-[#40916c]/20 to-[#40916c]/5 rounded mb-2 p-1.5">
          <div className="h-1.5 w-16 bg-[#2d6a4f] rounded mb-1" />
          <div className="h-1 w-10 bg-[#40916c]/50 rounded mb-1" />
          <div className="h-2.5 w-10 bg-[#40916c] rounded text-[5px] text-white flex items-center justify-center">
            Buchen
          </div>
        </div>
        <div className="flex gap-1.5 mb-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex-1 text-center">
              <div className="w-5 h-5 rounded-full bg-[#40916c]/20 mx-auto mb-0.5" />
              <div className="h-0.5 w-6 bg-[#2d6a4f]/40 rounded mx-auto" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1">
          {['Online buchen', 'Warteliste'].map(item => (
            <div key={item} className="p-1 bg-white rounded border border-[#40916c]/20 text-center">
              <div className="text-[5px] text-[#40916c]">{item}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AgenturBefore() {
  return (
    <div className="w-full h-full bg-gray-900 p-2">
      <div className="text-[10px] text-pink-500 font-bold mb-2">~*~ KREATIV AGENTUR ~*~</div>
      <div className="bg-black border border-pink-500 p-1.5 mb-2">
        <div className="text-[7px] text-green-400 font-mono mb-1">&gt; Wir machen Websites_</div>
        <div className="text-[6px] text-gray-400">Flash Animation laden...</div>
      </div>
      <div className="grid grid-cols-2 gap-1 mb-2">
        {['Projekt 1', 'Projekt 2', 'Projekt 3', 'Projekt 4'].map(p => (
          <div key={p} className="bg-gray-800 p-1 text-center">
            <div className="h-5 bg-gray-700 mb-0.5" />
            <div className="text-[5px] text-gray-400">{p}</div>
          </div>
        ))}
      </div>
      <div className="text-[6px] text-center text-gray-500">
        Beste Ansicht: 800x600 | IE6
      </div>
    </div>
  );
}

function AgenturAfter() {
  return (
    <div className="w-full h-full bg-[#0d0d0d] rounded-sm overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-[#ff6b6b] via-[#feca57] to-[#ff6b6b]" />
      <div className="p-2">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[8px] font-bold text-white tracking-wider">KREATIV</div>
          <div className="flex gap-0.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-0.5 h-0.5 rounded-full bg-white/40" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1 mb-2">
          {['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3'].map((color, i) => (
            <div key={i} className="h-9 rounded overflow-hidden" style={{ backgroundColor: `${color}20` }}>
              <div className="h-6" style={{ background: `linear-gradient(135deg, ${color}40, transparent)` }} />
              <div className="px-1 py-0.5">
                <div className="h-0.5 w-5 rounded" style={{ backgroundColor: color }} />
              </div>
            </div>
          ))}
        </div>
        <div className="h-4 border border-[#ff6b6b] rounded flex items-center justify-center">
          <span className="text-[6px] text-white">Projekt starten →</span>
        </div>
      </div>
    </div>
  );
}

function HandwerkBefore() {
  return (
    <div className="w-full h-full bg-[#ffffcc] p-2">
      <div className="bg-[#ff6600] p-1 mb-2">
        <div className="text-[9px] text-white font-bold">⚡ ELEKTRO MEISTER ⚡</div>
      </div>
      <div className="bg-white border-2 border-red-500 p-1 mb-2 text-center">
        <div className="text-[8px] text-red-600 font-bold">24H NOTDIENST!!!</div>
        <div className="text-[7px]">030-NOTFALL</div>
      </div>
      <div className="text-[7px] mb-1">Unsere Leistungen:</div>
      <div className="bg-gray-200 p-1 text-[6px]">
        ✓ Elektroinstallation<br/>
        ✓ Reparaturen<br/>
        ✓ Wartung
      </div>
      <div className="mt-2 flex gap-1">
        <div className="bg-gray-300 px-1 text-[5px]">Meisterbetrieb</div>
        <div className="bg-gray-300 px-1 text-[5px]">Seit 1998</div>
      </div>
    </div>
  );
}

function HandwerkAfter() {
  return (
    <div className="w-full h-full bg-[#1a1a1a] rounded-sm overflow-hidden">
      <div className="h-5 bg-[#f77f00] flex items-center justify-center">
        <span className="text-[7px] font-bold text-black">24/7 NOTDIENST</span>
      </div>
      <div className="p-2">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-5 h-5 rounded-full bg-[#f77f00]/20 flex items-center justify-center">
            <span className="text-[8px]">⚡</span>
          </div>
          <div>
            <div className="h-1.5 w-12 bg-white/70 rounded mb-0.5" />
            <div className="h-1 w-8 bg-[#f77f00]/60 rounded" />
          </div>
        </div>
        <div className="space-y-1 mb-2">
          {['Installation', 'Reparatur', 'Wartung'].map((item, i) => (
            <div key={item} className="flex items-center gap-1 p-1 bg-white/5 rounded">
              <div className="w-2.5 h-2.5 rounded bg-[#f77f00]/20 flex items-center justify-center">
                <span className="text-[5px]">✓</span>
              </div>
              <div className="h-1 flex-1 bg-white/30 rounded" />
            </div>
          ))}
        </div>
        <div className="flex gap-0.5">
          {['★★★★★', 'Meister'].map((badge, i) => (
            <div key={i} className="px-1 py-0.5 bg-white/10 rounded text-[5px] text-white/60">{badge}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CoachBefore() {
  return (
    <div className="w-full h-full bg-gradient-to-b from-purple-200 to-purple-100 p-2">
      <div className="text-center mb-2">
        <div className="text-[10px] text-purple-800 font-bold">✨ Life Coach Maria ✨</div>
        <div className="text-[6px] text-purple-600">Finde dein wahres Ich</div>
      </div>
      <div className="bg-white rounded-lg p-1.5 mb-2 border border-purple-300">
        <div className="w-8 h-8 rounded-full bg-purple-300 mx-auto mb-1" />
        <div className="text-[6px] text-center text-gray-600">
          "Ich begleite Sie auf Ihrem Weg..."
        </div>
      </div>
      <div className="space-y-1 mb-2">
        {['Einzelcoaching', 'Gruppenarbeit', 'Workshops'].map(item => (
          <div key={item} className="bg-purple-50 border border-purple-200 p-0.5 text-[6px] text-center">
            {item}
          </div>
        ))}
      </div>
      <div className="text-[6px] text-center text-purple-600">
        📧 maria@coach.de
      </div>
    </div>
  );
}

function CoachAfter() {
  return (
    <div className="w-full h-full bg-[#1a1625] rounded-sm overflow-hidden p-2">
      <div className="text-center mb-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c77dff] to-[#7b2cbf] mx-auto mb-1" />
        <div className="h-1.5 w-14 bg-white/70 rounded mx-auto mb-0.5" />
        <div className="h-1 w-10 bg-[#c77dff]/50 rounded mx-auto" />
      </div>
      <div className="space-y-1 mb-2">
        {['Starter', 'Premium', 'VIP'].map((pkg, i) => (
          <div key={pkg} className={`p-1 rounded border ${i === 1 ? 'border-[#c77dff] bg-[#c77dff]/10' : 'border-white/10 bg-white/5'}`}>
            <div className="flex justify-between items-center">
              <div className="h-1 w-8 bg-white/40 rounded" />
              <div className="h-1 w-5 bg-[#c77dff]/60 rounded" />
            </div>
          </div>
        ))}
      </div>
      <div className="h-5 bg-gradient-to-r from-[#c77dff] to-[#7b2cbf] rounded flex items-center justify-center">
        <span className="text-[7px] text-white font-medium">Erstgespräch buchen</span>
      </div>
    </div>
  );
}

// Map project IDs to their before/after components
const beforeAfterComponents: { [key: string]: { before: () => JSX.Element; after: () => JSX.Element } } = {
  'autohaus-schmidt': { before: AutohausBefore, after: AutohausAfter },
  'kanzlei-mueller': { before: KanzleiBefore, after: KanzleiAfter },
  'praxis-gesund': { before: PraxisBefore, after: PraxisAfter },
  'agentur-kreativ': { before: AgenturBefore, after: AgenturAfter },
  'handwerk-meister': { before: HandwerkBefore, after: HandwerkAfter },
  'coach-erfolg': { before: CoachBefore, after: CoachAfter },
};

// ═══════════════════════════════════════════════════════════════
//                    PROJECT CARD
// ═══════════════════════════════════════════════════════════════

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'solution' | 'results'>('overview');
  const isEven = index % 2 === 0;
  const { before: BeforeComponent, after: AfterComponent } = beforeAfterComponents[project.id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: 0.1 }}
    >
      <div className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center`}>
        {/* Preview Side with Before/After Slider */}
        <div className={`${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
          <div className="relative">
            {/* Browser frame */}
            <div className="bg-gradient-to-b from-white/[0.1] to-white/[0.02] rounded-2xl border border-white/[0.1] overflow-hidden shadow-2xl shadow-black/50">
              {/* Browser header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.05] border-b border-white/[0.1]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.05] rounded-md max-w-[200px] mx-auto">
                    <svg className="w-3 h-3 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-[10px] text-white/40 truncate">{project.id.replace('-', '')}.de</span>
                  </div>
                </div>
              </div>
              
              {/* Before/After Slider Content */}
              <div className="aspect-[4/3]">
                <BeforeAfterSlider
                  beforeContent={<BeforeComponent />}
                  afterContent={<AfterComponent />}
                />
              </div>
            </div>
            
            {/* Package badge */}
            <motion.div
              className="absolute -top-3 -right-3 px-4 py-2 rounded-xl shadow-lg"
              style={{ backgroundColor: project.color }}
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-white text-sm font-medium">{project.package}</span>
            </motion.div>
            
            {/* Timeline badge */}
            <motion.div
              className="absolute -bottom-3 -left-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
              animate={{ y: [3, -3, 3] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <span className="text-white text-sm">{project.timeline}</span>
            </motion.div>
          </div>
        </div>

        {/* Content Side */}
        <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span 
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: `${project.color}20`, color: project.color }}
              >
                {project.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                Abgeschlossen
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{project.title}</h3>
            <p className="text-lg" style={{ color: project.color }}>{project.subtitle}</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'overview', label: 'Überblick' },
              { id: 'solution', label: 'Lösung' },
              { id: 'results', label: 'Ergebnisse' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'text-white' 
                    : 'text-white/50 hover:text-white/70 bg-white/5'
                }`}
                style={{
                  backgroundColor: activeTab === tab.id ? project.color : undefined,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[200px]">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <p className="text-white/70 leading-relaxed">{project.summary}</p>
                  <div className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.08]">
                    <div className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">
                      Herausforderung
                    </div>
                    <p className="text-sm text-white/60">{project.challenge}</p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'solution' && (
                <motion.div
                  key="solution"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <p className="text-white/70 leading-relaxed">{project.solution}</p>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                      Umfang
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.scope.map((item) => (
                        <span
                          key={item}
                          className="px-3 py-1.5 rounded-lg text-sm"
                          style={{ 
                            backgroundColor: `${project.color}15`,
                            color: project.color,
                            border: `1px solid ${project.color}30`,
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'results' && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-3 gap-3">
                    {project.results.map((result, i) => (
                      <motion.div 
                        key={i}
                        className="p-4 rounded-xl text-center"
                        style={{ 
                          backgroundColor: `${project.color}10`,
                          border: `1px solid ${project.color}25`,
                        }}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="text-2xl font-bold mb-1" style={{ color: project.color }}>
                          {result.value}
                        </div>
                        <div className="text-xs text-white/50">{result.label}</div>
                      </motion.div>
                    ))}
                  </div>
                  <blockquote 
                    className="p-4 rounded-xl italic text-sm text-white/70"
                    style={{ 
                      backgroundColor: `${project.color}08`,
                      borderLeft: `3px solid ${project.color}`,
                    }}
                  >
                    {project.testimonial}
                  </blockquote>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    PAGE HERO
// ═══════════════════════════════════════════════════════════════

function PageHero() {
  return (
    <section className="relative pt-32 pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-20 right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#FC682C]/20 to-transparent blur-[120px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 left-[5%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#9D65C9]/15 to-transparent blur-[100px]"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FC682C]/10 border border-[#FC682C]/20 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.span 
              className="w-2 h-2 rounded-full bg-green-500"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-sm font-medium text-[#FC682C]">Vorher → Nachher Vergleich</span>
          </motion.div>
          
          {/* Headline */}
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Echte{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#FC682C] via-[#FFB347] to-[#9D65C9]">
                Transformationen
              </span>
              <motion.span 
                className="absolute -inset-2 bg-gradient-to-r from-[#FC682C]/20 to-[#9D65C9]/20 blur-xl rounded-lg"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </span>
          </motion.h1>
          
          {/* Description */}
          <motion.p 
            className="text-xl text-white/60 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Ziehen Sie den Slider und sehen Sie den Unterschied. Von veralteten Websites zu modernen, conversion-optimierten Lösungen.
          </motion.p>

          {/* Stats */}
          <motion.div 
            className="flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {[
              { value: '6+', label: 'Projekte', icon: '🚀' },
              { value: '100%', label: 'Erfolgreich', icon: '✓' },
              { value: 'Ø 4 Wo.', label: 'Projektzeit', icon: '⚡' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1]"
                whileHover={{ scale: 1.05, borderColor: 'rgba(252,104,44,0.3)' }}
              >
                <span className="text-xl">{stat.icon}</span>
                <div className="text-left">
                  <div className="text-lg font-bold text-[#FC682C]">{stat.value}</div>
                  <div className="text-xs text-white/50">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    FILTER SECTION
// ═══════════════════════════════════════════════════════════════

function FilterSection({ activeFilter, setActiveFilter }: { activeFilter: string; setActiveFilter: (f: string) => void }) {
  const filters = [
    { id: 'all', label: 'Alle Projekte' },
    { id: 'One-Page', label: 'One-Page' },
    { id: 'Business', label: 'Business' },
    { id: 'Growth', label: 'Growth' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-12">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setActiveFilter(filter.id)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            activeFilter === filter.id
              ? 'bg-[#FC682C] text-white'
              : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.1] hover:text-white'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    INDUSTRIES SECTION
// ═══════════════════════════════════════════════════════════════

function IndustriesSection() {
  const industries = [
    { icon: '🚗', name: 'Automobile' },
    { icon: '⚖️', name: 'Recht & Beratung' },
    { icon: '🏥', name: 'Gesundheit' },
    { icon: '🎨', name: 'Agenturen' },
    { icon: '🔧', name: 'Handwerk' },
    { icon: '🎓', name: 'Coaching' },
    { icon: '🏢', name: 'B2B Services' },
    { icon: '🏪', name: 'Lokale Geschäfte' },
  ];

  return (
    <section className="py-20 bg-white/[0.02]">
      <div className="container">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">Branchen, die wir bedienen</h2>
          <p className="text-white/50">Erfahrung aus verschiedenen Bereichen für Ihre Anforderungen</p>
        </motion.div>
        
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {industries.map((industry, i) => (
            <motion.div 
              key={i}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] hover:border-[#FC682C]/30 transition-all duration-300"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-xl">{industry.icon}</span>
              <span className="font-medium text-white/80">{industry.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//                    MAIN PAGE
// ═══════════════════════════════════════════════════════════════

export default function ProjektePage() {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.package === activeFilter);

  return (
    <div className="bg-[#030308]">
      <PageHero />
      
      {/* Projects Section */}
      <section className="py-12">
        <div className="container">
          <FilterSection activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
          
          <div className="space-y-24 lg:space-y-32 max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              {filteredProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </AnimatePresence>
          </div>

          {/* Note */}
          <motion.div 
            className="mt-20 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm text-white/50">
              <strong className="text-white/70">Hinweis:</strong> Die gezeigten Projekte sind repräsentative Beispiele. 
              Gerne besprechen wir Ihre spezifischen Anforderungen in einem persönlichen Gespräch.
            </p>
          </motion.div>
        </div>
      </section>

      <IndustriesSection />

      <CTASection
        headline="Ihr Projekt könnte das nächste sein"
        subheadline="Lassen Sie uns besprechen, wie wir auch Ihnen helfen können."
      />
    </div>
  );
}
