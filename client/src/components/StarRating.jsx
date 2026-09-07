export default function StarRating({ value, onChange, readOnly = false }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(n)}
          className={`text-lg ${n <= value ? "text-forest-600" : "text-moss-200"} ${readOnly ? "cursor-default" : "cursor-pointer"}`}
        >
          &#9733;
        </button>
      ))}
    </div>
  );
}
