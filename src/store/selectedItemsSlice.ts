import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Person } from '../model/Person';

interface SelectedItemsState {
  selectedPeople: Person[];
}

const initialState: SelectedItemsState = {
  selectedPeople: [],
};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Person>) => {
      if (
        !state.selectedPeople.some(
          (person) => person.url === action.payload.url
        )
      ) {
        state.selectedPeople.push(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<Person>) => {
      state.selectedPeople = state.selectedPeople.filter(
        (person) => person.url !== action.payload.url
      );
    },
    setSelectedItems: (state, action: PayloadAction<Person[]>) => {
      state.selectedPeople = action.payload;
    },
    clearSelectedItems: (state) => {
      state.selectedPeople = [];
    },
  },
});

export const { addItem, removeItem, setSelectedItems, clearSelectedItems } =
  selectedItemsSlice.actions;
export default selectedItemsSlice.reducer;
