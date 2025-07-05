export function Input({
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={`bg-light dark:bg-dark text-dark dark:text-light rounded-md p-2 border-2 border-slate-200 dark:border-slate-800 mr-2${className ? ` ${className}` : ""}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      {...rest}
    />
  );
}
