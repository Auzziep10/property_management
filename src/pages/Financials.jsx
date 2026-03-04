import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getExpenses, addExpense } from '../services/financialService';
import { getProperties } from '../services/propertyService';
import { Plus, ArrowDownRight, ArrowUpRight, DollarSign, Wallet } from 'lucide-react';

export default function Financials() {
    const { userProfile } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [newExpense, setNewExpense] = useState({
        amount: 0,
        category: 'maintenance', // maintenance, mortgage, insurance, utility, other
        propertyId: '',
        accountId: '', // Future: link to account
        description: '',
        type: 'expense', // expense or income
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        async function fetchData() {
            if (userProfile?.businessId) {
                const [expData, propData] = await Promise.all([
                    getExpenses(userProfile.businessId),
                    getProperties(userProfile.businessId)
                ]);

                // Sort expenses by date desc
                expData.sort((a, b) => new Date(b.date) - new Date(a.date));
                setExpenses(expData);
                setProperties(propData);
                setLoading(false);
            }
        }
        fetchData();
    }, [userProfile]);

    async function handleAddTransaction(e) {
        e.preventDefault();
        if (!userProfile?.businessId) return;

        setLoading(true);
        try {
            const id = await addExpense(userProfile.businessId, {
                ...newExpense,
                amount: Number(newExpense.amount),
                date: new Date(newExpense.date).toISOString()
            });
            // Prepend to list
            setExpenses([{ id, ...newExpense, date: new Date(newExpense.date).toISOString() }, ...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)));
            setIsModalOpen(false);
            setNewExpense({
                amount: 0, category: 'maintenance', propertyId: properties[0]?.id || '', accountId: '', description: '', type: 'expense', date: new Date().toISOString().split('T')[0]
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

    const totalIncome = expenses.filter(e => e.type === 'income').reduce((sum, e) => sum + Number(e.amount), 0);
    const totalExpense = expenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + Number(e.amount), 0);

    return (
        <div className="financials-container">
            <div className="flex justify-between items-center mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>Financials & Expenses</h1>
                    <p className="text-muted">Track cash flow across your properties.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Add Transaction
                </button>
            </div>

            <div className="stats-grid mb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="glass-panel text-center">
                    <div className="text-muted text-sm font-semibold mb-2" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Net Cash Flow</div>
                    <div className={`text-3xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-emerald-400' : 'text-red-400'}`} style={{ color: totalIncome - totalExpense >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                        {formatCurrency(totalIncome - totalExpense)}
                    </div>
                </div>
                <div className="glass-panel text-center">
                    <div className="text-emerald-400 text-sm font-semibold mb-2 flex justify-center items-center" style={{ color: 'var(--accent-success)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.3rem' }}><ArrowUpRight size={16} /> Income</div>
                    <div className="text-3xl font-bold">{formatCurrency(totalIncome)}</div>
                </div>
                <div className="glass-panel text-center">
                    <div className="text-red-400 text-sm font-semibold mb-2 flex justify-center items-center" style={{ color: 'var(--accent-danger)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.3rem' }}><ArrowDownRight size={16} /> Expenses</div>
                    <div className="text-3xl font-bold">{formatCurrency(totalExpense)}</div>
                </div>
            </div>

            <div className="glass-panel p-0 overflow-hidden" style={{ padding: 0, overflow: 'hidden' }}>
                {loading ? (
                    <div className="p-8 text-center" style={{ padding: '2rem', textAlign: 'center' }}>Loading transactions...</div>
                ) : expenses.length === 0 ? (
                    <div className="p-8 text-center" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                        <Wallet size={32} className="mx-auto mb-4 text-muted" style={{ margin: '0 auto 1rem', display: 'block', color: 'var(--text-muted)' }} />
                        <p className="text-muted">No transactions found.</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem', textTransform: 'uppercase' }}>Date</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem', textTransform: 'uppercase' }}>Description</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem', textTransform: 'uppercase' }}>Property</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem', textTransform: 'uppercase' }}>Category</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((exp) => {
                                const isIncome = exp.type === 'income';
                                const prop = properties.find(p => p.id === exp.propertyId);
                                return (
                                    <tr key={exp.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1rem' }}>{new Date(exp.date).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem', fontWeight: 500 }}>{exp.description}</td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{prop ? (prop.name || prop.address) : 'General'}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ padding: '0.25rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                                                {exp.category}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: isIncome ? 'var(--accent-success)' : 'var(--text-main)' }}>
                                            {isIncome ? '+' : '-'}{formatCurrency(exp.amount)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {isModalOpen && (
                <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div className="glass-panel modal-content" style={{ width: '100%', maxWidth: '440px', animation: 'fadeUpIn 0.3s ease-out' }}>
                        <h2 className="mb-4" style={{ marginBottom: '1.5rem' }}>Add Transaction</h2>
                        <form onSubmit={handleAddTransaction}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <button
                                    type="button"
                                    className={`btn ${newExpense.type === 'expense' ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{ backgroundColor: newExpense.type === 'expense' ? 'var(--accent-danger)' : undefined, boxShadow: newExpense.type === 'expense' ? '0 4px 14px 0 rgba(239, 68, 68, 0.39)' : undefined }}
                                    onClick={() => setNewExpense({ ...newExpense, type: 'expense' })}
                                >Expense</button>
                                <button
                                    type="button"
                                    className={`btn ${newExpense.type === 'income' ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{ backgroundColor: newExpense.type === 'income' ? 'var(--accent-success)' : undefined, boxShadow: newExpense.type === 'income' ? '0 4px 14px 0 rgba(16, 185, 129, 0.39)' : undefined }}
                                    onClick={() => setNewExpense({ ...newExpense, type: 'income' })}
                                >Income</button>
                            </div>

                            <div className="form-group">
                                <label>Amount</label>
                                <input required type="number" step="0.01" className="input-field" value={newExpense.amount} onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })} placeholder="0.00" />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <input required type="text" className="input-field" value={newExpense.description} onChange={e => setNewExpense({ ...newExpense, description: e.target.value })} placeholder="e.g. Plumbing Repair" />
                            </div>

                            <div className="form-group">
                                <label>Date</label>
                                <input required type="date" className="input-field" value={newExpense.date} onChange={e => setNewExpense({ ...newExpense, date: e.target.value })} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select required className="input-field" value={newExpense.category} onChange={e => setNewExpense({ ...newExpense, category: e.target.value })} style={{ appearance: 'none' }}>
                                        <option value="maintenance">Maintenance</option>
                                        <option value="mortgage">Mortgage</option>
                                        <option value="insurance">Insurance</option>
                                        <option value="utility">Utility</option>
                                        <option value="rent">Rent (Income)</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Property (Optional)</label>
                                    <select className="input-field" value={newExpense.propertyId} onChange={e => setNewExpense({ ...newExpense, propertyId: e.target.value })} style={{ appearance: 'none' }}>
                                        <option value="">-- General / None --</option>
                                        {properties.map(p => (
                                            <option key={p.id} value={p.id}>{p.name || p.address}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
