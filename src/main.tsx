import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router';
import { Route } from 'react-router';
import { Routes } from 'react-router';
import CardDescription from './components/CardDescription';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="page/:pageNumber">
            <Route
              path="character/:characterId"
              element={<CardDescription />}
            ></Route>
          </Route>
        </Route>
        <Route path="*" element={<h1>404</h1>}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
