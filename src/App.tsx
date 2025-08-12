import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import LoadingFallback from './components/ui/LoadingFallback';
import './index.css';
import { AppRouter } from './router/AppRouter';

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
