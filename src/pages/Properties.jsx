import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProperties, addProperty } from '../services/propertyService';
import { Plus, Home, MapPin, DollarSign, Wallet } from 'lucide-react';

export default function Properties() {
    const { userProfile } = useAuth();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProp, setNewProp] = useState({
        name: '', address: '', purchasePrice: 0,
        monthlyMortgage: 0, monthlyRent: 0, loanType: ''
    });

    useEffect(() => {
        async function fetchProperties() {
            if (userProfile?.businessId) {
                const data = await getProperties(userProfile.businessId);
                setProperties(data);
                setLoading(false);
            }
        }
        fetchProperties();
    }, [userProfile]);

    async function handleAddProperty(e) {
        e.preventDefault();
        if (!userProfile?.businessId) return;

        setLoading(true);
        try {
            const id = await addProperty(userProfile.businessId, {
                ...newProp,
                purchasePrice: Number(newProp.purchasePrice),
                monthlyMortgage: Number(newProp.monthlyMortgage),
                monthlyRent: Number(newProp.monthlyRent),
            });
            setProperties([...properties, { id, ...newProp }]);
            setIsModalOpen(false);
            setNewProp({ name: '', address: '', purchasePrice: 0, monthlyMortgage: 0, monthlyRent: 0, loanType: '' });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    // Helper text format
    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

    return (
        <div className="properties-container">
            <div className="flex justify-between items-center mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>Properties</h1>
                    <p className="text-muted">Manage your real estate portfolio.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Add Property
                </button>
            </div>

            {loading ? (
                <div className="loading-state">Loading properties...</div>
            ) : properties.length === 0 ? (
                <div className="empty-state glass-panel text-center" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                    <div className="icon-circle mb-4 mx-auto" style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <Home size={32} />
                    </div>
                    <h3>No properties yet</h3>
                    <p className="text-muted mb-6" style={{ marginBottom: '1.5rem' }}>Add your first property to start managing financials.</p>
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} /> Add Property
                    </button>
                </div>
            ) : (
                <div className="properties-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                    {properties.map(p => (
                        <div key={p.id} className="glass-panel property-card flex flex-col" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="prop-header border-b pb-4 mb-4" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Home size={18} className="text-muted" /> {p.name || p.address}
                                </h3>
                                <p className="text-muted text-sm mt-1" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                                    <MapPin size={14} /> {p.address}
                                </p>
                            </div>

                            <div className="prop-stats grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <span className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Value</span>
                                    <div className="font-semibold">{formatCurrency(p.purchasePrice)}</div>
                                </div>
                                <div>
                                    <span className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Loan Type</span>
                                    <div className="font-semibold">{p.loanType || 'N/A'}</div>
                                </div>
                                <div>
                                    <span className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rent (Mo)</span>
                                    <div className="font-semibold text-emerald-400" style={{ color: 'var(--accent-success)' }}>{formatCurrency(p.monthlyRent)}</div>
                                </div>
                                <div>
                                    <span className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mortgage</span>
                                    <div className="font-semibold text-red-400" style={{ color: 'var(--accent-danger)' }}>{formatCurrency(p.monthlyMortgage)}</div>
                                </div>
                            </div>

                            <div className="mt-auto pt-4 border-t" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                                <button className="btn btn-secondary w-full" style={{ width: '100%' }}>View Details</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal - Basic abstraction for now */}
            {isModalOpen && (
                <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div className="glass-panel modal-content" style={{ width: '100%', maxWidth: '500px', animation: 'fadeUpIn 0.3s ease-out' }}>
                        <h2 className="mb-4" style={{ marginBottom: '1rem' }}>Add New Property</h2>
                        <form onSubmit={handleAddProperty}>
                            <div className="form-group">
                                <label>Property Nickname</label>
                                <input required type="text" className="input-field" value={newProp.name} onChange={e => setNewProp({ ...newProp, name: e.target.value })} placeholder="e.g. Sunny Villa" />
                            </div>
                            <div className="form-group">
                                <label>Full Address</label>
                                <input required type="text" className="input-field" value={newProp.address} onChange={e => setNewProp({ ...newProp, address: e.target.value })} placeholder="123 Main St, City, State" />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Purchase Price</label>
                                    <input required type="number" className="input-field" value={newProp.purchasePrice} onChange={e => setNewProp({ ...newProp, purchasePrice: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Loan Type</label>
                                    <input required type="text" className="input-field" value={newProp.loanType} onChange={e => setNewProp({ ...newProp, loanType: e.target.value })} placeholder="Conventional, FHA, etc." />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Monthly Rent</label>
                                    <input required type="number" className="input-field" value={newProp.monthlyRent} onChange={e => setNewProp({ ...newProp, monthlyRent: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Monthly Mortgage</label>
                                    <input required type="number" className="input-field" value={newProp.monthlyMortgage} onChange={e => setNewProp({ ...newProp, monthlyMortgage: e.target.value })} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>Save Property</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
