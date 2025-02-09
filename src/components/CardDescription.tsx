import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router';
import { Person } from '../model/Person';

export default function CardDescription() {
  const SWAPI_LINK = 'https://swapi.dev/api/people/';
  const { pageNumber, characterId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [character, setCharacter] = useState<Person>({
    name: '',
    height: '',
    mass: '',
    hair_color: '',
    skin_color: '',
    eye_color: '',
    birth_year: '',
    gender: '',
    url: '',
  });

  useEffect(() => {
    if (!characterId) return; // Prevent fetch if no ID
    setIsLoading(true);
    fetch(`${SWAPI_LINK}${characterId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setIsLoading(false);
        setCharacter(data);
      })
      .catch((error) => console.error('Fetch error:', error));
  }, [characterId]);

  return (
    <>
      {isLoading ? (
        <h2>🌀 Loading...</h2>
      ) : (
        <div className="character-container">
          <NavLink to={`/page/${pageNumber}`} className="close-button">
            ❌
          </NavLink>
          <h2 className="character-title">Character Details</h2>
          <div className="character-info">
            <div className="character-info-row">
              <label>Name:</label>
              <span>{character.name}</span>
            </div>
            <div className="character-info-row">
              <label>Height:</label>
              <span>{character.height}</span>
            </div>
            <div className="character-info-row">
              <label>Mass:</label>
              <span>{character.mass}</span>
            </div>
            <div className="character-info-row">
              <label>Hair Color:</label>
              <span>{character.hair_color}</span>
            </div>
            <div className="character-info-row">
              <label>Skin Color:</label>
              <span>{character.skin_color}</span>
            </div>
            <div className="character-info-row">
              <label>Eye Color:</label>
              <span>{character.eye_color}</span>
            </div>
            <div className="character-info-row">
              <label>Birth Year:</label>
              <span>{character.birth_year}</span>
            </div>
            <div className="character-info-row">
              <label>Gender:</label>
              <span>{character.gender}</span>
            </div>
          </div>
          <style>
            {`
          .character-container {
            position: relative;
            max-width: 400px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
          }
          .close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            text-decoration: none;
            font-size: 24px;
            color: red;
            cursor: pointer;
          }
          .close-button:hover {
            color: darkred;
          }
        `}
          </style>
        </div>
      )}
    </>
  );
}
