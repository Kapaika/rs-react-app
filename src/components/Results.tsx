import { Outlet } from 'react-router';
import { Person } from '../model/Person';
import { useParams } from 'react-router';
import { NavLink } from 'react-router';
import { useState } from 'react';
import Pagination from './Pagination';
import { useThemeContext } from '../contexts/themeContext';

interface ResultsProps {
  initialItems: Person[] | null;
  initialNextPage: string | null;
  initialPreviousPage: string | null;
}

export default function Results({
  initialItems,
  initialNextPage,
  initialPreviousPage,
}: ResultsProps) {
  if (initialItems === null) {
    throw new Error();
  }
  const params = useParams();
  const isDescriptionOn = params.characterId ? true : false;
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<Person[]>(initialItems);
  const [currentPage, setCurrentPage] = useState<string | null>(
    params.pageId ?? '1'
  );
  const [nextPage, setNextPage] = useState<string | null>(initialNextPage);
  const [previousPage, setPreviousPage] = useState<string | null>(
    initialPreviousPage
  );
  const { theme } = useThemeContext();

  const extractIdFromUrl = (url: string) => {
    const parts = url.split('/');
    return parts[parts.length - 2]; // Extract the id (second-to-last part)
  };

  const extractPageId = (url: string) => {
    const urlObj = new URL(url);
    const page = urlObj.searchParams.get('page');
    return page;
  };

  const fetchData = async (url: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setIsLoading(false);
      setCurrentPage(extractPageId(url));
      setItems(data.results);
      setNextPage(data.next);
      setPreviousPage(data.previous);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className={isDescriptionOn ? 'grid grid-cols-2 gap-4' : ''}>
      <NavLink to={`/page/${currentPage}`}>
        {isLoading ? (
          <h2
            className={`
              text-xl ${theme === 'white' ? 'text-black' : 'text-white'}
            `}
          >
            🌀 Loading...
          </h2>
        ) : (
          <div>
            <h2
              className={`
                text-xl mb-4 
                ${theme === 'white' ? 'text-black' : 'text-white'}
              `}
            >
              Results
            </h2>
            <ul
              className={`
                space-y-2 
                ${theme === 'white' ? 'text-black bg-white' : 'text-white bg-gray-700'}
              `}
            >
              {items.length > 0 ? (
                items.map((item: Person, index: number) => (
                  <li
                    key={index}
                    className={`
                      p-2 rounded-lg shadow-sm 
                      ${theme === 'white' ? 'bg-white hover:bg-gray-200' : 'bg-gray-800 hover:bg-gray-600'}
                    `}
                  >
                    <NavLink
                      to={`/page/${currentPage}/character/${extractIdFromUrl(item.url)}`}
                      className={`
                        ${theme === 'white' ? 'text-blue-500 hover:underline' : 'text-blue-300 hover:underline'}
                      `}
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))
              ) : (
                <li
                  className={`
                    ${theme === 'white' ? 'text-black' : 'text-white'}
                  `}
                >
                  No results available
                </li>
              )}
            </ul>
            <Pagination
              previousPage={previousPage}
              nextPage={nextPage}
              fetchData={(url) => fetchData(url)}
            ></Pagination>
          </div>
        )}
      </NavLink>
      {isDescriptionOn && (
        <div>
          <Outlet></Outlet>
        </div>
      )}
    </div>
  );
}
