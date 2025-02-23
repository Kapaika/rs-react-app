import { useEffect, useState } from 'react';
import Button from './Button';
import { NavLink } from 'react-router';
import { useThemeContext } from '../contexts/themeContext';

interface TopControlsProps {
  getName: (name: string) => void;
}

export default function TopControls({ getName }: TopControlsProps) {
  const [searchValue, setSearchValue] = useState('');
  const { theme, setTheme } = useThemeContext();

  useEffect(() => {
    const storedQuery = localStorage.getItem('searchQuery');
    if (storedQuery) {
      setSearchValue(storedQuery);
    }
  }, []);

  const makeAnApicall = () => {
    getName(searchValue);
  };

  return (
    <div>
      <input
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        className={`
          px-4 py-2 font-semibold rounded-lg shadow-md 
          ${theme === 'white' ? 'text-black bg-white' : 'text-white bg-gray-700'}
        `}
      />

      <NavLink to={'/page/1'}>
        <Button label="Search" onClick={makeAnApicall} />
      </NavLink>

      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className={`
          ml-4 px-4 py-2 border rounded-lg 
          ${theme === 'white' ? 'text-black bg-white' : 'text-white bg-gray-700'}
        `}
      >
        <option value="white">Light Theme</option>
        <option value="gray">Dark Theme</option>
      </select>
    </div>
  );
}
