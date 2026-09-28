export default function StarRating({ value = 0, onChange, size = "text-base", readOnly = false }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className={`inline-flex items-center gap-0.5 ${size}`}>
      {stars.map((s) => (
        <button
          type="button"
          key={s}
          disabled={readOnly}
          onClick={() => onChange && onChange(s)}
          className={`${readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition leading-none ${
            s <= value ? "text-gold-500" : "text-ink-200"
          }`}
          aria-label={`${s} star`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
