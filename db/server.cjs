const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.get('/transactions', function (req, res) {
    const db = router.db;
    let transactions = db.get('transactions').value();
    const { startDate, endDate, interval, _limit } = req.query;

    // Filter by date range
    if (startDate || endDate) {
        transactions = transactions.filter((t) => {
            const txDate = new Date(t.date);

            // Filter out transactions before startDate (adjusted by interval)
            if (startDate) {
                const adjustedStartDate = new Date(
                    new Date(startDate).getTime() - (parseInt(interval) || 0)
                );
                if (txDate < adjustedStartDate) return false;
            }

            // Filter out transactions after endDate
            if (endDate && txDate > new Date(endDate)) {
                return false;
            }

            return true;
        });
    }

    // Always sort by date ascending
    transactions.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });

    // Limit results if requested
    if (_limit) {
        transactions = transactions.slice(0, parseInt(_limit));
    }

    res.json(transactions);
});

server.get('/budgets', function (req, res) {
    const db = router.db;
    let budgets = db.get('budgets').value();
    const { month } = req.query;

    // Only filter by month if provided
    if (month) {
        budgets = budgets.filter((b) => {
            // Include if budget could apply to this month
            if (b.startMonth > month) return false; // hasn't started yet
            if (!b.recurring && b.startMonth !== month) return false; // one-time for different month
            return true;
        });
    }

    res.json(budgets);
});

server.use(router);
server.listen(8000);
