type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'solid' | 'line';
  disabled?: boolean;
  ariaLabel?: string;
};

const base =
  'inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 text-[15px] font-semibold ' +
  'transition-transform duration-150 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100';
const styles = {
  solid: 'bg-coral text-deep hover:-translate-y-0.5',
  line: 'border-[1.5px] border-[var(--ink-now)] text-[var(--ink-now)] hover:-translate-y-0.5',
};

export function Button({ children, href, onClick, variant = 'solid', disabled, ariaLabel }: Props) {
  const cls = `${base} ${styles[variant]}`;
  if (href)
    return (
      <a className={cls} href={href} target="_blank" rel="noreferrer" aria-label={ariaLabel}>
        {children}
      </a>
    );
  return (
    <button type="button" className={cls} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
