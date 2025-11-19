import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeProvider';
import Layout from './layouts/Layout';
import DashboardPage from './pages/Dashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TransactionsPage from './pages/Transactions';
import BudgetPage from './pages/Budget';
import AnalyticsPage from './pages/Analytics';

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
                            element={<AnalyticsPage />}
                        />
                        <Route
                            path="budget"
                            element={<BudgetPage />}
                        />
                    </Route>
                </Routes>
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;
