import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProperties } from '../services/propertyService';
import { calculateDashboardMetrics, formatCurrency } from '../utils/helpers';

export default function Dashboard() {
    const { userProfile } = useAuth();
    const [metrics, setMetrics] = useState({ portfolioValue: 0, monthlyRent: 0, monthlyMortgage: 0, propertyCount: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadDashboard() {
            if (userProfile?.businessId) {
                const props = await getProperties(userProfile.businessId);
                setMetrics(calculateDashboardMetrics(props));
                setLoading(false);
            }
        }
        loadDashboard();
    }, [userProfile]);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header mb-8">
                <h1>Welcome back, {userProfile?.displayName || 'Owner'}</h1>
                <p className="text-muted">Here's the financial overview for {userProfile?.name || 'your properties'}.</p>
            </header>

            {loading ? (
                <div className="text-center text-muted" style={{ padding: '2rem' }}>Loading metrics...</div>
            ) : (
                <div className="stats-grid grid-overview" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                    <div className="glass-panel stat-card">
                        <h3 className="text-muted" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Portfolio Value</h3>
                        <div className="stat-value text-3xl font-bold mt-2" style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{formatCurrency(metrics.portfolioValue)}</div>
                    </div>
                    <div className="glass-panel stat-card">
                        <h3 className="text-muted" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Rent Income</h3>
                        <div className="stat-value text-3xl font-bold mt-2 text-emerald-400" style={{ fontSize: '2rem', marginTop: '0.5rem', color: 'var(--accent-success)' }}>{formatCurrency(metrics.monthlyRent)}</div>
                    </div>
                    <div className="glass-panel stat-card">
                        <h3 className="text-muted" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Mortgages</h3>
                        <div className="stat-value text-3xl font-bold mt-2 text-red-400" style={{ fontSize: '2rem', marginTop: '0.5rem', color: 'var(--accent-danger)' }}>{formatCurrency(metrics.monthlyMortgage)}</div>
                    </div>
                    <div className="glass-panel stat-card">
                        <h3 className="text-muted" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Properties</h3>
                        <div className="stat-value text-3xl font-bold mt-2" style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{metrics.propertyCount}</div>
                    </div>
                </div>
            )}
        </div>
    );
}
