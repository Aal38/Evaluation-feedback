
export function Card({ className = '', children }) {
  return <div className={`rounded-xl border border-slate-200 bg-white ${className}`}>{children}</div>;
}
export function CardContent({ className = '', children }) {
  return <div className={className}>{children}</div>;
}
