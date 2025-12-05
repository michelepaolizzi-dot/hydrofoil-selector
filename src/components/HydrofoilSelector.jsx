// =============================================================
// SPORT AL CENTRO — PRODUCT SELECTOR (APP STYLE, SOLO UTENTE)
// =============================================================

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe2 } from "lucide-react";

const appFont =
  'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", Roboto, Arial, sans-serif';

// =============================================================
// I18N — dizionario IT / EN
// =============================================================
const I18N = {
  it: {
    app_title: "I migliori prodotti provati da Michele",
    app_subtitle:
      "Qui trovi i prodotti con il miglior rapporto qualità/prezzo e testati personalmente sul canale YouTube. Se hai qualche domanda contattaci su Instagram, WhatsApp o e-mail.",

    lang_label: "Lingua",
    category_title: "Da dove vuoi iniziare?",

    category_sup: "SUP gonfiabili",
    category_sup_desc: "Passeggiate, touring e avventure sul tuo SUP gonfiabile.",
    category_hydrofoil: "Hydrofoil",
    category_hydrofoil_desc: "Per wingfoil, surf foil e downwind ad alte performance.",
    category_wingrigid: "Tavole rigide Wingfoil",
    category_wingrigid_desc: "Massime performance con controllo e precisione.",
    category_pumps: "Pompe elettriche",
    category_pumps_desc: "Gonfia senza fatica SUP e ali da wing in pochi minuti.",

    back_to_categories: "Home",

    progress_step: "Passo",
    progress_of: "di",
    back: "Indietro",
    next: "Continua",
    restart_quiz: "Ricomincia",

    results_title: "I prodotti consigliati 🎯",
    results_sub: "In base alle tue preferenze abbiamo selezionato:",
    no_results: "Nessun match preciso, ma eccoti alcune proposte valide!",

    final_title: "Vuoi aiutarci a crescere?",
    final_text:
      "Iscriviti al canale YouTube per essere sempre aggiornato sui test dei nuovi prodotti!",
    yt_button: "Vai al canale YouTube",

    q_weight: "Quanto pesi?",
    opt_weight_1: "<60 kg",
    opt_weight_2: "60-75 kg",
    opt_weight_3: "75-90 kg",
    opt_weight_4: ">90 kg",

    q_level: "Livello di esperienza?",
    opt_level_beginner: "Principiante",
    opt_level_intermediate: "Intermedio",
    opt_level_advanced: "Avanzato"
  },

  en: {
    app_title: "Best products tested by Michele",
    app_subtitle:
      "Carefully selected products with the best value for money — personally tested on our YouTube channel. For any questions, contact us via Instagram, WhatsApp or e-mail.",

    lang_label: "Language",
    category_title: "Where do you want to start?",

    category_sup: "Inflatable SUPs",
    category_sup_desc: "Explore, cruise and enjoy the water with inflatable SUP boards.",
    category_hydrofoil: "Hydrofoil",
    category_hydrofoil_desc: "For wingfoil, surf foil and high-performance downwind.",
    category_wingrigid: "Rigid Wingfoil boards",
    category_wingrigid_desc: "Maximum performance with precision and control.",
    category_pumps: "Electric pumps",
    category_pumps_desc: "Inflate SUPs and wings fast and effortlessly.",

    back_to_categories: "Home",

    progress_step: "Step",
    progress_of: "of",
    back: "Back",
    next: "Continue",
    restart_quiz: "Restart",

    results_title: "Recommended products 🎯",
    results_sub: "Based on your preferences, here are our picks:",
    no_results: "No perfect match, but here are great alternatives!",

    final_title: "Support our channel!",
    final_text: "Subscribe to stay up to date with reviews and product tests.",
    yt_button: "Go to YouTube channel",

    q_weight: "Your weight?",
    opt_weight_1: "<60 kg",
    opt_weight_2: "60-75 kg",
    opt_weight_3: "75-90 kg",
    opt_weight_4: ">90 kg",

    q_level: "Your skill level?",
    opt_level_beginner: "Beginner",
    opt_level_intermediate: "Intermediate",
    opt_level_advanced: "Advanced"
  }
};

// =============================================================
//  MODULI DI CATEGORIA (logica + domande + default products)
// =============================================================

// --- SUP ---
const supModule = {
  id: "sup",
  productsUrl: "https://example.com/sup.json",

  getLabel: t => t.category_sup,
  getDescription: t => t.category_sup_desc,

  getQuestions: t => [
    {
      id: "usage",
      q: "Per cosa userai principalmente il SUP?",
      q_en: "What will you mainly use the SUP for?",
      opts: {
        it: ["Passeggiate", "Touring", "Race"],
        en: ["Cruising", "Touring", "Race"]
      }
    },
    {
      id: "level",
      q: t.q_level,
      opts: [t.opt_level_beginner, t.opt_level_intermediate, t.opt_level_advanced]
    },
    {
      id: "weight",
      q: t.q_weight,
      opts: [t.opt_weight_1, t.opt_weight_2, t.opt_weight_3, t.opt_weight_4]
    }
  ],

  match: (answers, products) =>
    (products || [])
      .map(p => {
        let score = 0;
        const tags = (p.tags || []).map(x => String(x).toLowerCase());
        const usage = String(answers.usage || "").toLowerCase();

        if (usage.includes("tour") && tags.includes("touring")) score += 2;
        if ((usage.includes("passegg") || usage.includes("cruis")) && tags.includes("allround"))
          score += 2;
        if (usage.includes("race") && tags.includes("race")) score += 2;

        return { product: p, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(x => x.product),

  defaultProducts: [
    {
      id: "sup1",
      brand: "Fanatic",
      model: "Ray Air",
      tags: ["touring"],
      url: "#",
      image_url: "https://via.placeholder.com/300x300?text=Fanatic+Ray+Air"
    },
    {
      id: "sup2",
      brand: "Red Paddle Co",
      model: "Ride 10'6",
      tags: ["allround", "stable"],
      url: "#",
      image_url: "https://via.placeholder.com/300x300?text=Red+Ride+10'6"
    }
  ]
};

// --- HYDROFOIL ---
const hydrofoilModule = {
  id: "hydrofoil",
  productsUrl: "https://example.com/hydrofoil.json",

  getLabel: t => t.category_hydrofoil,
  getDescription: t => t.category_hydrofoil_desc,

  getQuestions: t => [
    {
      id: "discipline",
      q: "Quale disciplina vuoi praticare?",
      q_en: "Which discipline do you want to practice?",
      opts: {
        it: ["Wingfoil", "Surf Foil", "Downwind / Pump"],
        en: ["Wingfoil", "Surf foil", "Downwind / Pump"]
      }
    },
    {
      id: "level",
      q: t.q_level,
      opts: [t.opt_level_beginner, t.opt_level_intermediate, t.opt_level_advanced]
    }
  ],

  match: (answers, products) => (products || []).slice(0, 3),

  defaultProducts: [
    {
      id: "foil1",
      brand: "Sabfoil",
      model: "Leviathan 1750",
      image_url: "https://via.placeholder.com/300x300?text=Leviathan+1750"
    },
    {
      id: "foil2",
      brand: "Indiana",
      model: "Barracuda",
      image_url: "https://via.placeholder.com/300x300?text=Barracuda"
    }
  ]
};

// --- WING RIGID ---
const wingRigidModule = {
  id: "wingrigid",
  productsUrl: "https://example.com/wingrigid.json",

  getLabel: t => t.category_wingrigid,
  getDescription: t => t.category_wingrigid_desc,

  getQuestions: t => [
    {
      id: "volume",
      q: "Che volume stai cercando?",
      q_en: "Which volume range are you looking for?",
      opts: {
        it: ["<70 L", "70-90 L", ">90 L"],
        en: ["<70 L", "70-90 L", ">90 L"]
      }
    }
  ],

  match: (answers, products) => (products || []).slice(0, 3),

  defaultProducts: [
    {
      id: "board1",
      brand: "KT",
      model: "Drifter",
      image_url: "https://via.placeholder.com/300x300?text=KT+Drifter"
    },
    {
      id: "board2",
      brand: "AK",
      model: "Compact",
      image_url: "https://via.placeholder.com/300x300?text=AK+Compact"
    }
  ]
};

// --- PUMPS ---
const pumpsModule = {
  id: "pumps",
  productsUrl: "https://example.com/pumps.json",

  getLabel: t => t.category_pumps,
  getDescription: t => t.category_pumps_desc,

  getQuestions: t => [
    {
      id: "use",
      q: "Cosa vuoi gonfiare principalmente?",
      q_en: "What do you mainly want to inflate?",
      opts: {
        it: ["SUP gonfiabile", "Wing / Kite", "Entrambi"],
        en: ["Inflatable SUP", "Wing / Kite", "Both"]
      }
    }
  ],

  match: (answers, products) => (products || []).slice(0, 3),

  defaultProducts: [
    {
      id: "pump1",
      brand: "Fanatic",
      model: "Power Pump",
      image_url: "https://via.placeholder.com/300x300?text=Power+Pump"
    }
  ]
};

// =============================================================
//  MODULI CON IMMAGINI PER LA PAGINA CATEGORIE
// =============================================================
const MODULES = [
  {
    ...supModule,
    image: "https://media.adeo.com/mkp/52efae964714afffb04eac8a5f8b7d21/media.jpeg"
  },
  {
    ...hydrofoilModule,
    image:
      "https://images.unsplash.com/photo-1624213394899-232bd2e2fbf8?auto=format&fit=crop&w=900&q=80"
  },
  {
    ...wingRigidModule,
    image:
      "https://images.unsplash.com/photo-1595187087770-8d7e046c9f7f?auto=format&fit=crop&w=900&q=80"
  },
  {
    ...pumpsModule,
    image:
      "https://images.unsplash.com/photo-1602751587717-5b101e538c87?auto=format&fit=crop&w=900&q=80"
  }
];

// =============================================================
// QUIZ ENGINE — APP STYLE
// =============================================================
function QuizEngine({ module, lang, t, onBackToCategories }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [products, setProducts] = useState(module.defaultProducts || []);
  const [loadingSource, setLoadingSource] = useState(false);

  const questions = module.getQuestions(t).map(q => {
    const text = lang === "en" && q.q_en ? q.q_en : q.q;
    const opts =
      Array.isArray(q.opts) ? q.opts : q.opts && q.opts[lang] ? q.opts[lang] : [];
    return { ...q, text, opts };
  });

  const TOTAL_STEPS = questions.length + 2;
  const isResultsStep = step === questions.length;
  const isFinalStep = step === questions.length + 1;

  // Carica prodotti da JSON remoto (se presente)
  useEffect(() => {
    let abort = false;
    async function fetchProducts() {
      if (!module.productsUrl) return;
      setLoadingSource(true);
      try {
        const res = await fetch(module.productsUrl, { cache: "no-store" });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!abort && Array.isArray(data)) setProducts(data);
      } catch {
        // fallback: defaultProducts
        if (!abort) setProducts(module.defaultProducts || []);
      } finally {
        if (!abort) setLoadingSource(false);
      }
    }
    fetchProducts();
    return () => {
      abort = true;
    };
  }, [module]);

  const suggestions = isResultsStep ? module.match(answers, products) : [];

  const handleAnswer = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    setStep(s => s + 1);
  };

  const back = () => setStep(s => Math.max(s - 1, 0));
  const reset = () => {
    setStep(0);
    setAnswers({});
  };

  return (
    <div>
      {/* HEADER QUIZ */}
      <header className="sticky top-0 bg-white/95 backdrop-blur px-4 py-4 shadow-sm z-30 flex items-center gap-4">
        <button
          onClick={onBackToCategories}
          className="text-3xl font-bold text-sky-600"
        >
          ←
        </button>

        <div className="flex-1 text-right text-sky-600 font-semibold text-lg">
          {t.progress_step} {Math.min(step + 1, TOTAL_STEPS)} {t.progress_of} {TOTAL_STEPS}
        </div>
      </header>

      {/* PROGRESS BAR */}
      <div className="w-full h-2 bg-slate-200">
        <div
          className="h-full bg-sky-500 transition-all"
          style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      <main className="px-4 py-6 text-left">
        {/* DOMANDE */}
        {step < questions.length && (() => {
          const q = questions[step];
          return (
            <>
              <h2 className="text-3xl font-black mb-6 leading-snug">
                {q.text}
              </h2>

              <div className="flex flex-col gap-4">
                {q.opts.map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(q.id, opt)}
                    className="w-full py-5 bg-sky-600 text-white text-2xl font-semibold rounded-full active:scale-95 transition"
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="text-right mt-6">
                <button
                  onClick={back}
                  disabled={step === 0}
                  className="text-xl px-5 py-2 rounded-full bg-slate-200 disabled:opacity-40"
                >
                  {t.back}
                </button>
              </div>
            </>
          );
        })()}

        {/* RISULTATI */}
        {isResultsStep && (
          <>
            <h2 className="text-3xl font-bold mb-4">{t.results_title}</h2>
            <p className="text-xl text-slate-600 mb-4">{t.results_sub}</p>

            {loadingSource && (
              <p className="text-base text-slate-400 mb-4">Caricamento prodotti…</p>
            )}

            <div className="flex flex-col gap-5">
              {(suggestions.length ? suggestions : products.slice(0, 3)).map(p => (
                <div key={p.id} className="bg-white shadow-md rounded-2xl p-5">
                  <div className="flex gap-5 items-start">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100">
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          className="w-full h-full object-cover"
                          alt={p.model || p.brand}
                        />
                      ) : (
                        <div className="text-sm text-slate-400 flex items-center justify-center h-full">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="text-2xl font-bold leading-tight">
                        {p.brand} {p.model}
                      </div>
                      {p.tags && (
                        <div className="text-md text-slate-500 mt-1">
                          {p.tags.join(", ")}
                        </div>
                      )}
                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-600 text-lg mt-3 inline-block font-semibold"
                        >
                          Vai al prodotto →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!suggestions.length && !loadingSource && (
              <p className="mt-3 text-base text-amber-600">{t.no_results}</p>
            )}

            <div className="mt-8 flex flex-col gap-4">
              <button
                onClick={() => setStep(s => s + 1)}
                className="w-full py-5 bg-emerald-600 text-white text-2xl rounded-full font-bold"
              >
                {t.next}
              </button>
              <button
                onClick={reset}
                className="w-full py-5 bg-slate-200 text-2xl rounded-full font-bold"
              >
                {t.restart_quiz}
              </button>
            </div>
          </>
        )}

        {/* STEP FINALE */}
        {isFinalStep && (
          <>
            <h2 className="text-3xl font-black mb-4">{t.final_title}</h2>
            <p className="text-lg text-slate-600 mb-6">{t.final_text}</p>

            <a
              href="https://www.youtube.com/sportalcentro"
              target="_blank"
              className="w-full block py-5 bg-red-600 text-white text-2xl font-bold rounded-full text-center"
              rel="noreferrer"
            >
              {t.yt_button}
            </a>

            <div className="mt-10">
              <button
                onClick={onBackToCategories}
                className="w-full py-5 bg-slate-200 text-2xl rounded-full font-bold"
              >
                {t.back_to_categories}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// =============================================================
// COMPONENTE PRINCIPALE — APP STYLE
// =============================================================
export default function ProductAdvisorApp() {
  const [lang, setLang] = useState(() => {
    if (typeof navigator !== "undefined" && navigator.language) {
      const base = navigator.language.split("-")[0];
      return I18N[base] ? base : "it";
    }
    return "it";
  });

  const t = I18N[lang];
  const [activeModuleId, setActiveModuleId] = useState(null);

  const activeModule = MODULES.find(m => m.id === activeModuleId) || null;

  return (
    <div
      className="min-h-screen bg-white text-slate-900"
      style={{
        fontFamily: appFont,
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)"
      }}
    >
      <div className="flex flex-col min-h-screen">
        {/* HEADER */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur px-4 py-5 border-b border-slate-200">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold leading-tight">
                {t.app_title}
              </h1>
              <p className="text-lg text-slate-700 mt-2 font-medium tracking-wide leading-snug">
                {t.app_subtitle}
              </p>
            </div>

            {/* Cambia lingua */}
            <div className="shrink-0">
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm border border-slate-200">
                <Globe2 size={20} className="text-slate-500" />
                <select
                  value={lang}
                  onChange={e => setLang(e.target.value)}
                  className="text-sm bg-transparent outline-none font-semibold"
                >
                  <option value="it">IT</option>
                  <option value="en">EN</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 px-4 py-6">
          {!activeModule ? (
            <div className="flex flex-col gap-5 mt-4">
              {MODULES.map(mod => (
                <motion.button
                  key={mod.id}
                  onClick={() => setActiveModuleId(mod.id)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-sky-600 rounded-full shadow-lg p-4 pl-5 pr-6 text-left flex items-center gap-4"
                  style={{ minHeight: "90px" }}
                >
                  <div className="h-16 w-16 rounded-full overflow-hidden border-4 border-white">
                    <img
                      src={mod.image}
                      alt={mod.getLabel(t)}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="text-2xl font-extrabold text-white leading-tight">
                      {mod.getLabel(t)}
                    </div>
                    <div className="text-lg text-white/90">
                      {mod.getDescription(t)}
                    </div>
                  </div>

                  <ArrowRight size={28} className="text-white" />
                </motion.button>
              ))}
            </div>
          ) : (
            <QuizEngine
              module={activeModule}
              lang={lang}
              t={t}
              onBackToCategories={() => setActiveModuleId(null)}
            />
          )}
        </main>

        {/* FOOTER */}
        <footer className="px-4 pb-4 pt-6 text-center text-sm text-slate-500">
          © Sport al Centro — ottimizzato per smartphone 📱
        </footer>
      </div>
    </div>
  );
}
