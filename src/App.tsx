import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import { AppRouter } from '@/router/AppRouter';
import './index.css';

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading application...</p>
    </div>
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingFallback />} persistor={persistor}>
        <AppRouter />
      </PersistGate>
    </Provider>
  );
}

export default App;