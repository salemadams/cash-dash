import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './theme/ThemeProvider'
import Layout from './layouts/Layout'
import Dashboard from './components/dashboard';

function App() {
    return (
        <ThemeProvider>
            <Routes>
                <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard/>} />
                    <Route path="transactions" element={<div>Transactions</div>} />
                    <Route path="analytics" element={<div>Analytics</div>} />
                    <Route path="cards" element={<div>Cards</div>} />
                    <Route path="settings" element={<div>Settings</div>} />
                </Route>
            </Routes>
        </ThemeProvider>
    )
}

export default App;
