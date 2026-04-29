interface Props {
  icon: string
  title: string
  subtitle?: string
}

export default function EmptyState({ icon, title, subtitle }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center animate-fade-in">
      <span className="text-5xl mb-4 block">{icon}</span>
      <h3 className="font-display text-xl text-olive-700 mb-2">{title}</h3>
      {subtitle && <p className="text-warm-gray text-sm">{subtitle}</p>}
    </div>
  )
}
