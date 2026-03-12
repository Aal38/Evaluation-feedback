import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

/* ───────────────────────────────────────────
Composants
────────────────────────────────────────────── */
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

/* ───────────────────────────────────────────
Données
────────────────────────────────────────────── */
const objectifs = [
  { id: 1, titre: "Avr-Juin", description: "✅ Finalisation Validation report tool", trimestre: 1 },
  {
    id: 2,
    titre: "Juil-Sep",
    description: "✅ QA30 : Validation report tool\n✅ PM tool key user\n✅ Vacances",
    trimestre: 2
  },
  {
    id: 3,
    titre: "Oct-Dec",
    description:
      "✅ Dashboard librairie Prog & Val\n🕒 Ressources Allocation & Workload Planning Gantt tool basé sur le PM tool\n🕒 Gamp 5 - Risk & traceability : réunions de lancement, partage des idées...",
    trimestre: 3,
  },
  {
    id: 4,
    titre: "Janv-Mars",
    description:
      "✅ Ressources Allocation & Workload Planning Gantt tool basé sur le PM tool\n🕒 Alertes mails temps consommés dans PM tool\n🕒 Gamp 5 - Risk & traceability : implication encore limité de notre côté, en cours",
    trimestre: 4,
  },
];

const TRIMESTRES = ["T1", "T2", "T3", "T4"];
const POSITIONS = [0, 33.333, 66.666, 100];
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

function Description({ text }) {
  return <span style={{ whiteSpace: "pre-line" }}>{text}</span>;
}

/* ───────────────────────────────────────────
Mini Jeu
────────────────────────────────────────────── */
export default function MiniJeuObjectifs() {
  const [qIndex, setQIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  const musicRef = useRef(null);
  const starRef = useRef(null);

  /* Sons */
  useEffect(() => {
    musicRef.current = new Audio("/mario.mp3");
    musicRef.current.loop = true;
    musicRef.current.volume = 0.3;
    musicRef.current.muted = muted;

    starRef.current = new Audio("/star.mp3");
    starRef.current.volume = 0.8;
    starRef.current.muted = muted;

    musicRef.current.play()
      .then(() => setAudioReady(true))
      .catch(() => setAudioReady(false));

    return () => {
      try {
        musicRef.current && musicRef.current.pause();
      } catch {}
    };
  }, []);

  useEffect(() => {
    if (musicRef.current) musicRef.current.muted = muted;
    if (starRef.current) starRef.current.muted = muted;
  }, [muted]);

  useEffect(() => {
    if (qIndex === 3 && starRef.current) {
      starRef.current.currentTime = 0;
      starRef.current.play().catch(() => {});
    }
  }, [qIndex]);

  const objectifsCourants = useMemo(
    () => objectifs.filter((o) => o.trimestre === qIndex + 1),
    [qIndex]
  );

  /* Navigation clavier */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") setQIndex((i) => clamp(i - 1, 0, 3));
      if (e.key === "ArrowRight") setQIndex((i) => clamp(i + 1, 0, 3));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Premier clic → débloque audio */
  useEffect(() => {
    const startAudio = () => {
      if (musicRef.current && !audioReady && !muted) {
        musicRef.current.play().then(() => setAudioReady(true)).catch(() => {});
      }
      window.removeEventListener("pointerdown", startAudio);
      window.removeEventListener("keydown", startAudio);
    };
    window.addEventListener("pointerdown", startAudio);
    window.addEventListener("keydown", startAudio);
  }, [audioReady, muted]);

  return (
    <div className="w-full min-h-[520px] flex flex-col items-center p-6 gap-6 select-none">

      {/* HEADER */}
      <div className="w-full max-w-3xl flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Mini‑app Objectifs JC par Trimestre
        </h1>

        <Button variant="ghost" onClick={() => setMuted(m => !m)}>
          {muted ? "🔇 Muet" : "🔊 Son"}
        </Button>
      </div>

      {/* TIMELINE */}
      <div className="relative w-full max-w-3xl mt-2">
        <div className="relative h-28">

          {/* BARRE */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 bg-slate-300 rounded-full" />

          {/* MARQUEURS */}
          {TRIMESTRES.map((label, i) => (
            <div key={label} className="absolute top-1/2 -translate-y-1/2" style={{ left: `${POSITIONS[i]}%` }}>
              <div className="w-0.5 h-6 bg-slate-500 mx-auto" />
              <div className={`text-xs mt-2 text-center ${qIndex === i ? "font-semibold" : ""}`}>
                {label}
              </div>
            </div>
          ))}

          {/* PERSONNAGE — SANS ANIMATION 😄 */}
          <motion.div
            initial={false}
            animate={{ left: `${POSITIONS[qIndex]}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute bottom-0 -translate-x-1/2 text-4xl"
          >
            👨🏻‍💻
          </motion.div>

          {/* PANCARTE */}
          <motion.div
            key={qIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-28"
            style={{ left: `min(max(${POSITIONS[qIndex]}%, 10%), 90%)` }}
          >
            <Card className="border-amber-700 bg-amber-100 border-2 shadow-xl min-w-[260px] max-w-[360px]">
				<CardContent>
				  {/* Titre pancarte en plus petit */}
				  <div className="text-sm font-semibold text-amber-900">
					{TRIMESTRES[qIndex]} • Objectifs
				  </div>

				  <ul className="mt-2 space-y-2">
					{objectifsCourants.map(o => (
					  <li key={o.id}>
						{/* Titre objectif plus petit */}
						<div className="text-sm font-semibold">{o.titre}</div>

						{/* Description en XS */}
						<div className="text-xs leading-snug opacity-90">
						  <Description text={o.description} />
						</div>
					  </li>
					))}
				  </ul>
				</CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* BOUTONS */}
      <div className="flex gap-4">
        <Button onClick={() => setQIndex(i => clamp(i - 1, 0, 3))} disabled={qIndex === 0} variant="secondary">
          ← Précédent
        </Button>
        <Button onClick={() => setQIndex(i => clamp(i + 1, 0, 3))} disabled={qIndex === 3}>
          Suivant →
        </Button>
      </div>

      <p className="text-xs text-slate-500 mt-2">
        Astuce : utilise les flèches du clavier pour faire avancer le personnage.
      </p>

      {/* ÉTOILE FINALE */}
      {qIndex === 3 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          transition={{ duration: 1 }}
          className="mt-6 text-center"
        >
          <div className="text-6xl drop-shadow-lg">⭐</div>
          <div className="text-xl mt-3 font-semibold">
            Adopt AI & learn new technologies !
          </div>
        </motion.div>
      )}

    </div>
  );
}