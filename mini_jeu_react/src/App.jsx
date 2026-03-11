
import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from './components/ui/card'
import { Button } from './components/ui/button'
import { motion } from 'framer-motion'

// ✅ Personnalise tes objectifs ci-dessous
const objectifs = [
  { id: 1, titre: 'Objectif 1', description: "Décrire le premier objectif de l'année.", trimestre: 1 },
  { id: 2, titre: 'Objectif 2', description: 'Deuxième objectif important à atteindre.', trimestre: 2 },
  { id: 3, titre: 'Objectif 3', description: 'Troisième étape clé dans ton année.', trimestre: 3 },
  { id: 4, titre: 'Objectif 4', description: "Quatrième objectif pour clôturer l'année.", trimestre: 4 },
]

const TRIMESTRES = ['T1', 'T2', 'T3', 'T4']
const POSITIONS = [0, 33.333, 66.666, 100]

export default function MiniJeuObjectifs() {
  const [qIndex, setQIndex] = useState(0)

  const objectifsAvecTrimestre = useMemo(() => {
    const hasQuarter = objectifs.some((o) => Object.prototype.hasOwnProperty.call(o, 'trimestre'))
    if (hasQuarter) return objectifs
    return objectifs.map((o, i) => ({ ...o, trimestre: (i % 4) + 1 }))
  }, [])

  const objectifsCourants = useMemo(
    () => objectifsAvecTrimestre.filter((o) => o.trimestre === qIndex + 1),
    [qIndex, objectifsAvecTrimestre]
  )

  const allerGauche = () => setQIndex((i) => Math.max(0, i - 1))
  const allerDroite = () => setQIndex((i) => Math.min(3, i + 1))

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); allerGauche() }
      else if (e.key === 'ArrowRight') { e.preventDefault(); allerDroite() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="w-full min-h-[520px] flex flex-col items-center justify-start p-6 gap-6 select-none">
      <motion.h1
        className="text-3xl font-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Mini-jeu : Tes objectifs annuels (← →)
      </motion.h1>

      {/* Piste temporelle */}
      <div className="relative w-full max-w-3xl mt-4">
        <div className="relative h-28">
          {/* Ligne principale */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-full shadow-inner" />

          {/* Repères trimestriels */}
          {TRIMESTRES.map((label, i) => (
            <div
              key={label}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `calc(${POSITIONS[i]}% - 1px)` }}
            >
              <div className="w-0.5 h-6 bg-slate-500 mx-auto" />
              <div className={`text-xs mt-2 text-center ${qIndex === i ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                {label}
              </div>
            </div>
          ))}

          {/* Personnage */}
          <motion.div
            aria-label="Personnage"
            initial={false}
            animate={{ left: `${POSITIONS[qIndex]}%` }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className="absolute bottom-0 -translate-x-1/2"
            style={{ width: 0 }}
          >
            <div className="mx-auto mb-1 h-2 w-12 rounded-full bg-black/10 blur-[1px]" />
            <div className="mx-auto text-4xl drop-shadow-sm">🧑‍💻</div>
          </motion.div>

          {/* Pancarte */}
          <motion.div
            key={`sign-${qIndex}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute -top-24"
            style={{ left: `min(max(${POSITIONS[qIndex]}%, 10%), 90%)` }}
          >
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-1/2 top-6 h-24 w-1.5 bg-amber-900 rounded-b" />

              <Card className="rotate-[-1.5deg] bg-amber-100 border-amber-700 border-2 shadow-xl min-w-[260px] max-w-[360px]">
                <CardContent className="p-4">
                  <div className="text-sm uppercase tracking-wider text-amber-900/80">{TRIMESTRES[qIndex]} • Objectifs</div>
                  {objectifsCourants.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-600">Aucun objectif affecté à ce trimestre.</p>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {objectifsCourants.map((o) => (
                        <li key={o.id}>
                          <div className="font-semibold text-slate-900">{o.titre}</div>
                          <div className="text-sm text-slate-700 leading-snug">{o.description}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contrôles */}
      <div className="flex items-center gap-3">
        <Button onClick={allerGauche} disabled={qIndex === 0} variant="secondary" aria-label="Trimestre précédent (flèche gauche)">← Précédent</Button>
        <span className="text-sm text-slate-600 select-none">{TRIMESTRES[qIndex]}</span>
        <Button onClick={allerDroite} disabled={qIndex === 3} aria-label="Trimestre suivant (flèche droite)">Suivant →</Button>
      </div>

      <p className="text-xs text-slate-500">Astuce : utilise les flèches du clavier pour faire avancer le personnage.</p>
    </div>
  )
}
