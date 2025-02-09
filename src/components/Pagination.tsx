import { NavLink } from 'react-router';

interface PaginationProps {
  previousPage: string | null;
  nextPage: string | null;
  fetchData: (url: string) => void;
}
export default function Pagination({
  previousPage,
  nextPage,
  fetchData,
}: PaginationProps) {
  const extractPageId = (url: string) => {
    const urlObj = new URL(url);
    const page = urlObj.searchParams.get('page');
    return page;
  };

  return (
    <div className="flex justify-between mt-4">
      {previousPage ? (
        <NavLink to={`/page/${extractPageId(previousPage)}`}>
          <button
            onClick={() => fetchData(previousPage)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
          >
            &lt; Previous
          </button>
        </NavLink>
      ) : (
        <div />
      )}

      {nextPage ? (
        <NavLink to={`/page/${extractPageId(nextPage)}`}>
          <button
            onClick={() => fetchData(nextPage)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
          >
            Next &gt;
          </button>
        </NavLink>
      ) : (
        <div />
      )}
    </div>
  );
}
