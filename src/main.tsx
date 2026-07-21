import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { setupApiClient } from './api/client';
import App from './App';
import { tokenManager } from './auth/accessTokenManager';
import 'antd/dist/reset.css';
import './index.css';
import { store } from './store';
import { clearAuthState } from './store/authSlice';

setupApiClient({
  getAccessToken: () => tokenManager.getAccessToken(),
  onUnauthorized: () => {
    store.dispatch(clearAuthState());
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
