import type { InputHTMLAttributes, ReactNode } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hint?: ReactNode;
  trailing?: ReactNode;
};

/** Champ à label flottant, façon connexion Google : le label se loge dans la
 * bordure dès que le champ a le focus ou une valeur. Le placeholder n'apparaît
 * qu'au focus, pour servir d'exemple sans se superposer au label. */
export function AuthField({ id, label, hint, trailing, className = "", placeholder, value, ...props }: Props) {
  const filled = value !== undefined && String(value).length > 0;
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div>
      <div className="relative">
        <input
          id={id}
          value={value}
          placeholder={placeholder ?? " "}
          aria-describedby={hintId}
          className={`peer h-14 w-full rounded border border-black/25 bg-white px-4 text-base text-ink outline-none transition-[border-color,box-shadow] placeholder:text-transparent hover:border-black/50 focus:border-accent focus:shadow-[inset_0_0_0_1px_var(--color-accent)] focus:placeholder:text-muted/60 ${className}`}
          {...props}
        />
        <label
          htmlFor={id}
          className={`pointer-events-none absolute start-3 -translate-y-1/2 bg-white px-1 text-muted transition-all duration-150 peer-focus:top-0 peer-focus:text-xs peer-focus:text-accent peer-autofill:top-0 peer-autofill:text-xs ${
            filled ? "top-0 text-xs" : "top-1/2 text-base"
          }`}
        >
          {label}
        </label>
        {trailing}
      </div>
      {hint && (
        <p id={hintId} className="mt-1.5 ps-4 text-xs text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
