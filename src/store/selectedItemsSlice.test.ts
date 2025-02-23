import selectedItemsReducer, {
  addItem,
  removeItem,
  setSelectedItems,
  clearSelectedItems,
} from './selectedItemsSlice';
import { Person } from '../model/Person';

describe('selectedItemsSlice', () => {
  // Mocked Person data
  const person1: Person = {
    name: 'Luke Skywalker',
    url: 'https://swapi.dev/api/people/1/',
    height: '',
    mass: '',
    hair_color: '',
    skin_color: '',
    eye_color: '',
    birth_year: '',
    gender: '',
  };

  const person2: Person = {
    name: 'Darth Vader',
    url: 'https://swapi.dev/api/people/2/',
    height: '',
    mass: '',
    hair_color: '',
    skin_color: '',
    eye_color: '',
    birth_year: '',
    gender: '',
  };

  const initialState = {
    selectedPeople: [],
  };

  it('should handle addItem correctly when the person is not already selected', () => {
    const action = addItem(person1);
    const newState = selectedItemsReducer(initialState, action);

    expect(newState.selectedPeople).toHaveLength(1);
    expect(newState.selectedPeople[0]).toEqual(person1);
  });

  it('should not addItem if the person is already selected', () => {
    const stateWithPerson1 = {
      selectedPeople: [person1],
    };

    const action = addItem(person1); // Trying to add the same person
    const newState = selectedItemsReducer(stateWithPerson1, action);

    expect(newState.selectedPeople).toHaveLength(1); // Should remain 1
  });

  it('should handle removeItem correctly', () => {
    const stateWithPeople = {
      selectedPeople: [person1, person2],
    };

    const action = removeItem(person1);
    const newState = selectedItemsReducer(stateWithPeople, action);

    expect(newState.selectedPeople).toHaveLength(1);
    expect(newState.selectedPeople).not.toContain(person1);
    expect(newState.selectedPeople).toContain(person2);
  });

  it('should handle setSelectedItems correctly', () => {
    const action = setSelectedItems([person1, person2]);
    const newState = selectedItemsReducer(initialState, action);

    expect(newState.selectedPeople).toHaveLength(2);
    expect(newState.selectedPeople).toEqual([person1, person2]);
  });

  it('should handle clearSelectedItems correctly', () => {
    const stateWithPeople = {
      selectedPeople: [person1, person2],
    };

    const action = clearSelectedItems();
    const newState = selectedItemsReducer(stateWithPeople, action);

    expect(newState.selectedPeople).toHaveLength(0);
  });

  it('should return the initial state when no action is dispatched', () => {
    const newState = selectedItemsReducer(undefined, { type: '' });

    expect(newState).toEqual(initialState);
  });
});
