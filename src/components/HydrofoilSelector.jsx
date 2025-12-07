// =============================================================
// PRODUCT ADVISOR — Versione Utente Mobile First + WhatsApp
// =============================================================
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe2, MessageCircle } from "lucide-react";

const appFont =
  'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", Roboto, Arial, sans-serif';

// =============================================================
// 1️⃣ I18N — MULTILINGUA
// =============================================================
const I18N = {
  it: {
    app_title: "I migliori prodotti provati da Michele",
    app_subtitle:
      "Consigli certificati: prodotti testati sul canale YouTube, al miglior rapporto qualità/prezzo.",

    lang_label: "Lingua",
    category_title: "Da dove vuoi iniziare?",
    category_sup: "SUP gonfiabili",
    category_sup_desc: "Divertimento, touring e avventure in acqua.",
    category_hydrofoil: "Hydrofoil",
    category_hydrofoil_desc: "Wingfoil, surf foil e downwind.",
    category_wingrigid: "Tavole rigide Wingfoil",
    category_wingrigid_desc: "Prestazioni massime e controllo totale.",
    category_pumps: "Pompe elettriche",
    category_pumps_desc: "Gonfia in pochi minuti senza fatica.",
    back_to_categories: "Home",

    progress_step: "Passo",
    progress_of: "di",

    back: "Indietro",
    next: "Continua",
    restart_quiz: "Ricomincia",

    results_title: "I prodotti consigliati 🎯",
    results_sub: "Selezionati per te:",

    test_badge: "⭐ Testato sul canale",
    shop_cta: "🔥 Acquista in sconto →",
    coupon_label: "🎁 Codice Sconto:",

    final_title: "Vuoi aiutarci a crescere?",
    final_text:
      "Iscriviti al canale YouTube per scoprire test e recensioni aggiornate!",
    yt_button: "Iscriviti al canale",

    q_weight: "Quanto pesi?",
    opt_weight_1: "<60 kg",
    opt_weight_2: "60-75 kg",
    opt_weight_3: "75-90 kg",
    opt_weight_4: ">90 kg",

    q_level: "Livello di esperienza?",
    opt_level_beginner: "Principiante",
    opt_level_intermediate: "Intermedio",
    opt_level_advanced: "Avanzato",

    whatsapp_cta: "Hai dubbi? Scrivimi su WhatsApp"
  },

  en: {
    app_title: "Best Products Tested by Michele",
    app_subtitle:
      "Verified recommendations: tested on our YouTube channel, top value for money.",

    lang_label: "Language",
    category_title: "Where do you want to start?",
    category_sup: "Inflatable SUPs",
    category_sup_desc: "Cruising, touring and fun on the water.",
    category_hydrofoil: "Hydrofoil",
    category_hydrofoil_desc: "Wingfoil, surf foil and downwind.",
    category_wingrigid: "Rigid Wingfoil boards",
    category_wingrigid_desc: "Top performance and control.",
    category_pumps: "Electric pumps",
    category_pumps_desc: "Inflate fast without effort.",
    back_to_categories: "Home",

    progress_step: "Step",
    progress_of: "of",

    back: "Back",
    next: "Next",
    restart_quiz: "Restart",

    results_title: "Recommended products 🎯",
    results_sub: "Chosen for you:",

    test_badge: "⭐ Tested on our channel",
    shop_cta: "🔥 Buy discounted →",
    coupon_label: "🎁 Discount Code:",

    final_title: "Support our channel!",
    final_text:
      "Subscribe to stay updated on new tests & reviews!",
    yt_button: "Subscribe to YouTube",

    q_weight: "Your weight?",
    opt_weight_1: "<60 kg",
    opt_weight_2: "60-75 kg",
    opt_weight_3: "75-90 kg",
    opt_weight_4: ">90 kg",

    q_level: "Your skill level?",
    opt_level_beginner: "Beginner",
    opt_level_intermediate: "Intermediate",
    opt_level_advanced: "Advanced",

    whatsapp_cta: "Questions? Chat on WhatsApp"
  }
};

// =============================================================
// 2️⃣ MODULI QUIZ — DOMANDE + MATCHING + PRODOTTI DEFAULT
// =============================================================

const supModule = {
  id: "sup",
  productsUrl:
    "https://raw.githubusercontent.com/michelepaolizzi-dot/products-selector/main/products-sup.json",
  getLabel: (t) => t.category_sup,

  getQuestions: (t) => [
       {
      id: "sup_type",
      q: {
        it: "Che tipo di SUP stai cercando?",
        en: "What type of SUP are you looking for?",
      },
      opts: {
        it: ["Gonfiabile", "Rigido", "Non ho idea"],
        en: ["Inflatable", "Rigid", "No idea"],
      },
    },
    {
      id: "level",
      q: {
        it: "Qual è il tuo livello di esperienza con il SUP?",
        en: "What's your SUP experience level?",
      },
      opts: {
        it: ["Principiante", "Intermedio", "Avanzato"],
        en: ["Beginner", "Intermediate", "Advanced"],
      },
    },
    {
      id: "usage",
      q: {
        it: "Come utilizzerai principalmente la tavola?",
        en: "How will you mainly use the board?",
      },
      opts: {
        it: [
          "Relax / escursioni brevi",
          "Touring / lunghe distanze",
          "Yoga / fitness",
          "SUP con bambini/animali",
          "Piccole onde (SUP surf)",
        ],
        en: [
          "Relax / short cruising",
          "Touring / long distance",
          "Yoga / fitness",
          "SUP with kids/pets",
          "Small waves (SUP surf)",
        ],
      },
    },
      {
    id: "height",
    q: {
      it: "Quanto sei alto/a?",
      en: "How tall are you?",
    },
    opts: {
      it: ["<160 cm", "160-175 cm", "175-190 cm", ">190 cm"],
      en: ["<160 cm", "160-175 cm", "175-190 cm", ">190 cm"],
    },
  },
    {
      id: "water",
      q: {
        it: "Dove la utilizzerai più spesso?",
        en: "Where will you use it most?",
      },
      opts: {
        it: ["Mare calmo", "Lago", "Fiumi o acqua mossa", "Un po’ ovunque"],
        en: ["Calm sea", "Lake", "Rivers / choppy", "Everywhere"],
      },
    },
    {
      id: "budget",
      q: {
        it: "Quanto vuoi spendere?",
        en: "What's your budget?",
      },
      opts: {
        it: ["< 200 €", "200–300 €", "300–500 €", "Oltre 500 €"],
        en: ["< 200 €", "200–300 €", "300–500 €", "Over 500 €"],
      },
    },
  ],

  match: (answers, products) => {
    const budgetMap = {
      "< 200 €": 200,
      "200–300 €": 300,
      "300–500 €": 500,
      "Oltre 500 €": 2000,
    };
    const maxPrice = budgetMap[answers.budget];

    return products
      .map((p) => {
        let score = 0;

        const usageTagMap = {
          "Relax / escursioni brevi": "relax",
          "Touring / lunghe distanze": "touring",
          "Yoga / fitness": "yoga",
          "SUP con bambini/animali": "family",
          "Piccole onde (SUP surf)": "surf",
        };
        if (answers.usage && p.tags?.includes(usageTagMap[answers.usage])) {
          score += 3;
        }

        // 🎓 Livello richiesto (case insensitive, solo se entrambi presenti)
        if (
          p.required_level &&
          answers.level &&
          p.required_level.toLowerCase() === answers.level.toLowerCase()
        ) {
          score += 4;
        } else if (
          p.required_level === "Intermedio" &&
          answers.level === "Avanzato"
        ) {
          score += 2;
        } else if (
          p.required_level === "Principiante" &&
          answers.level !== "Avanzato"
        ) {
          score += 2;
        } else {
          score -= 5;
        }

        // 💶 BUDGET
        if (p.price <= maxPrice) score += 4;

        const heightTagMap = {
  "<160 cm": "short",
  "160-175 cm": "medium",
  "175-190 cm": "tall",
  ">190 cm": "x-tall",
};

if (answers.height && p.recommended_height?.includes(heightTagMap[answers.height])) {
  score += 3;
}
        return { ...p, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  },

  defaultProducts: [
    {
      id: "sup1",
      brand: "Fanatic",
      model: "Ray Air",
      tags: ["touring"],
      image_url: "https://via.placeholder.com/300?text=Fanatic+Ray+Air",
      youtube_review_url: "https://youtu.be/abc123",
      discount_code: "FANATIC10",
      discount_url: "https://shop.com/fanatic?coupon=FANATIC10",
      weight_min: 60,
      weight_max: 110,
      stability: 4,
      speed: 4,
      price: 699,
      required_level: "Principiante",
      recommended_height: ["medium", "tall"],
    },
  ],
};


const hydrofoilModule = {
  id: "hydrofoil",
  productsUrl: null,
  getLabel: t => t.category_hydrofoil,
  getDescription: t => t.category_hydrofoil_desc,
  getQuestions: t => [
    {
      id: "discipline",
      q: "Quale disciplina?",
      opts: {
        it: ["Wingfoil", "Surf Foil", "Downwind"],
        en: ["Wingfoil", "Surf foil", "Downwind"]
      }
    }
  ],
  match: (a, p) => p.slice(0, 3),
  defaultProducts: [
    {
      id: "foil1",
      brand: "Sabfoil",
      model: "Leviathan 1750",
      tags: ["wingfoil"],
      image_url: "https://via.placeholder.com/300?text=Sabfoil",
      youtube_review_url: "https://youtu.be/def456",
      discount_code: "SABFOIL15",
      discount_url: "https://shop.com/sabfoil?coupon=SABFOIL15"
    }
  ]
};

const wingRigidModule = {
  id: "wingrigid",
  productsUrl: null,
  getLabel: t => t.category_wingrigid,
  getDescription: t => t.category_wingrigid_desc,
  getQuestions: t => [
    {
      id: "volume",
      q: "Che volume vuoi?",
      opts: {
        it: ["<70L", "70-90L", ">90L"],
        en: ["<70L", "70-90L", ">90L"]
      }
    }
  ],
  match: (a, p) => p.slice(0, 3),
  defaultProducts: [
    {
      id: "rigid1",
      brand: "KT",
      model: "Drifter",
      tags: ["freeride"],
      image_url: "https://via.placeholder.com/300?text=KT+Drifter",
      youtube_review_url: "https://youtu.be/ghi789",
      discount_code: "KT10",
      discount_url: "https://shop.com/ktdrifter?coupon=KT10"
    }
  ]
};

const pumpsModule = {
  id: "pumps",
  productsUrl: null,
  getLabel: t => t.category_pumps,
  getDescription: t => t.category_pumps_desc,
  getQuestions: t => [
    {
      id: "use",
      q: "Cosa devi gonfiare?",
      opts: {
        it: ["SUP", "Wing", "Entrambi"],
        en: ["SUP", "Wing", "Both"]
      }
    }
  ],
  match: (a, p) => p.slice(0, 3),
  defaultProducts: [
    {
      id: "pump1",
      brand: "OutdoorMaster",
      model: "Shark II",
      tags: ["sup"],
      image_url: "https://via.placeholder.com/300?text=SharkII",
      youtube_review_url: "https://youtu.be/lmn000",
      discount_code: "PUMP5",
      discount_url: "https://shop.com/shark2?coupon=PUMP5"
    }
  ]
};

// =============================================================
// IMMAGINI HOME
// =============================================================
const MODULES = [
  {
    ...supModule,
    image: "https://kite-prod.b-cdn.net/25834-thickbox_default/jp-cruisair-sl-12-6-inflatable-sup-package.jpg"
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
// 3️⃣ QUIZ ENGINE — UI APP STYLE
// =============================================================
function QuizEngine({ module, lang, t, onBackToCategories }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const questions = module.getQuestions(t);
  const TOTAL_STEPS = questions.length + 2;

  const handleAnswer = (id, val) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
    setStep(s => s + 1);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
  };

  const isResults = step === questions.length;
  const isFinal = step === questions.length + 1;

  const [products, setProducts] = useState(module.defaultProducts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!module.productsUrl) return;
    setLoading(true);

    fetch(module.productsUrl)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
        else setProducts(module.defaultProducts);
      })
      .catch(() => setProducts(module.defaultProducts))
      .finally(() => setLoading(false));
  }, [module]);

  const suggestions = isResults ? module.match(answers, products) : [];

  return (
    <div>
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex justify-center items-center z-50 text-xl font-bold text-sky-600">
          Caricamento prodotti...
        </div>
      )}
      <header className="sticky top-0 bg-white px-4 py-4 shadow z-50 flex justify-between items-center">
        <button
          onClick={onBackToCategories}
          className="text-3xl font-bold text-sky-600"
        >
          ←
        </button>

        <div className="text-lg font-bold text-sky-600">
          {t.progress_step} {Math.min(step + 1, TOTAL_STEPS)} {t.progress_of} {TOTAL_STEPS}
        </div>
      </header>

      {/* Bar */}
      <div className="h-2 bg-slate-200">
        <div
          className="h-full bg-sky-500"
          style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      <main className="px-4 py-6">
        {/* Questions */}
        {step < questions.length && (() => {
          const q = questions[step];
          const opts = Array.isArray(q.opts) ? q.opts : q.opts[lang];
          return (
            <>
              <h2 className="text-3xl font-black mb-6">
                {q.q?.[lang] || q.q?.it || q.q}
              </h2>

              <div className="flex flex-col gap-4">
                {opts.map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(q.id, opt)}
                    className="w-full py-5 bg-sky-600 text-white text-2xl font-semibold rounded-full active:scale-95"
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {step > 0 && (
                <div className="text-right mt-6">
                  <button
                    onClick={() => setStep(s => s - 1)}
                    className="text-xl px-6 py-3 rounded-full bg-slate-200"
                  >
                    {t.back}
                  </button>
                </div>
              )}
            </>
          );
        })()}

        {/* Results */}
        {isResults && (
          <>
            <h2 className="text-3xl font-black mb-2">{t.results_title}</h2>
            <p className="text-xl text-slate-600 mb-6">{t.results_sub}</p>

            <div className="flex flex-col gap-6">
              {(suggestions.length ? suggestions : products).map(p => (
                <div key={p.id} className="bg-white rounded-3xl p-5 shadow-md">
                  <div className="flex gap-5 items-start">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100">
                      <img src={p.image_url} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1">
                      <div className="text-2xl font-bold">
                        {p.brand} {p.model}
                      </div>

                      {/* TAGS / USO PRINCIPALE */}
                      {p.tags && (
                        <div className="text-lg text-slate-500 mt-1">
                          {p.tags.join(", ")}
                        </div>
                      )}

                      {/* Parametri consigliati */}
                      <div className="mt-3 text-sm text-slate-600 space-y-1">
                        {"stability" in p && (
                          <div>🛶 Stabilità: <strong>{p.stability}/5</strong></div>
                        )}
                        {"speed" in p && (
                          <div>⚡ Velocità e scorrevolezza: <strong>{p.speed}/5</strong></div>
                        )}
                        {"price" in p && (
                          <div>💶 Prezzo indicativo: <strong>{p.price} €</strong></div>
                        )}
                      </div>

                      {"required_level" in p && (
                        <div>🎓 Livello minimo richiesto: <strong>{p.required_level}</strong></div>
                      )}

                      {/* ⭐ Testato sul canale */}
                      {p.youtube_review_url && (
                        <a
                          href={p.youtube_review_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-2 bg-red-600 text-white text-lg font-bold rounded-xl px-3 py-1"
                        >
                          {t.test_badge}
                        </a>
                      )}

                      {/* Codice sconto */}
                      {p.discount_code && (
                        <div className="mt-3 text-xl font-bold bg-yellow-300 rounded-xl inline-block px-3 py-1 text-black">
                          {t.coupon_label} {p.discount_code}
                        </div>
                      )}

                      {/* Link acquisto scontato */}
                      {p.discount_url && (
                        <a
                          href={p.discount_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 block text-sky-600 text-2xl font-bold"
                        >
                          {t.shop_cta}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="mt-8 flex flex-col gap-4">
              <button
                onClick={() => setStep(s => s + 1)}
                className="w-full py-6 bg-emerald-600 text-white text-2xl font-bold rounded-full"
              >
                {t.next}
              </button>
              <button
                onClick={reset}
                className="w-full py-6 bg-slate-200 text-2xl font-bold rounded-full"
              >
                {t.restart_quiz}
              </button>
            </div>
          </>
        )}

        {/* Final */}
        {isFinal && (
          <>
            <h2 className="text-3xl font-black mb-6">{t.final_title}</h2>
            <p className="text-xl text-slate-600 mb-6">{t.final_text}</p>

            <a
              href="https://www.youtube.com/sportalcentro"
              target="_blank"
              rel="noreferrer"
              className="w-full block text-center py-6 bg-red-600 text-white text-3xl font-bold rounded-full"
            >
              {t.yt_button}
            </a>

            <button
              onClick={onBackToCategories}
              className="mt-8 w-full py-6 bg-slate-200 text-2xl font-bold rounded-full"
            >
              {t.back_to_categories}
            </button>
          </>
        )}
      </main>
    </div>
  );
}

// =============================================================
// 4️⃣ WRAPPER APP — NAVIGAZIONE CATEGORIE + WHATSAPP FLOAT
// =============================================================
export default function ProductAdvisorApp() {
  const [lang, setLang] = useState("it");
  const t = I18N[lang];
  const [activeModuleId, setActiveModuleId] = useState(null);

  const activeModule = MODULES.find(m => m.id === activeModuleId) || null;

  // ⚠️ Sostituisci questo URL con il TUO link WhatsApp:
  const whatsappLink =
    "https://wa.me/393331234567?text=Ciao%20Michele,%20ho%20una%20domanda%20sui%20prodotti%20del%20sito";

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: appFont }}
    >
      <header className="px-4 py-5 border-b bg-white sticky top-0 z-40">
        <div>
          <h1 className="text-4xl font-extrabold">{t.app_title}</h1>
          <p className="text-lg text-slate-600 mt-1">{t.app_subtitle}</p>
        </div>

        {/* language */}
        <div className="mt-4 flex items-center gap-2 bg-slate-50 rounded-full px-4 py-2 inline-flex">
          <Globe2 size={20} className="text-slate-600" />
          <select
            value={lang}
            onChange={e => setLang(e.target.value)}
            className="text-lg font-semibold bg-transparent"
          >
            <option value="it">IT</option>
            <option value="en">EN</option>
          </select>
        </div>
      </header>

      {/* CATEGORIES */}
      {!activeModule && (
        <main className="px-4 py-6 flex flex-col gap-5 pb-24">
          {MODULES.map(mod => (
            <motion.button
              key={mod.id}
              onClick={() => setActiveModuleId(mod.id)}
              whileTap={{ scale: 0.97 }}
              className="bg-sky-600 rounded-full shadow-lg p-5 flex items-center gap-5"
            >
              <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-white">
                <img src={mod.image} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-3xl font-extrabold text-white">
                  {mod.getLabel(t)}
                </div>
              </div>
              <ArrowRight className="text-white" size={36} />
            </motion.button>
          ))}
        </main>
      )}

      {/* QUIZ */}
      {activeModule && (
        <QuizEngine
          module={activeModule}
          lang={lang}
          t={t}
          onBackToCategories={() => setActiveModuleId(null)}
        />
      )}

      {/* 🔥 Floating WhatsApp Button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg bg-emerald-500 text-white text-base md:text-lg font-semibold active:scale-95"
      >
        <MessageCircle size={22} className="text-white" />
        <span className="whitespace-nowrap">{t.whatsapp_cta}</span>
      </a>
    </div>
  );
}
