import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, RefreshCw, CloudLightning, Upload } from "lucide-react";

// Single-file React component. TailwindCSS required in the host environment.
// Features:
// - Interactive question flow (wing / surf / pumping), weight, level, conditions, style, budget
// - Support for future text-only steps (type: "text")
// - Video YouTube step just before the suggested results
// - Background-updatable product source via a JSON URL (polling) + manual paste/upload
// - Outputs concrete product suggestions drawn from the provided product list
// - Clean, modern UI with cards, progress, and small animations

const DEFAULT_PRODUCTS = [
  {
    id: "ind-barracuda",
    brand: "Indiana",
    model: "Barracuda",
    type: "wing|surf",
    notes: "High-aspect, ottima per glide e light wind/downwind.",
    recommended_for: ["wing_lightwind", "downwind", "glide"],
    front_surface_cm2: 1200,
    url: "https://indiana-paddlesurf.com/",
    image_url: "https://via.placeholder.com/300x300?text=Barracuda",
    price: "€1.490",
    discount_code: "SPORTALCENTRO10",
  },
  {
    id: "ind-ride",
    brand: "Indiana",
    model: "Ride",
    type: "allaround",
    notes: "Entry/versatile: facile decollo, buona stabilita' per principianti.",
    recommended_for: ["allaround", "beginner"],
    front_surface_cm2: 1400,
    url: "https://indiana-paddlesurf.com/",
    image_url: "https://via.placeholder.com/300x300?text=Ride",
    price: "€1.190",
    discount_code: "SPORTALCENTRO10",
  },
  {
    id: "sab-leviathan",
    brand: "Sabfoil",
    model: "Leviathan",
    type: "pumping|sup|downwind",
    notes: "Grande lift, pensata per pumping, SUP-foil e vento leggero.",
    recommended_for: ["pumping", "sup", "lightwind"],
    front_surface_cm2: 1750,
    url: "https://sabfoil.com/",
    image_url: "https://via.placeholder.com/300x300?text=Leviathan",
    price: "€1.690",
    discount_code: "SPORTALCENTRO10",
  },
  {
    id: "sab-razor",
    brand: "Sabfoil",
    model: "Razor",
    type: "surf",
    notes: "Reattiva e veloce, ottima per surf-foil e carving in onda.",
    recommended_for: ["surf", "carving"],
    front_surface_cm2: 775,
    url: "https://sabfoil.com/",
    image_url: "https://via.placeholder.com/300x300?text=Razor",
    price: "€990",
    discount_code: "SPORTALCENTRO10",
  },
  {
    id: "sab-kraken",
    brand: "Sabfoil",
    model: "Kraken",
    type: "modular",
    notes: "Sistema modulare: mast/fuselage compatibile con piu' ali per costruire un quiver.",
    recommended_for: ["modular", "quiver"],
    front_surface_cm2: null,
    url: "https://sabfoil.com/",
    image_url: "https://via.placeholder.com/300x300?text=Kraken",
    price: "€2.190",
    discount_code: "SPORTALCENTRO10",
  },
  {
    id: "ind-marlin",
    brand: "Indiana",
    model: "Marlin",
    type: "allaround",
    notes: "Versatile, buon equilibrio tra lift e reattivita'.",
    recommended_for: ["allaround", "intermediate"],
    front_surface_cm2: 1350,
    url: "https://indiana-paddlesurf.com/",
    image_url: "https://via.placeholder.com/300x300?text=Marlin",
    price: "€1.390",
    discount_code: "SPORTALCENTRO10",
  },
];

const DEFAULT_SOURCE = {
  url: "",
  polling: 15000, // ms
};

const VIDEO_EMBED_URL = "https://www.youtube.com/embed/g5C-IeVy2e4";

export default function HydrofoilSelector() {
  const [step, setStep] = useState(0); // 0..QUESTIONS.length-1 = domande, QUESTIONS.length = video, > = risultati
  const [answers, setAnswers] = useState({});
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);

  const [sourceUrl, setSourceUrl] = useState(DEFAULT_SOURCE.url);
  const [pollingMs, setPollingMs] = useState(DEFAULT_SOURCE.polling);
  const [lastFetched, setLastFetched] = useState(null);
  const pollingRef = useRef(null);
  const [loadingSource, setLoadingSource] = useState(false);
  const [sourceError, setSourceError] = useState(null);
  const [pasteJson, setPasteJson] = useState("");

  const QUESTIONS = [
    { id: "sport", type: "choice", q: "Quale attività vuoi praticare principalmente?", opts: ["Wing Foil", "Surf Foil", "Pumping / SUP"] },
    { id: "weight", type: "choice", q: "Quanto pesi?", opts: ["<60 kg", "60-75 kg", "75-90 kg", ">90 kg"] },
    { id: "level", type: "choice", q: "Qual è il tuo livello?", opts: ["Principiante", "Intermedio", "Avanzato"] },
    { id: "conditions", type: "choice", q: "In quali condizioni userai principalmente il foil?", opts: ["Vento leggero / acqua piatta", "Vento medio", "Onde / surf"] },
    { id: "style", type: "choice", q: "Che stile preferisci?", opts: ["Cruising / Glide", "Carving / Surf", "Pump / Efficienza"] },
    { id: "budget", type: "choice", q: "Budget indicativo?", opts: ["<800€", "800-1500€", "1500-2500€", ">2500€"] },
  ];

  const TOTAL_STEPS = QUESTIONS.length + 2; // domande + video + risultati

  useEffect(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (sourceUrl) {
      fetchSource();
      pollingRef.current = setInterval(fetchSource, pollingMs);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceUrl, pollingMs]);

  async function fetchSource() {
    if (!sourceUrl) return;
    setLoadingSource(true);
    setSourceError(null);
    try {
      const res = await fetch(sourceUrl, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
        setLastFetched(new Date().toISOString());
      } else {
        throw new Error("Formato JSON inatteso: atteso array di prodotti");
      }
    } catch (err) {
      console.warn("fetchSource error", err);
      setSourceError(String(err));
    } finally {
      setLoadingSource(false);
    }
  }

  function answer(id, value) {
    setAnswers(prev => ({ ...prev, [id]: value }));
    setStep(prev => prev + 1);
  }

  function back() {
    setStep(prev => Math.max(prev - 1, 0));
  }

  function reset() {
    setStep(0);
    setAnswers({});
  }

  function matchProducts() {
    const tokens = [];
    const s = (answers.sport || "").toLowerCase();
    if (s.includes("wing")) tokens.push("wing", "lightwind");
    if (s.includes("surf")) tokens.push("surf");
    if (s.includes("pumping") || s.includes("sup")) tokens.push("pumping", "sup");

    const style = (answers.style || "").toLowerCase();
    if (style.includes("glide")) tokens.push("glide", "downwind");
    if (style.includes("carv")) tokens.push("carving");
    if (style.includes("pump")) tokens.push("pumping");

    const level = (answers.level || "").toLowerCase();
    if (level.includes("princip")) tokens.push("beginner");
    if (level.includes("inter")) tokens.push("intermediate");

    const cond = (answers.conditions || "").toLowerCase();
    if (cond.includes("leggero")) tokens.push("lightwind");
    if (cond.includes("onde")) tokens.push("surf");

    const weight = answers.weight || "";
    if (weight.includes("<60")) tokens.push("light");
    if (weight.includes("60-75")) tokens.push("medium");
    if (weight.includes("75-90")) tokens.push("heavy");
    if (weight.includes(">90")) tokens.push("veryheavy");

    const scored = products.map(p => {
      let score = 0;
      const rec = (p.recommended_for || []).map(x => String(x).toLowerCase());
      tokens.forEach(t => {
        if (rec.includes(t)) score += 2;
        if ((p.type || "").toLowerCase().includes(t)) score += 1;
      });
      if (rec.includes("allaround") && tokens.includes("beginner")) score += 1;
      return { product: p, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const top = scored.filter(s => s.score > 0).slice(0, 3).map(s => s.product);
    if (top.length === 0) {
      return products.slice(0, 2);
    }
    return top;
  }

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

  const suggestions = step > QUESTIONS.length ? matchProducts() : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight">Hydrofoil Selector</h1>
            <p className="text-sm text-slate-600 mt-1">
              Quiz guidato per scegliere l&apos;hydrofoil giusto (wing / surf / pumping).
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-2 rounded-2xl shadow"
              onClick={() => {
                fetchSource();
              }}
              title="Aggiorna ora dalla source URL"
            >
              <RefreshCw size={16} />
              <span className="text-xs">Aggiorna source</span>
            </button>
            <div className="text-right text-xs text-slate-500">
              <div>Last: {lastFetched || "mai"}</div>
              <div className="text-amber-600">
                {sourceError ? `Errore: ${sourceError}` : loadingSource ? "fetching..." : "ok"}
              </div>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-12 gap-6">
          {/* Left: quiz + video + risultati */}
          <section className="col-span-12 lg:col-span-7 bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-slate-500">Progress</div>
                <div className="text-sm font-medium">
                  Passo {Math.min(step + 1, TOTAL_STEPS)} di {TOTAL_STEPS}
                </div>
              </div>
              <div className="text-xs text-slate-400">Prodotti caricati: {products.length}</div>
            </div>

            <div className="mt-4">
              {step < QUESTIONS.length ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {(() => {
                    const current = QUESTIONS[step];

                    if (current.type === "text") {
                      return (
                        <>
                          <h2 className="text-lg font-semibold">{current.q}</h2>
                          {current.content && (
                            <p className="text-sm text-slate-600 mt-2">{current.content}</p>
                          )}
                          <div className="flex items-center justify-between mt-6">
                            <button
                              onClick={back}
                              disabled={step === 0}
                              className="px-3 py-2 rounded-md text-sm bg-slate-100 disabled:opacity-50"
                            >
                              Indietro
                            </button>
                            <button
                              onClick={() => setStep(step + 1)}
                              className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm"
                            >
                              Continua
                            </button>
                          </div>
                        </>
                      );
                    }

                    return (
                      <>
                        <h2 className="text-lg font-semibold">{current.q}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                          {current.opts.map(opt => (
                            <button
                              key={opt}
                              onClick={() => answer(current.id, opt)}
                              className="text-left p-3 rounded-lg border hover:shadow-sm hover:scale-[1.01] transition-transform bg-gradient-to-br from-white to-slate-50"
                            >
                              <div className="font-medium">{opt}</div>
                              <div className="text-xs text-slate-500 mt-1">Seleziona per procedere</div>
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-6">
                          <button
                            onClick={back}
                            disabled={step === 0}
                            className="px-3 py-2 rounded-md text-sm bg-slate-100 disabled:opacity-50"
                          >
                            Indietro
                          </button>
                          <div className="text-xs text-slate-400">
                            Risposte salvate: {Object.keys(answers).length}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              ) : step === QUESTIONS.length ? (
                // Step video prima dei risultati
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-semibold">Guarda il video prima dei risultati</h2>
                  <p className="text-sm text-slate-600">
                    Prima di vedere i risultati consigliati, dai un&apos;occhiata a questo video
                    introduttivo che approfondisce la scelta dell&apos;hydrofoil.
                  </p>
                  <div className="aspect-video w-full overflow-hidden rounded-xl border bg-black">
                    <iframe
                      className="w-full h-full"
                      src={VIDEO_EMBED_URL}
                      title="Video YouTube - Hydrofoil"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <button
                      onClick={back}
                      className="px-3 py-2 rounded-md text-sm bg-slate-100"
                    >
                      Indietro
                    </button>
                    <button
                      onClick={() => setStep(step + 1)}
                      className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm flex items-center gap-2"
                    >
                      Vai ai risultati <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                // Risultati consigliati
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <h2 className="text-xl font-semibold">Risultati consigliati</h2>
                  <p className="text-sm text-slate-600">
                    In base alle tue risposte, ecco i prodotti suggeriti con motivazione rapida.
                  </p>

                  <div className="grid grid-cols-1 gap-4 mt-4">
                    {suggestions.map(p => (
                      <article
                        key={p.id}
                        className="p-4 rounded-lg border bg-gradient-to-br from-white to-slate-50"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                            {p.image_url ? (
                              <img
                                src={p.image_url}
                                alt={p.model}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                                No image
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold">
                              {p.brand} {p.model}
                            </div>
                            <div className="text-sm text-slate-500 mt-1">{p.notes}</div>
                            <div className="text-xs text-slate-400 mt-2">
                              Surface: {p.front_surface_cm2 || "—"} cm²
                            </div>
                            {p.price && (
                              <div className="text-sm text-emerald-600 font-semibold mt-1">
                                Prezzo con coupon incluso: {p.price}
                              </div>
                            )}
                            {p.discount_code && (
                              <div className="mt-2 px-2 py-1 bg-yellow-200 text-yellow-900 rounded-md text-sm font-semibold">
                                Codice sconto: {p.discount_code}
                              </div>
                            )}
                            <a
                              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-sky-600"
                              href={p.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Vedi scheda <ArrowRight size={14} />
                            </a>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={reset}
                      className="px-4 py-2 bg-sky-600 text-white rounded-lg"
                    >
                      Ricomincia quiz
                    </button>
                    <button
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      className="px-4 py-2 bg-white border rounded-lg"
                    >
                      Torna su
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </section>

          {/* Right: source & products */}
          <aside className="col-span-12 lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">Data source</div>
                  <div className="font-medium">URL / JSON</div>
                </div>
                <div className="text-xs text-slate-400">AutoPoll: {pollingMs / 1000}s</div>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2">
                <input
                  value={sourceUrl}
                  onChange={e => setSourceUrl(e.target.value)}
                  placeholder="Inserisci URL JSON (es. https://example.com/foils.json)"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={pollingMs}
                    onChange={e => setPollingMs(Number(e.target.value) || 1000)}
                    className="w-32 px-3 py-2 border rounded-lg text-sm"
                  />
                  <button
                    onClick={() => {
                      fetchSource();
                    }}
                    className="px-3 py-2 rounded-lg bg-sky-600 text-white flex items-center gap-2"
                  >
                    <CloudLightning size={16} />
                    Fetch
                  </button>
                </div>
                <div className="text-xs text-slate-400">
                  Suggerimento: pubblica un array JSON di prodotti con campi: id, brand, model, type,
                  notes, recommended_for (array), front_surface_cm2, url, image_url, price, discount_code
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Prodotti disponibili</div>
                <div className="text-xs text-slate-400">{products.length} items</div>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 max-h-64 overflow-auto">
                {products.map(p => (
                  <div key={p.id} className="p-3 border rounded-lg bg-slate-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">
                          {p.brand} {p.model}
                        </div>
                        <div className="text-xs text-slate-500">{p.notes}</div>
                      </div>
                      <div className="text-xs text-slate-400">
                        {p.front_surface_cm2 || "—"} cm²
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <label className="block text-xs text-slate-500">
                  Incolla qui il JSON dei prodotti (preview rapida)
                </label>
                <textarea
                  value={pasteJson}
                  onChange={e => setPasteJson(e.target.value)}
                  rows={6}
                  className="w-full mt-2 p-2 border rounded-md text-sm"
                  placeholder='[ { "id":"x", "brand":"Sabfoil", "model":"X" } ]'
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={applyPastedJson}
                    className="px-3 py-2 rounded-lg bg-emerald-600 text-white flex items-center gap-2"
                  >
                    <Upload size={14} />
                    Applica JSON
                  </button>
                  <button
                    onClick={() => {
                      setPasteJson("");
                      setSourceError(null);
                    }}
                    className="px-3 py-2 rounded-lg border"
                  >
                    Annulla
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-md text-sm text-slate-600">
              <div className="font-medium mb-2">Suggerimenti rapidi (mapping usato dal quiz)</div>
              <ul className="list-disc pl-5 space-y-1">
                <li>Wing/lightwind → prodotti con high-aspect, grandi superfici (es. Barracuda, Leviathan)</li>
                <li>Beginner / all-around → ali "Ride" o modelli polivalenti</li>
                <li>Surf / carving → Razor / ali a basso volume e alta reattività</li>
                <li>Vuoi cambiare spesso disciplina → opta per sistema modulare (Kraken)</li>
              </ul>
            </div>
          </aside>
        </main>

        <footer className="mt-8 text-xs text-slate-500 text-center">
          Progettato per "Sport al centro" — modifica il JSON di prodotto per aggiornare i suggerimenti in tempo reale.
        </footer>
      </div>
    </div>
  );
}
