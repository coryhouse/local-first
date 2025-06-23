export function Select({
  children,
  onChange,
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className="bg-light dark:bg-dark text-dark dark:text-light rounded-md p-2 border-2 border-slate-200 dark:border-slate-800 mr-2"
      onChange={onChange}
    >
      {children}
    </select>
  );
}
