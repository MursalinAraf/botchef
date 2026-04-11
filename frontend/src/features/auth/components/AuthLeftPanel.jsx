export default function AuthLeftPanel({ title, subtitle, features }) {
  return (
    <div
      className="flex flex-col justify-between px-10 py-12"
      style={{ background: "#059669" }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
          style={{ background: "rgba(255,255,255,0.2)" }}
        >
          🍕
        </div>
        <span className="text-white font-medium text-lg">BotChef</span>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-medium text-white leading-snug">
          {title}
        </h2>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "rgba(255,255,255,0.8)" }}
        >
          {subtitle}
        </p>
        <div className="flex flex-col gap-3 mt-2">
          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3 text-sm"
              style={{ color: "rgba(255,255,255,0.9)" }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
              {feature}
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
        © 2026 BotChef
      </p>
    </div>
  );
}
