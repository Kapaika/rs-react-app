interface ButtonProps {
  label: string;
  onClick: () => void;
}

export default function Button({ label, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2 ml-2 text-black font-semibold rounded-lg shadow-md"
    >
      {label}
    </button>
  );
}
