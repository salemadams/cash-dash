import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeProvider';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <Routes>
                    <Route
                        path="/"
                        element={<Layout />}
                    >
                        <Route
                            index
                            element={<Dashboard />}
                        />
                        <Route
                            path="transactions"
                            element={<div>Transactions</div>}
                        />
                        <Route
                            path="analytics"
                            element={<div>Analytics</div>}
                        />
                        <Route
                            path="cards"
                            element={<div>Cards</div>}
                        />
                        <Route
                            path="settings"
                            element={<div>Settings</div>}
                        />
                    </Route>
                </Routes>
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;
