import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
    const { userProfile } = useAuth();

    return (
        <div className="dashboard-container">
            <header className="dashboard-header mb-8">
                <h1>Welcome back, {userProfile?.displayName || 'Owner'}</h1>
                <p className="text-muted">Here's the financial overview for {userProfile?.name || 'your properties'}.</p>
            </header>

            <div className="stats-grid grid-overview">
                <div className="glass-panel stat-card">
                    <h3 className="text-muted">Total Portfolio Value</h3>
                    <div className="stat-value text-3xl font-bold mt-2">$0.00</div>
                </div>
                <div className="glass-panel stat-card">
                    <h3 className="text-muted">Monthly Rent Income</h3>
                    <div className="stat-value text-3xl font-bold mt-2 text-emerald-400">$0.00</div>
                </div>
                <div className="glass-panel stat-card">
                    <h3 className="text-muted">Monthly Mortgages</h3>
                    <div className="stat-value text-3xl font-bold mt-2 text-red-400">$0.00</div>
                </div>
                <div className="glass-panel stat-card">
                    <h3 className="text-muted">Active Projects</h3>
                    <div className="stat-value text-3xl font-bold mt-2">0</div>
                </div>
            </div>
        </div>
    );
}
