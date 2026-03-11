import { useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";

// ----------------------
// Objectifs
// ----------------------
const objectifs = [
  { id: 1, titre: "Objectif 1", description: "Décrire le premier objectif.", trimestre: 1 },
  { id: 2, titre: "Objectif 2", description: "Deuxième objectif important.", trimestre: 2 },
  { id: 3, titre: "Objectif 3", description: "Troisième étape clé.", trimestre: 3 },
  { id: 4, titre: "Objectif 4", description: "Quatrième objectif.", trimestre: 4 },
];

const TRIMESTRES = ["T1", "T2", "T3", "T4"];
const POSITIONS = [0, 33.333, 66.666, 100];

export default function App() {
  const [qIndex, setQIndex] = useState(0);
  const audioRef = useRef(null);

  // Lancer la musique une seule fois
  useEffect(() => {
    audioRef.current = new Audio("/mario.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    audioRef.current.play().catch(() => {
      console.log("Autoplay bloqué — l’utilisateur doit interagir.");
    });
  }, []);

  const objectifsCourants = useMemo(
    () => objectifs.filter((o) => o.trimestre === qIndex + 1),
    [qIndex]
  );

  const allerGauche = () => setQIndex((i) => Math.max(0, i - 1));
  const allerDroite = () => setQIndex((i) => Math.min(3, i + 1));

  // Contrôles clavier
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") allerGauche();
      if (e.key === "ArrowRight") allerDroite();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Mini‑jeu Objectifs</h1>

      {/* Personnage */}
      <div style={{ width: "100%", height: 120, position: "relative", marginTop: 40 }}>
        {/* Ligne */}
        <div style={{
          position: "absolute", top: "50%", height: 4, width: "100%",
          background: "#ccc", transform: "translateY(-50%)"
        }} />

        {/* Markers */}
        {TRIMESTRES.map((t, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${POSITIONS[i]}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center"
          }}>
            <div style={{ width: 2, height: 20, background: "#555" }} />
            <div style={{ marginTop: 5, fontSize: 12 }}>{t}</div>
          </div>
        ))}

        {/* Sprite */}
        <motion.div
          animate={{ left: `${POSITIONS[qIndex]}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          style={{
            position: "absolute",
            bottom: 0,
            transform: "translateX(-50%)",
            fontSize: 40
          }}
        >
          🧑‍💻
        </motion.div>
      </div>

      {/* Zone Objectifs */}
      <div style={{ marginTop: 40 }}>
        <h2>{TRIMESTRES[qIndex]} — Objectifs</h2>

        {objectifsCourants.map((o) => (
          <div key={o.id} style={{ marginBottom: 12 }}>
            <strong>{o.titre}</strong>
            <div>{o.description}</div>
          </div>
        ))}
      </div>

      {/* Boutons */}
      <div style={{ marginTop: 20 }}>
        <button onClick={allerGauche} disabled={qIndex === 0}>←</button>
        <button onClick={allerDroite} disabled={qIndex === 3}>→</button>
      </div>

      {/* ⭐ Animation finale */}
      {qIndex === 3 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.3, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            marginTop: 40,
            fontSize: 50,
            textAlign: "center",
            color: "#f1c40f",
            textShadow: "0 0 15px gold"
          }}
        >
          ⭐  
          <div style={{ fontSize: 24, marginTop: 10 }}>
            Adopt AI & learn new technologies !
          </div>
        </motion.div>
      )}
    </div>
  );
}
