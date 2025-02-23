import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { clearSelectedItems } from '../store/selectedItemsSlice';
import { saveAs } from 'file-saver';
import { useThemeContext } from '../contexts/ThemeContext';

const Flyout: React.FC = () => {
  const selectedItems = useSelector(
    (state: RootState) => state.selectedPersons.selectedPeople
  );
  const { theme } = useThemeContext();
  const dispatch = useDispatch();

  const handleUnselectAll = () => {
    dispatch(clearSelectedItems());
  };

  const handleDownload = () => {
    const csvData = selectedItems.map((item) => ({
      name: item.name,
      height: item.height,
      gender: item.gender,
      detailsUrl: item.url,
    }));

    const header = ['Name', 'Description', 'Details URL'];
    const rows = csvData.map((item) => [
      item.name,
      item.height,
      item.gender,
      item.detailsUrl,
    ]);

    const csvContent = [header, ...rows].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const fileName = `${selectedItems.length}_selected_items.csv`;

    saveAs(blob, fileName);
  };

  if (selectedItems.length === 0) return null;

  return (
    <div
      className={`
      fixed bottom-0 left-0 w-full p-4 flex justify-between items-center 
      ${theme === 'white' ? 'bg-black text-white' : 'bg-white text-black'}
    `}
    >
      <div>
        {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''}{' '}
        selected
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleUnselectAll}
          className={`
            ${theme === 'black' ? 'bg-red-600 hover:bg-red-500' : 'bg-red-400 hover:bg-red-300'} 
            text-white px-4 py-2 rounded-lg
          `}
        >
          Unselect all
        </button>
        <button
          onClick={handleDownload}
          className={`
            ${theme === 'black' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-400 hover:bg-blue-300'} 
            text-white px-4 py-2 rounded-lg
          `}
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default Flyout;
