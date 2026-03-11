import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

// Composants simples pour remplacer shadcn/ui
function Card({ children, className = "" }) {
  return (
    <div className={`rounded-xl border border-slate-300 bg-white shadow ${className}`}>
      {children}
    </div>
  );
}
function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}
function Button({ children, variant = "primary", disabled, ...props }) {
  const base =
    "px-4 py-2 rounded-md text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-slate-200 hover:bg-slate-300",
  };
  return (
    <button
      className={`${base} ${variants[variant]}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

// 🔥 Tes objectifs annuels (modifiable)
const objectifs = [
  { id: 1, titre: "Objectif 1", description: "Décrire le premier objectif.", trimestre: 1 },
  { id: 2, titre: "Objectif 2", description: "Deuxième objectif important.", trimestre: 2 },
  { id: 3, titre: "Objectif 3", description: "Troisième étape clé.", trimestre: 3 },
  { id: 4, titre: "Objectif 4", description: "Quatrième objectif final.", trimestre: 4 },
];

// Trimestres + positions du personnage
const TRIMESTRES = ["T1", "T2", "T3", "T4"];
const POSITIONS = [0, 33.333, 66.666, 100];

export default function MiniJeuObjectifs() {
  const [qIndex, setQIndex] = useState(0);

  // Filtres objectifs par trimestre
  const objectifsCourants = useMemo(() => {
    return objectifs.filter((o) => o.trimestre === qIndex + 1);
  }, [qIndex]);

  // Navigation au clavier ← →
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") setQIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setQIndex((i) => Math.min(3, i + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="w-full flex flex-col items-center p-6 gap-8">
      <motion.h1
        className="text-3xl font-bold"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🎮 Mini‑jeu : Objectifs annuels
      </motion.h1>

      {/* Piste du temps */}
      <div className="relative w-full max-w-3xl mt-6">
        <div className="absolute left-0 right-0 top-1/2 h-2 bg-slate-200 rounded-full" />

        {/* Repères trimestriels */}
        {TRIMESTRES.map((label, i) => (
          <div
            key={label}
            className="absolute top-1/2 -translate-y-1/2 text-center"
            style={{ left: `${POSITIONS[i]}%` }}
          >
            <div className="w-1 h-6 mx-auto bg-slate-600" />
            <div className="mt-2 text-sm">{label}</div>
          </div>
        ))}

        {/* Personnage */}
        <motion.div
          animate={{ left: `${POSITIONS[qIndex]}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="absolute bottom-[-20px] -translate-x-1/2"
        >
          <div className="text-5xl">🧑‍💻</div>
        </motion.div>

        {/* Pancarte */}
        <motion.div
          key={qIndex}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-32"
          style={{
            left: `min(max(${POSITIONS[qIndex]}%, 10%), 90%)`,
          }}
        >
          <Card className="border-amber-600 bg-amber-100 p-2 rotate-[-1deg]">
            <CardContent>
              <div className="text-amber-900 font-bold text-sm">
                {TRIMESTRES[qIndex]} • Objectifs
              </div>
              <ul className="mt-2 space-y-1">
                {objectifsCourants.map((o) => (
                  <li key={o.id}>
                    <b>{o.titre}</b>
                    <div className="text-sm">{o.description}</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Boutons */}
      <div className="flex gap-4">
        <Button
          variant="secondary"
          disabled={qIndex === 0}
          onClick={() => setQIndex(qIndex - 1)}
        >
          ← Précédent
        </Button>
        <Button
          disabled={qIndex === 3}
          onClick={() => setQIndex(qIndex + 1)}
        >
          Suivant →
        </Button>
      </div>

      <div className="text-xs text-slate-500">
        Utilise aussi les flèches du clavier !
      </div>
    </div>
  );
}