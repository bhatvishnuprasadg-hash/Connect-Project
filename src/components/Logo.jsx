export default function Logo({ size = "md", light = false }) {
  const sizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-5xl md:text-6xl",
  };
  return (
    <span
      className={`font-display font-extrabold tracking-tight ${sizes[size]} inline-flex items-baseline`}
    >
      <span className="text-gold-400">C</span>
      <span className="relative inline-block">
        <span
          className={`absolute -top-[0.55em] left-1/2 -translate-x-1/2 h-[0.18em] w-[0.18em] rounded-full border-2 ${
            light ? "border-white" : "border-violet-500"
          }`}
        />
        o
      </span>
      <span className={light ? "text-white" : "text-ink-900"}>nnect</span>
    </span>
  );
}
