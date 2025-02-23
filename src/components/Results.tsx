import { Outlet } from 'react-router';
import { Person } from '../model/Person';
import { useParams } from 'react-router';
import { NavLink } from 'react-router';
import { useEffect, useState } from 'react';
import Pagination from './Pagination';
import { useThemeContext } from '../contexts/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { removeItem, addItem } from '../store/selectedItemsSlice';
import { useFetchPeopleQuery } from '../store/apiSlice';
import { setFetchedResults } from '../store/fetchedResultsSlice';
import Flayout from './Flayout';

export default function Results() {
  const params = useParams();
  const isDescriptionOn = params.characterId ? true : false;
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useThemeContext();
  const selectedPersons = useSelector(
    (state: RootState) => state.selectedPersons.selectedPeople
  );
  const results = useSelector(
    (state: RootState) => state.fetchedResults.results
  );
  const nextPage = useSelector(
    (state: RootState) => state.fetchedResults.nextPage
  );
  const previousPage = useSelector(
    (state: RootState) => state.fetchedResults.previousPage
  );
  const [currentPage] = useState<string | null>(params.pageId ?? '1');
  const dispatch = useDispatch();
  const { data, isLoading } = useFetchPeopleQuery(searchQuery, {
    skip: !searchQuery,
  });

  const extractIdFromUrl = (url: string) => {
    const parts = url.split('/');
    return parts[parts.length - 2]; // Extract the id (second-to-last part)
  };

  const extractAfterSearch = (url: string) => {
    const baseUrl = 'https://swapi.dev/api/people/?search=';
    if (url.startsWith(baseUrl)) {
      return url.slice(baseUrl.length);
    } else {
      return '';
    }
  };

  const fetchData = async (url: string) => {
    console.log(url);
    console.log(extractAfterSearch(url));
    setSearchQuery(extractAfterSearch(url));
  };

  useEffect(() => {
    if (data) {
      console.log(data);
      dispatch(
        setFetchedResults({
          results: data.results,
          nextPage: data.next || null,
          previousPage: data.previous || null,
        })
      );
    }
  }, [data, dispatch]);

  const handleCheckboxChange = (person: Person) => {
    if (selectedPersons.some((p) => p.url === person.url)) {
      dispatch(removeItem(person));
    } else {
      dispatch(addItem(person));
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
              {results && results.length > 0 ? (
                results.map((item: Person, index: number) => (
                  <li
                    key={index}
                    className={`
                      p-2 rounded-lg shadow-sm 
                      ${theme === 'white' ? 'bg-white hover:bg-gray-200' : 'bg-gray-800 hover:bg-gray-600'}
                    `}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedPersons.some(
                          (p) => p.url === item.url
                        )}
                        onChange={() => handleCheckboxChange(item)}
                        className="mr-2"
                      />
                      <NavLink
                        to={`/page/${currentPage}/character/${extractIdFromUrl(item.url)}`}
                        className={`
                          ${theme === 'white' ? 'text-blue-500 hover:underline' : 'text-blue-300 hover:underline'}
                        `}
                      >
                        {item.name}
                      </NavLink>
                    </div>
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
            <Flayout></Flayout>
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
