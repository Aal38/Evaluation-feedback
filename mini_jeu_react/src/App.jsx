import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

/* ──────────────────────────────────────────────────────────────
   Composants simples (Card, CardContent, Button)
   ────────────────────────────────────────────────────────────── */
function Card({ children, className = "" }) {
  return <div className={"rounded-xl border bg-white shadow " + className}>{children}</div>;
}
function CardContent({ children }) {
  return <div className="p-4">{children}</div>;
}
function Button({ children, disabled, variant = "primary", className = "", ...props }) {
  const base =
    "px-4 py-2 rounded-md text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300",
    secondary: "bg-slate-200 hover:bg-slate-300 focus:ring-slate-300",
    ghost: "bg-transparent hover:bg-slate-100 focus:ring-slate-300",
  };
  return (
    <button disabled={disabled} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────
   Données
   ────────────────────────────────────────────────────────────── */
// 🔥 Tes objectifs (inchangés, juste &amp; et \n gérés plus bas)
const objectifs = [
  { id: 1, titre: "Avr-Juin", description: "✅ Validation report tool \n✅ QA30.", trimestre: 1 },
  { id: 2, titre: "Juil-Sep", description: "✅ PM tool key user \n✅ Vacances", trimestre: 2 },
  { id: 3, titre: "Oct-Dec", description: "✅ Dashboard librairie Prog & Val\n🕒 Ressources Allocation & Workload Planning Gantt tool basé sur le PM tool", trimestre: 3 },
  { id: 4, titre: "Janv-Mars", description: "✅ Ressources Allocation & Workload Planning Gantt tool basé sur le PM tool \n🕒 Alertes mail temps prog & Val dans pm tool", trimestre: 4 },
];

const TRIMESTRES = ["T1", "T2", "T3", "T4"];
const POSITIONS = [0, 33.333, 66.666, 100];

/* ──────────────────────────────────────────────────────────────
   Utilitaires
   ────────────────────────────────────────────────────────────── */
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

/** Convertit les sauts de ligne \n en <br /> et laisse & tel quel */
function Description({ text }) {
  return (
    <span style={{ whiteSpace: "pre-line" }}>
      {text}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────
   Composant principal
   ────────────────────────────────────────────────────────────── */
export default function MiniJeuObjectifs() {
  const [qIndex, setQIndex] = useState(0);          // 0..3
  const [muted, setMuted] = useState(false);        // gestion audio
  const [audioReady, setAudioReady] = useState(false);

  // 🎵 Références audio
  const musicRef = useRef(null);
  const starSoundRef = useRef(null);

  // 🎵 Charger les sons
  useEffect(() => {
    // IMPORTANT: placer ces fichiers dans /public (CodeSandbox/Vite)
    musicRef.current = new Audio("/mario.mp3");
    musicRef.current.loop = true;
    musicRef.current.volume = 0.3;
    musicRef.current.muted = muted;

    starSoundRef.current = new Audio("/star.mp3");
    starSoundRef.current.volume = 0.8;
    starSoundRef.current.muted = muted;

    // tentative d'autoplay (sera bloquée tant qu'il n'y a pas d'interaction)
    musicRef.current.play().then(() => {
      setAudioReady(true);
    }).catch(() => {
      setAudioReady(false);
      // L’autoplay est probablement bloqué — on activera au premier clic
    });

    return () => {
      try { musicRef.current && musicRef.current.pause(); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // on ne recharge pas à chaque muted pour garder la piste

  // mute/unmute
  useEffect(() => {
    if (musicRef.current) musicRef.current.muted = muted;
    if (starSoundRef.current) starSoundRef.current.muted = muted;
  }, [muted]);

  // Jouer le son étoile à T4
  useEffect(() => {
    if (qIndex === 3 && starSoundRef.current) {
      starSoundRef.current.currentTime = 0;
      starSoundRef.current.play().catch(() => {});
    }
  }, [qIndex]);

  // Objectifs du trimestre courant
  const objectifsCourants = useMemo(
    () => objectifs.filter((o) => o.trimestre === qIndex + 1),
    [qIndex]
  );

  // Navigation ← →
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") setQIndex((i) => clamp(i - 1, 0, 3));
      if (e.key === "ArrowRight") setQIndex((i) => clamp(i + 1, 0, 3));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Premier clic n'importe où => lancer la musique si besoin
  useEffect(() => {
    const onFirstInteract = () => {
      if (musicRef.current && !audioReady && !muted) {
        musicRef.current.play().then(() => setAudioReady(true)).catch(() => {});
      }
      window.removeEventListener("pointerdown", onFirstInteract);
      window.removeEventListener("keydown", onFirstInteract);
    };
    window.addEventListener("pointerdown", onFirstInteract);
    window.addEventListener("keydown", onFirstInteract);
    return () => {
      window.removeEventListener("pointerdown", onFirstInteract);
      window.removeEventListener("keydown", onFirstInteract);
    };
  }, [audioReady, muted]);

  return (
    <div className="w-full min-h-[520px] flex flex-col items-center p-6 gap-6 select-none">
      {/* Titre + contrôles audio */}
      <div className="w-full max-w-3xl flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">Mini‑app synthétique : Objectifs annuels</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setMuted((m) => !m)}>
            {muted ? "🔇 Muet" : "🔊 Son"}
          </Button>
        </div>
      </div>

      {/* Piste temporelle */}
      <div className="relative w-full max-w-3xl mt-2">
        <div className="relative h-28">
          {/* Ligne */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 bg-slate-300 rounded-full" />

          {/* Repères */}
          {TRIMESTRES.map((label, i) => (
            <div
              key={label}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${POSITIONS[i]}%` }}
            >
              <div className="w-0.5 h-6 bg-slate-500 mx-auto" />
              <div className={`text-xs mt-2 text-center ${qIndex === i ? "font-semibold" : ""}`}>{label}</div>
            </div>
          ))}

          {/* Personnage */}
          <motion.div
            role="img"
            aria-label="Personnage"
            initial={false}
            animate={{ left: `${POSITIONS[qIndex]}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute bottom-0 -translate-x-1/2 text-4xl"
          >
            <div className="mx-auto mb-1 h-2 w-12 rounded-full bg-black/10" />
            <div className="mx-auto">👨🏻‍💻</div>
          </motion.div>

          {/* Pancarte */}
          <motion.div
            key={qIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-28"
            style={{ left: `min(max(${POSITIONS[qIndex]}%, 10%), 90%)` }}
          >
            <Card className="border-amber-700 bg-amber-100 border-2 shadow-xl min-w-[260px] max-w-[360px]">
              <CardContent>
                <div className="font-bold text-amber-900">{TRIMESTRES[qIndex]} • Objectifs</div>
                {objectifsCourants.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-600">Aucun objectif affecté à ce trimestre.</p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {objectifsCourants.map((o) => (
                      <li key={o.id}>
                        <div className="font-semibold">{o.titre}</div>
                        <div className="text-sm leading-snug">
                          <Description text={o.description} />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Boutons bureau */}
      <div className="hidden sm:flex gap-4">
        <Button
          onClick={() => setQIndex((i) => clamp(i - 1, 0, 3))}
          disabled={qIndex === 0}
          variant="secondary"
          aria-label="Trimestre précédent (flèche gauche)"
        >
          ← Précédent
        </Button>
        <Button
          onClick={() => setQIndex((i) => clamp(i + 1, 0, 3))}
          disabled={qIndex === 3}
          aria-label="Trimestre suivant (flèche droite)"
        >
          Suivant →
        </Button>
      </div>

      {/* Boutons mobiles (visibles sur petits écrans) */}
      <div className="sm:hidden flex gap-2">
        <Button onClick={() => setQIndex((i) => clamp(i - 1, 0, 3))} disabled={qIndex === 0} variant="secondary">←</Button>
        <div className="px-2 py-2 text-sm bg-slate-100 rounded">{TRIMESTRES[qIndex]}</div>
        <Button onClick={() => setQIndex((i) => clamp(i + 1, 0, 3))} disabled={qIndex === 3}>→</Button>
      </div>

      {/* ⭐ Étoile finale + message */}
      {qIndex === 3 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          transition={{ duration: 1 }}
          className="mt-6 text-center"
        >
          <div className="text-6xl drop-shadow-lg">⭐</div>
          <div className="text-xl mt-3 font-semibold">Adopt AI & learn new technologies !</div>
        </motion.div>
      )}
    </div>
  );
}