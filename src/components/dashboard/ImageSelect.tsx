import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export interface ImageOption {
  value: string;
  label: string;
  image: string;
}

export function ImageSelect({
  id,
  options,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  id?: string;
  options: ImageOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-surface-2 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-shadow duration-150 focus:border-ink focus:ring-4 focus:ring-ink/[0.08] disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-60"
      >
        <span className="flex min-w-0 items-center gap-2.5">
          {selected ? (
            <>
              <img
                src={selected.image}
                alt=""
                className="h-5 w-5 shrink-0 rounded-full bg-white object-contain"
              />
              <span className="truncate">{selected.label}</span>
            </>
          ) : (
            <span className="truncate text-muted-2">{placeholder}</span>
          )}
        </span>
        <ChevronDown size={16} className="shrink-0 text-muted-2" />
      </button>

      {open && !disabled && (
        <div className="absolute z-20 mt-1.5 max-h-64 w-full overflow-y-auto rounded-md border border-surface-2 bg-white py-1 shadow-lg">
          {options.length === 0 && (
            <p className="px-3.5 py-2.5 text-sm text-muted">Aucune option</p>
          )}
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-surface ${
                o.value === value ? "font-medium text-ink" : "text-ink"
              }`}
            >
              <img
                src={o.image}
                alt=""
                className="h-5 w-5 shrink-0 rounded-full bg-white object-contain"
              />
              <span className="min-w-0 flex-1 truncate">{o.label}</span>
              {o.value === value && <Check size={15} className="shrink-0 text-ink" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
