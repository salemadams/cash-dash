import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeProvider';
import Layout from './layouts/Layout';
import DashboardPage from './pages/Dashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TransactionsPage from './pages/Transactions';
import BudgetPage from './pages/Budget';

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
                            element={<DashboardPage />}
                        />
                        <Route
                            path="transactions"
                            element={<TransactionsPage />}
                        />
                        <Route
                            path="analytics"
                            element={<div>Analytics</div>}
                        />
                        <Route
                            path="budget"
                            element={<BudgetPage></BudgetPage>}
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
