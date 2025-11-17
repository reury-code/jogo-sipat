interface HintBannerProps {
  message: string;
  icon?: string;
}

export default function HintBanner({ message, icon = "💡" }: HintBannerProps) {
  return (
    <div className="h-14 bg-gradient-to-r from-slate-800/80 via-slate-700/80 to-slate-800/80 border-t border-cyan-400/50 shadow-lg">
      <div className="h-full max-w-7xl mx-auto flex items-center justify-center gap-3 px-4">
        <span className="text-2xl animate-pulse-soft">{icon}</span>
        <p className="font-game-title text-white text-lg text-center">
          {message}
        </p>
      </div>
    </div>
  );
}
