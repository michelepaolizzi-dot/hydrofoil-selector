// =============================================================
// SPORT AL CENTRO — PRODUCT SELECTOR (APP STYLE EDITION)
// iOS Font — Full Mobile Optimized — Large Touch Buttons
// =============================================================

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Upload, Globe2 } from "lucide-react";

// Use iOS font first
const appFont = "ui-rounded, system-ui, -apple-system, BlinkMacSystemFont, Arial";

// =============================================================
// I18N (INVARIATO O QUASI)
// =============================================================
const I18N = {
  it: {
    app_title: "Sport al Centro",
    app_subtitle: "Consigli sui migliori prodotti provati da Michele",
    choose_category: "Apri",
    back_to_categories: "Indietro",
    results_title: "Prodotti consigliati",
    results_sub: "Basati sulle tue risposte",
    next: "Continua",
    restart_quiz: "Ricomincia",
    back: "Indietro",
    final_title: "Un'ultima cosa",
    final_text: "Iscriviti al canale YouTube per video e consigli!",
    yt_button: "Apri YouTube"
  }
};

// =============================================================
// CATEGORIE (SEMPLIFICATE — LOGICA INVARIATA)
// =============================================================

const MODULES = [
  {
    id: "sup",
    label: "SUP Gonfiabili",
    image: "https://media.adeo.com/mkp/52efae964714afffb04eac8a5f8b7d21/media.jpeg"
  },
  {
    id: "hydrofoil",
    label: "Hydrofoil",
    image: "https://images.unsplash.com/photo-1624213394899-232bd2e2fbf8?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "wing",
    label: "Tavole Wingfoil",
    image: "https://images.unsplash.com/photo-1595187087770-8d7e046c9f7f?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "pumps",
    label: "Pompe Elettriche",
    image: "https://images.unsplash.com/photo-1602751587717-5b101e538c87?auto=format&fit=crop&w=900&q=80"
  }
];

// =============================================================
// QUIZ — versione semplificata (UI APP STYLE)
// =============================================================
function Quiz({ module, t, onBack }) {
  const [step, setStep] = useState(0);

  const questions = ["Quanto pesi?", "Livello?", "Uso principale?"];
  const options = [
    ["<60kg", "60–75kg", "75–90kg", ">90kg"],
    ["Principiante", "Intermedio", "Avanzato"],
    ["Passeggiate", "Touring", "Race"]
  ];

  const isLast = step >= questions.length;

  return (
    <div style={{ fontFamily: appFont }}>
      {/* Back + Titolo */}
      <header className="w-full sticky top-0 bg-white py-4 px-4 shadow-sm z-50">
        <button
          onClick={onBack}
          className="text-2xl font-semibold text-sky-600"
        >
          ←
        </button>
      </header>

      <main className="px-4 py-6">
        {!isLast ? (
          <>
            <h2 className="text-3xl font-bold mb-6">{questions[step]}</h2>
            <div className="flex flex-col gap-4">
              {options[step].map(opt => (
                <button
                  key={opt}
                  onClick={() => setStep(step + 1)}
                  className="w-full py-5 bg-sky-600 text-white text-2xl font-semibold rounded-full transition-transform active:scale-95"
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-3">{t.results_title}</h2>
            <p className="text-xl text-slate-600 mb-6">{t.results_sub}</p>

            <div className="space-y-4">
              {[1, 2, 3].map(id => (
                <div
                  key={id}
                  className="p-4 bg-white rounded-2xl shadow-md text-xl"
                >
                  Prodotto consigliato #{id}
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep(0)}
              className="w-full py-5 mt-6 bg-slate-200 text-2xl font-semibold rounded-full"
            >
              {t.restart_quiz}
            </button>
          </>
        )}
      </main>
    </div>
  );
}

// =============================================================
// COMPONENTE PRINCIPALE FULL MOBILE APP STYLE
// =============================================================

export default function ProductAdvisorApp() {
  const lang = "it";
  const t = I18N[lang];
  const [active, setActive] = useState(null);

  if (active) {
    const mod = MODULES.find(m => m.id === active);
    return <Quiz module={mod} t={t} onBack={() => setActive(null)} />;
  }

  return (
    <div
      className="min-h-screen bg-white"
      style={{
        fontFamily: appFont,
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)"
      }}
    >
      {/* APP HEADER */}
      <header className="px-4 py-5 bg-white sticky top-0 shadow-md z-50">
        <h1 className="text-4xl font-extrabold">{t.app_title}</h1>
        <p className="text-2xl text-slate-600 mt-1">{t.app_subtitle}</p>
      </header>

      {/* CATEGORIE */}
      <main className="px-4 py-6 flex flex-col gap-5">
        {MODULES.map(m => (
          <motion.button
            key={m.id}
            onClick={() => setActive(m.id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-sky-600 rounded-full shadow-md flex items-center gap-4 p-4 active:scale-95"
            style={{ height: "75px" }}
          >
            <img
              src={m.image}
              alt={m.label}
              className="h-14 w-14 rounded-full object-cover border-4 border-white"
            />
            <span className="text-white text-2xl font-bold">
              {m.label}
            </span>
            <span className="text-white ml-auto text-3xl">›</span>
          </motion.button>
        ))}
      </main>

      <footer className="text-center py-6 text-slate-400 text-lg">
        © Sport al Centro – App stile
      </footer>
    </div>
  );
}
