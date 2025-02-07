import { useEffect, useState } from 'react';
import Button from './Button';

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
  }, [searchValue]);

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
      <Button label="Search" onClick={makeAnApicall}></Button>
    </>
  );
}
