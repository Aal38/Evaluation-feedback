import { useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";

// Composants simples
function Card({ children, className = "" }) {
  return <div className={"rounded-xl border bg-white shadow " + className}>{children}</div>;
}
function CardContent({ children }) {
  return <div className="p-4">{children}</div>;
}
function Button({ children, disabled, variant = "primary", ...props }) {
  const base =
    "px-4 py-2 rounded-md text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-slate-200 hover:bg-slate-300",
  };
  return (
    <button disabled={disabled} className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}

// 🔥 Objectifs
const objectifs = [
  { id: 1, titre: "Avr-Juin", description: "✅ Validation report tool \n✅ QA30.", trimestre: 1 },
  { id: 2, titre: "Juil-Sep", description: "✅ PM tool key user \n✅ Vacances", trimestre: 2 },
  { id: 3, titre: "Oct-Dec", description: "✅ Dashboard librairie Prog & Val\n🕒 Ressources Allocation & Workload Planning Gantt tool basé sur le PM tool", trimestre: 3 },
  { id: 4, titre: "Janv-Mars", description: "✅ Ressources Allocation & Workload Planning Gantt tool basé sur le PM tool \n🕒 Alertes mail temps prog & Val dans pm tool", trimestre: 4 },
];

const TRIMESTRES = ["T1", "T2", "T3", "T4"];
const POSITIONS = [0, 33.333, 66.666, 100];

export default function MiniJeuObjectifs() {
  const [qIndex, setQIndex] = useState(0);

  // 🎵 Références audio
  const musicRef = useRef(null);
  const starSoundRef = useRef(null);

  // 🎵 Charger les sons et démarrer la musique
  useEffect(() => {
    musicRef.current = new Audio("/mario.mp3");
    musicRef.current.loop = true;
    musicRef.current.volume = 0.3;

    // Essayer de lire automatiquement
    musicRef.current.play().catch(() => {
      console.log("⚠ Autoplay bloqué, la musique jouera après interaction.");
    });

    starSoundRef.current = new Audio("/star.mp3");
    starSoundRef.current.volume = 0.8;
  }, []);

  // ⭐ Jouer le son étoile à T4
  useEffect(() => {
    if (qIndex === 3 && starSoundRef.current) {
      starSoundRef.current.currentTime = 0;
      starSoundRef.current.play();
    }
  }, [qIndex]);

  const objectifsCourants = useMemo(
    () => objectifs.filter((o) => o.trimestre === qIndex + 1),
    [qIndex]
  );

  // Navigation ← →
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") setQIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setQIndex((i) => Math.min(3, i + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="w-full min-h-[520px] flex flex-col items-center p-6 gap-6 select-none">
      <h1 className="text-3xl font-bold">Mini‑app synthetique : Objectifs annuels</h1>

      {/* Piste du temps */}
      <div className="relative w-full max-w-3xl mt-4">
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
              <div className="text-xs mt-2 text-center">{label}</div>
            </div>
          ))}

          {/* Personnage */}
          <motion.div
            initial={false}
            animate={{ left: `${POSITIONS[qIndex]}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute bottom-0 -translate-x-1/2 text-4xl"
          >
            🧑‍💻
          </motion.div>

          {/* Pancarte */}
          <motion.div
            key={qIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-24"
            style={{ left: `min(max(${POSITIONS[qIndex]}%, 10%), 90%)` }}
          >
            <Card className="border-amber-700 bg-amber-100 border-2 shadow-xl min-w-[260px] max-w-[360px]">
              <CardContent>
                <div className="font-bold text-amber-900">{TRIMESTRES[qIndex]} • Objectifs</div>

                {objectifsCourants.map((o) => (
                  <div key={o.id} className="mt-2">
                    <div className="font-semibold">{o.titre}</div>
                    <div className="text-sm">{o.description}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Boutons */}
      <div className="flex gap-4">
        <Button onClick={() => setQIndex(qIndex - 1)} disabled={qIndex === 0} variant="secondary">
          ← Précédent
        </Button>
        <Button onClick={() => setQIndex(qIndex + 1)} disabled={qIndex === 3}>
          Suivant →
        </Button>
      </div>

      <p className="text-xs text-slate-500">Astuce : Utilise aussi les flèches du clavier !</p>

      {/* ⭐ Étoile finale + message */}
      {qIndex === 3 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          transition={{ duration: 1 }}
          className="mt-10 text-center"
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