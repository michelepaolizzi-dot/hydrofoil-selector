// =============================================================
// SPORT AL CENTRO — PRODUCT SELECTOR (APP STYLE, FULL FEATURED)
// - Multilingua automatico
// - JSON remoto + override manuale
// - Matching prodotti per categoria
// - UI mobile-first, testo grande, pulsanti full-width
// =============================================================

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Upload, Globe2 } from "lucide-react";

// Font stile iOS / system
const appFont =
  'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", Roboto, Arial, sans-serif';

// =============================================================
// 1️⃣ I18N — Testi generali IT / EN (completi)
// =============================================================
const I18N = {
  it: {
    app_title: "I migliori prodotti provati da Michele",
    app_subtitle:
      "Qui trovi i prodotti con il miglior rapporto qualità/prezzo e qualità elevata tra quelli provati personalmente da noi sul canale YouTube. Se hai qualche domanda contattaci su Instagram, WhatsApp o e-mail.",

    lang_label: "Lingua",
    category_title: "Da dove vuoi iniziare?",
    category_subtitle: "Seleziona una categoria per avviare il quiz guidato.",
    choose_category: "Scegli categoria",
    back_to_categories: "Torna alle categorie",

    category_sup: "SUP gonfiabili",
    category_sup_desc: "Per passeggiate, touring e divertimento in acqua con tavole gonfiabili.",
    category_hydrofoil: "Hydrofoil",
    category_hydrofoil_desc: "Per wingfoil, surf e downwind con foil ad alte prestazioni.",
    category_wingrigid: "Tavole rigide Wingfoil",
    category_wingrigid_desc:
      "Per chi vuole massime performance e controllo con tavole rigide dedicate al wing.",
    category_pumps: "Pompe elettriche",
    category_pumps_desc: "Per gonfiare rapidamente SUP e wing senza fatica.",

    progress_step: "Passo",
    progress_of: "di",

    results_title: "Risultati consigliati",
    results_sub: "In base alle tue risposte, questi sono i prodotti che ti suggeriamo.",
    no_results: "Non ci sono match precisi: ti mostriamo comunque alcuni prodotti interessanti.",

    restart_quiz: "Ricomincia quiz",
    back: "Indietro",
    next: "Continua",

    // JSON / data source
    data_source: "Sorgente dati",
    remote_json: "JSON remoto",
    local_fallback: "Fallback locale",
    last_fetch: "Ultimo aggiornamento",
    status_ok: "ok",
    status_loading: "caricamento…",
    status_error: "Errore",

    products_loaded: "Prodotti caricati",
    products_list_title: "Prodotti disponibili",
    json_hint:
      "Suggerimento: pubblica un JSON per ogni categoria e aggiorna l'URL nel modulo corrispondente.",
    upload_json: "Applica JSON",
    cancel_json: "Annulla",

    // Newsletter + YouTube
    final_title: "Un'ultima cosa!",
    final_text:
      "Vuoi restare aggiornato su offerte, test e nuovi video? Iscriviti al nostro canale YouTube e lascia la tua email per la newsletter.",
    yt_button: "Vai al canale YouTube",
    email_label: "La tua email per la newsletter:",
    email_placeholder: "la-tua-email@example.com",
    email_send: "Iscriviti alla newsletter",
    email_ok: "Grazie! Se l'email è valida ti inseriremo nella nostra mailing list.",
    email_error: "Per favore inserisci un’email valida.",

    // Campi condivisi
    q_weight: "Quanto pesi?",
    opt_weight_1: "<60 kg",
    opt_weight_2: "60-75 kg",
    opt_weight_3: "75-90 kg",
    opt_weight_4: ">90 kg",

    q_level: "Qual è il tuo livello?",
    opt_level_beginner: "Principiante",
    opt_level_intermediate: "Intermedio",
    opt_level_advanced: "Avanzato"
  },

  en: {
    app_title: "Sport al centro — Product Selector",
    app_subtitle:
      "Guided selector to find the right product among inflatable SUPs, hydrofoils, rigid wing boards and electric pumps.",

    lang_label: "Language",
    category_title: "Where do you want to start?",
    category_subtitle: "Select a category to start the guided quiz.",
    choose_category: "Choose category",
    back_to_categories: "Back to categories",

    category_sup: "Inflatable SUPs",
    category_sup_desc: "For cruising, touring and fun on the water with inflatable boards.",
    category_hydrofoil: "Hydrofoil",
    category_hydrofoil_desc: "For wingfoil, surf and downwind with high performance foils.",
    category_wingrigid: "Rigid Wingfoil boards",
    category_wingrigid_desc:
      "For maximum performance and control with rigid boards dedicated to wing.",
    category_pumps: "Electric pumps",
    category_pumps_desc: "To inflate SUPs and wings quickly with no effort.",

    progress_step: "Step",
    progress_of: "of",

    results_title: "Recommended products",
    results_sub: "Based on your answers, these are the products we recommend.",
    no_results: "No perfect matches: we still show you some interesting products.",

    restart_quiz: "Restart quiz",
    back: "Back",
    next: "Next",

    // JSON / data source
    data_source: "Data source",
    remote_json: "Remote JSON",
    local_fallback: "Local fallback",
    last_fetch: "Last fetch",
    status_ok: "ok",
    status_loading: "loading…",
    status_error: "Error",

    products_loaded: "Products loaded",
    products_list_title: "Available products",
    json_hint:
      "Tip: publish one JSON endpoint per category and update the URL in the corresponding module.",
    upload_json: "Apply JSON",
    cancel_json: "Cancel",

    // Newsletter + YouTube
    final_title: "One last thing!",
    final_text:
      "Want to stay updated on deals, tests and new videos? Subscribe to our YouTube channel and leave your email for the newsletter.",
    yt_button: "Go to YouTube channel",
    email_label: "Your email for the newsletter:",
    email_placeholder: "your-email@example.com",
    email_send: "Subscribe to newsletter",
    email_ok: "Thank you! If the email is valid we’ll add you to our mailing list.",
    email_error: "Please enter a valid email.",

    // Shared fields
    q_weight: "How much do you weigh?",
    opt_weight_1: "<60 kg",
    opt_weight_2: "60-75 kg",
    opt_weight_3: "75-90 kg",
    opt_weight_4: ">90 kg",

    q_level: "What is your level?",
    opt_level_beginner: "Beginner",
    opt_level_intermediate: "Intermediate",
    opt_level_advanced: "Advanced"
  }
};

// =============================================================
// 2️⃣ MODULI DI CATEGORIA — domande + logica matching + prodotti default
// =============================================================

const supModule = {
  id: "sup",
  getLabel: t => t.category_sup,
  getDescription: t => t.category_sup_desc,
  productsUrl: "https://example.com/sup.json",

  getQuestions: t => [
    {
      id: "usage",
      q: "Quale uso principale farai del SUP?",
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

  match: (answers, products) => {
    if (!products.length) return [];
    const usage = (answers.usage || "").toLowerCase();
    const level = (answers.level || "").toLowerCase();
    const weight = answers.weight || "";

    return products
      .map(p => {
        let score = 0;
        const tags = (p.tags || []).map(x => String(x).toLowerCase());

        if (usage.includes("tour") && tags.includes("touring")) score += 2;
        if ((usage.includes("passegg") || usage.includes("cruis")) && tags.includes("allround"))
          score += 2;
        if (usage.includes("race") && tags.includes("race")) score += 2;

        if (level.includes("princip") || level.includes("beginner")) {
          if (tags.includes("stable") || tags.includes("allround")) score += 1;
        }

        if (weight.includes(">90") && p.max_weight && p.max_weight >= 100) score += 1;

        return { product: p, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(x => x.product);
  },

  defaultProducts: [
    {
      id: "sup-ray-air",
      brand: "Fanatic",
      model: "Ray Air",
      tags: ["touring"],
      max_weight: 110,
      url: "#",
      image_url: "https://via.placeholder.com/300x300?text=Fanatic+Ray+Air"
    },
    {
      id: "sup-red-ride",
      brand: "Red Paddle Co",
      model: "Ride 10'6",
      tags: ["allround", "stable"],
      max_weight: 120,
      url: "#",
      image_url: "https://via.placeholder.com/300x300?text=Red+Ride+10'6"
    }
  ]
};

const hydrofoilModule = {
  id: "hydrofoil",
  getLabel: t => t.category_hydrofoil,
  getDescription: t => t.category_hydrofoil_desc,
  productsUrl: "https://example.com/hydrofoil.json",

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
    },
    {
      id: "weight",
      q: t.q_weight,
      opts: [t.opt_weight_1, t.opt_weight_2, t.opt_weight_3, t.opt_weight_4]
    }
  ],

  match: (answers, products) => {
    if (!products.length) return [];
    const discipline = (answers.discipline || "").toLowerCase();
    const level = (answers.level || "").toLowerCase();
    const weight = answers.weight || "";

    const flags = [];
    if (discipline.includes("wing")) flags.push("wing");
    if (discipline.includes("surf")) flags.push("surf");
    if (discipline.includes("downwind") || discipline.includes("pump")) flags.push("downwind");

    return products
      .map(p => {
        let score = 0;
        const tags = (p.tags || []).map(x => String(x).toLowerCase());

        if (flags.some(f => tags.includes(f))) score += 2;

        if (level.includes("princip") || level.includes("beginner")) {
          if (tags.includes("beginner") || tags.includes("easy")) score += 1;
        }

        if (weight.includes(">90") && p.lift && p.lift === "high") score += 1;

        return { product: p, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(x => x.product);
  },

  defaultProducts: [
    {
      id: "foil-leviathan",
      brand: "Sabfoil",
      model: "Leviathan 1750",
      tags: ["downwind", "pump", "high_lift"],
      lift: "high",
      url: "#",
      image_url: "https://via.placeholder.com/300x300?text=Leviathan+1750"
    },
    {
      id: "foil-barracuda",
      brand: "Indiana",
      model: "Barracuda",
      tags: ["wing", "glide"],
      lift: "medium",
      url: "#",
      image_url: "https://via.placeholder.com/300x300?text=Barracuda"
    }
  ]
};

const wingRigidModule = {
  id: "wingrigid",
  getLabel: t => t.category_wingrigid,
  getDescription: t => t.category_wingrigid_desc,
  productsUrl: "https://example.com/wingrigid.json",

  getQuestions: t => [
    {
      id: "volume",
      q: "Che volume stai cercando?",
      q_en: "Which volume range are you looking for?",
      opts: {
        it: ["<70 L", "70-90 L", ">90 L"],
        en: ["<70 L", "70-90 L", ">90 L"]
      }
    },
    {
      id: "program",
      q: "Che programma preferisci?",
      q_en: "Which program do you prefer?",
      opts: {
        it: ["Freeride", "Freestyle", "Wave"],
        en: ["Freeride", "Freestyle", "Wave"]
      }
    }
  ],

  match: (answers, products) => {
    if (!products.length) return [];
    const volume = answers.volume || "";
    const program = (answers.program || "").toLowerCase();

    return products
      .map(p => {
        let score = 0;

        if (p.volume_range === volume) score += 2;
        if (p.program && p.program.toLowerCase().includes(program)) score += 2;

        return { product: p, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(x => x.product);
  },

  defaultProducts: [
    {
      id: "wing-kt-drifter",
      brand: "KT",
      model: "Drifter",
      volume_range: "70-90 L",
      program: "Freeride",
      url: "#",
      image_url: "https://via.placeholder.com/300x300?text=KT+Drifter"
    },
    {
      id: "wing-ak-compact",
      brand: "AK",
      model: "Compact",
      volume_range: "<70 L",
      program: "Freestyle",
      url: "#",
      image_url: "https://via.placeholder.com/300x300?text=AK+Compact"
    }
  ]
};

const pumpsModule = {
  id: "pumps",
  getLabel: t => t.category_pumps,
  getDescription: t => t.category_pumps_desc,
  productsUrl: "https://example.com/pumps.json",

  getQuestions: t => [
    {
      id: "use",
      q: "Cosa vuoi gonfiare principalmente?",
      q_en: "What do you mainly want to inflate?",
      opts: {
        it: ["SUP gonfiabile", "Wing / Kite", "Entrambi"],
        en: ["Inflatable SUP", "Wing / Kite", "Both"]
      }
    },
    {
      id: "portability",
      q: "Quanto è importante la portabilità?",
      q_en: "How important is portability?",
      opts: {
        it: ["Molto importante", "Non mi interessa molto"],
        en: ["Very important", "Not that important"]
      }
    }
  ],

  match: (answers, products) => {
    if (!products.length) return [];
    const use = (answers.use || "").toLowerCase();
    const portability = (answers.portability || "").toLowerCase();

    return products
      .map(p => {
        let score = 0;
        const tags = (p.tags || []).map(x => String(x).toLowerCase());

        if ((use.includes("sup") || use.includes("inflatable")) && tags.includes("sup"))
          score += 2;
        if ((use.includes("wing") || use.includes("kite")) && tags.includes("wing")) score += 2;
        if (use.includes("entrambi") || use.includes("both")) score += 2;

        if (portability.includes("molto") || portability.includes("very")) {
          if (tags.includes("compact") || tags.includes("battery")) score += 1;
        }

        return { product: p, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(x => x.product);
  },

  defaultProducts: [
    {
      id: "pump-1",
      brand: "OutdoorMaster",
      model: "Shark II",
      tags: ["sup"],
      url: "#",
      image_url: "https://via.placeholder.com/300x300?text=Shark+II"
    },
    {
      id: "pump-2",
      brand: "Fanatic",
      model: "Power Pump",
      tags: ["sup", "wing", "compact"],
      url: "#",
      image_url: "https://via.placeholder.com/300x300?text=Power+Pump"
    }
  ]
};

// =============================================================
// 🔥 MODULES con immagini per la home
// =============================================================
const MODULES = [
  {
    ...supModule,
    image: "https://media.adeo.com/mkp/52efae964714afffb04eac8a5f8b7d21/media.jpeg",
    badge: "Più richiesto"
  },
  {
    ...hydrofoilModule,
    image: "https://images.unsplash.com/photo-1624213394899-232bd2e2fbf8?auto=format&fit=crop&w=900&q=80"
  },
  {
    ...wingRigidModule,
    image: "https://images.unsplash.com/photo-1595187087770-8d7e046c9f7f?auto=format&fit=crop&w=900&q=80"
  },
  {
    ...pumpsModule,
    image: "https://images.unsplash.com/photo-1602751587717-5b101e538c87?auto=format&fit=crop&w=900&q=80",
    badge: "Best value"
  }
];

// =============================================================
// 3️⃣ QUIZ ENGINE — con JSON remoto + UI app-style mobile
// =============================================================
function QuizEngine({ module, lang, t, onBackToCategories }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [products, setProducts] = useState(module.defaultProducts || []);
  const [sourceError, setSourceError] = useState(null);
  const [loadingSource, setLoadingSource] = useState(false);
  const [lastFetched, setLastFetched] = useState(null);
  const [pasteJson, setPasteJson] = useState("");
  const [email, setEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const questions = module.getQuestions(t).map(q => {
    const text = lang === "en" && q.q_en ? q.q_en : q.q;
    const opts =
      q.opts && Array.isArray(q.opts)
        ? q.opts
        : q.opts && q.opts[lang]
        ? q.opts[lang]
        : [];
    return { ...q, text, opts };
  });

  const TOTAL_STEPS = questions.length + 2;

  // Fetch prodotti da JSON remoto
  useEffect(() => {
    let abort = false;

    async function fetchProducts() {
      if (!module.productsUrl) {
        setProducts(module.defaultProducts || []);
        return;
      }
      setLoadingSource(true);
      setSourceError(null);
      try {
        const res = await fetch(module.productsUrl, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("JSON non è un array di prodotti");
        if (!abort) {
          setProducts(data);
          setLastFetched(new Date().toISOString());
        }
      } catch (err) {
        if (!abort) {
          setSourceError(String(err));
          setProducts(module.defaultProducts || []);
        }
      } finally {
        if (!abort) setLoadingSource(false);
      }
    }

    fetchProducts();
    return () => {
      abort = true;
    };
  }, [module]);

  function answer(id, value) {
    setAnswers(prev => ({ ...prev, [id]: value }));
    setStep(prev => prev + 1);
  }

  function back() {
    setStep(prev => Math.max(prev - 1, 0));
  }

  function resetModule() {
    setStep(0);
    setAnswers({});
    setEmail("");
    setEmailMessage("");
  }

  const suggestions = step >= questions.length ? module.match(answers, products) : [];

  function applyPastedJson() {
    try {
      const data = JSON.parse(pasteJson);
      if (!Array.isArray(data)) throw new Error("JSON deve essere un array di prodotti");
      setProducts(data);
      setLastFetched(new Date().toISOString() + " (paste)");
      setPasteJson("");
      setSourceError(null);
    } catch (err) {
      setSourceError(String(err));
    }
  }

  function handleEmailSubmit() {
    if (!email || !email.includes("@")) {
      setEmailMessage(t.email_error);
      return;
    }
    setEmailMessage(t.email_ok);
  }

  return (
    <div className="grid grid-cols-12 gap-4 sm:gap-6 mt-3">
      {/* LEFT: quiz */}
      <section className="col-span-12 lg:col-span-7 bg-white rounded-3xl p-4 sm:p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm sm:text-base text-slate-500">
              {t.progress_step} {Math.min(step + 1, TOTAL_STEPS)} {t.progress_of} {TOTAL_STEPS}
            </div>
            <div className="text-base sm:text-lg text-slate-400 mt-1">
              {module.getLabel(t)}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={onBackToCategories}
              className="px-3 py-2 rounded-full border bg-slate-50 text-slate-700"
            >
              {t.back_to_categories}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-sky-500 transition-all"
            style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        <div className="mt-2">
          {/* STEP DOMANDE */}
          {step < questions.length ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {(() => {
                const current = questions[step];
                return (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-bold leading-snug">
                      {current.text}
                    </h2>
                    <div className="grid grid-cols-1 gap-3 mt-4">
                      {current.opts.map(opt => (
                        <button
                          key={opt}
                          onClick={() => answer(current.id, opt)}
                          className="w-full text-left px-4 py-4 sm:py-5 rounded-full border hover:shadow-sm hover:scale-[1.01] transition-transform bg-gradient-to-br from-white to-slate-50"
                        >
                          <div className="font-semibold text-lg sm:text-xl">{opt}</div>
                          <div className="text-sm sm:text-base text-slate-500 mt-1">
                            Tocca per selezionare
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      <button
                        onClick={back}
                        disabled={step === 0}
                        className="px-4 py-2 rounded-full text-base bg-slate-100 text-slate-800 disabled:opacity-50"
                      >
                        {t.back}
                      </button>
                      <div className="text-sm sm:text-base text-slate-400">
                        Risposte: {Object.keys(answers).length}
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          ) : step === questions.length ? (
            // STEP RISULTATI
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold">
                {t.results_title}
              </h2>
              <p className="text-lg text-slate-600">
                {t.results_sub}
              </p>

              <div className="grid grid-cols-1 gap-4 mt-4">
                {(suggestions.length ? suggestions : products.slice(0, 3)).map(p => (
                  <article
                    key={p.id}
                    className="p-4 rounded-2xl border bg-gradient-to-br from-white to-slate-50"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.model || p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                            No image
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-lg sm:text-xl">
                          {p.brand} {p.model || p.name}
                        </div>
                        {p.notes && (
                          <div className="text-sm sm:text-base text-slate-500 mt-1">
                            {p.notes}
                          </div>
                        )}
                        <div className="text-sm text-slate-400 mt-2">
                          {p.tags && p.tags.length ? `Tags: ${p.tags.join(", ")}` : null}
                        </div>
                        {p.price && (
                          <div className="text-base text-emerald-600 font-semibold mt-1">
                            {p.price}
                          </div>
                        )}
                        {p.discount_code && (
                          <div className="mt-2 px-2 py-1 bg-yellow-200 text-yellow-900 rounded-md text-sm font-semibold inline-block">
                            Coupon: {p.discount_code}
                          </div>
                        )}
                        {p.url && (
                          <a
                            className="mt-3 inline-flex items-center gap-2 text-sm sm:text-base font-medium text-sky-600"
                            href={p.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Vedi scheda <ArrowRight size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {!suggestions.length && (
                <p className="mt-2 text-sm text-amber-600">{t.no_results}</p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={resetModule}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-base"
                >
                  {t.restart_quiz}
                </button>
                <button
                  onClick={() => setStep(prev => prev + 1)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-full text-base flex items-center gap-2"
                >
                  {t.next} <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          ) : (
            // STEP FINALE
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold">
                {t.final_title}
              </h2>
              <p className="text-lg text-slate-600">
                {t.final_text}
              </p>

              <a
                href="https://www.youtube.com/sportalcentro"
                target="_blank"
                rel="noreferrer"
                className="block w-full text-center px-4 py-4 bg-red-600 text-white font-semibold rounded-full text-lg hover:opacity-90"
              >
                {t.yt_button} — youtube.com/sportalcentro
              </a>

              <div className="mt-4">
                <label className="text-sm sm:text-base font-medium">{t.email_label}</label>
                <input
                  type="email"
                  placeholder={t.email_placeholder}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full mt-2 px-3 py-3 border rounded-xl text-base"
                />
                <button
                  onClick={handleEmailSubmit}
                  className="mt-3 px-4 py-3 bg-sky-600 text-white rounded-full w-full text-base font-semibold"
                >
                  {t.email_send}
                </button>
                {emailMessage && (
                  <p className="mt-2 text-sm sm:text-base text-slate-600">{emailMessage}</p>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={resetModule}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-base"
                >
                  {t.restart_quiz}
                </button>
                <button
                  onClick={onBackToCategories}
                  className="px-4 py-2 bg-white border text-slate-700 rounded-full text-base"
                >
                  {t.back_to_categories}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* RIGHT: data source & lista prodotti (admin tools) */}
      <aside className="col-span-12 lg:col-span-5 space-y-4">
        <div className="bg-white rounded-3xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-sm text-slate-500">{t.data_source}</div>
              <div className="text-base font-medium">
                {module.productsUrl ? t.remote_json : t.local_fallback}
              </div>
            </div>
            <div className="text-xs sm:text-sm text-slate-400 text-right">
              <div>
                {t.last_fetch}: {lastFetched ? lastFetched : "—"}
              </div>
              <div className="text-amber-600 text-xs sm:text-sm">
                {sourceError
                  ? `${t.status_error}: ${sourceError}`
                  : loadingSource
                  ? t.status_loading
                  : t.status_ok}
              </div>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mb-2">{t.json_hint}</p>
          <textarea
            value={pasteJson}
            onChange={e => setPasteJson(e.target.value)}
            rows={4}
            className="w-full mt-1 p-2 border rounded-md text-xs sm:text-sm"
            placeholder='[ { "id": "x", "brand": "Brand", "model": "Model", "tags": ["allround"] } ]'
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={applyPastedJson}
              className="px-3 py-2 rounded-full bg-emerald-600 text-white flex items-center gap-2 text-xs sm:text-sm"
            >
              <Upload size={16} />
              {t.upload_json}
            </button>
            <button
              onClick={() => {
                setPasteJson("");
                setSourceError(null);
                setProducts(module.defaultProducts || []);
              }}
              className="px-3 py-2 rounded-full border text-xs sm:text-sm"
            >
              {t.cancel_json}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="text-base font-medium">{t.products_list_title}</div>
            <div className="text-xs sm:text-sm text-slate-400">
              {t.products_loaded}: {products.length}
            </div>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-3 max-h-64 overflow-auto">
            {products.map(p => (
              <div key={p.id} className="p-3 border rounded-2xl bg-slate-50">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="font-semibold text-sm sm:text-base">
                      {p.brand} {p.model || p.name}
                    </div>
                    {p.notes && (
                      <div className="text-xs sm:text-sm text-slate-500">{p.notes}</div>
                    )}
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-400 text-right">
                    {p.tags && p.tags.length ? p.tags.join(", ") : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

// =============================================================
// 4️⃣ COMPONENTE PRINCIPALE — Layout app-style + multilingua
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
      className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50 text-slate-900"
      style={{
        fontFamily: appFont,
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)"
      }}
    >
      <div className="flex flex-col min-h-screen">
        {/* HEADER APP STYLE */}
        <header className="sticky top-0 z-20 bg-gradient-to-b from-sky-50/95 via-sky-50/95 to-sky-50/90 backdrop-blur border-b border-slate-100 px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                {t.app_title}
              </h1>
              <p className="text-base sm:text-lg text-slate-600 mt-1">
                {t.app_subtitle}
              </p>
            </div>
            <div className="shrink-0">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm border border-slate-200">
                <Globe2 size={18} className="text-slate-500" />
                <select
                  value={lang}
                  onChange={e => setLang(e.target.value)}
                  className="text-xs sm:text-sm bg-transparent outline-none"
                >
                  <option value="it">IT</option>
                  <option value="en">EN</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 px-4 pb-6 pt-3">
          {!activeModule ? (
            <div className="space-y-4">
              <div className="mt-1 mb-3">
                <h2 className="text-2xl font-semibold">
                  {t.category_title}
                </h2>
                <p className="text-base text-slate-600 mt-1">
                  {t.category_subtitle}
                </p>
              </div>

              {/* Pulsanti categoria FULL WIDTH, uno sotto l'altro */}
              <div className="flex flex-col gap-4">
                {MODULES.map(mod => (
                  <motion.button
                    key={mod.id}
                    onClick={() => setActiveModuleId(mod.id)}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                    className="w-full bg-white shadow-md border border-slate-100 rounded-full overflow-hidden flex items-center p-3 pr-4 active:scale-95 transition-transform"
                    style={{ minHeight: "75px" }}
                  >
                    <div className="h-14 w-14 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                      <img
                        src={mod.image}
                        alt={mod.getLabel(t)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-3 flex-1 text-left">
                      <div className="text-lg sm:text-xl font-semibold">
                        {mod.getLabel(t)}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-600">
                        {mod.getDescription(t)}
                      </div>
                    </div>
                    <div className="ml-2 text-sky-600 text-base sm:text-lg font-semibold flex items-center gap-1">
                      {t.choose_category}
                      <ArrowRight size={18} />
                    </div>
                  </motion.button>
                ))}
              </div>
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
        <footer className="px-4 pb-4 pt-2 text-[11px] sm:text-xs text-slate-500 text-center">
          Progettato per <strong>Sport al centro</strong> — ottimizzato per smartphone 📱
        </footer>
      </div>
    </div>
  );
}
