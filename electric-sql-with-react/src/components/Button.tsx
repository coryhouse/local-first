type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      className="bg-light dark:bg-dark text-dark dark:text-light rounded-md p-2 border-2 border-slate-200 dark:border-slate-800 mr-2"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
