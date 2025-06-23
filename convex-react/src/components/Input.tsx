export function Input({
  type,
  placeholder,
  value,
  onChange,
  onBlur,
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
}
