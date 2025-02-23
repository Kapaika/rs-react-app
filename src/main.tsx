import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router';
import { Route } from 'react-router';
import { Routes } from 'react-router';
import CardDescription from './components/CardDescription';
import { Provider } from 'react-redux';
import store from './store/store';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Provider store={store}>
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
    </Provider>
  </StrictMode>
);
