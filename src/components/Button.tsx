import { useThemeContext } from '../contexts/ThemeContext';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

export default function Button({ label, onClick }: ButtonProps) {
  const { theme } = useThemeContext();

  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-2 ml-2 font-semibold rounded-lg shadow-md 
        ${theme === 'white' ? 'text-black bg-white hover:bg-gray-200' : 'text-white bg-gray-700 hover:bg-gray-600'}
      `}
    >
      {label}
    </button>
  );
}
