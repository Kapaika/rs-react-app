import { useEffect, useState } from 'react';
import Button from './Button';
import { NavLink } from 'react-router';

interface TopControlsProps {
  getName: (name: string) => void;
}

export default function TopControls({ getName }: TopControlsProps) {
  const [searchValue, setSearchValue] = useState('');

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
    <>
      <input
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        className="px-50 py-3 text-black font-semibold rounded-lg shadow-md"
      ></input>
      <NavLink to={'/page/1'}>
        <Button label="Search" onClick={makeAnApicall}></Button>
      </NavLink>
    </>
  );
}
