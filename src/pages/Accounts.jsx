import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAccounts, addAccount } from '../services/accountService';
import { Plus, Building2, ExternalLink, CreditCard, Landmark } from 'lucide-react';

export default function Accounts() {
    const { userProfile } = useAuth();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [newAccount, setNewAccount] = useState({
        name: '',
        institution: '',
        type: 'bank', // bank, credit, mortgage, other
        balance: 0,
        loginUrl: '',
        lastFour: ''
    });

    useEffect(() => {
        async function fetchAccounts() {
            if (userProfile?.businessId) {
                const data = await getAccounts(userProfile.businessId);
                setAccounts(data);
                setLoading(false);
            }
        }
        fetchAccounts();
    }, [userProfile]);

    async function handleAddAccount(e) {
        e.preventDefault();
        if (!userProfile?.businessId) return;

        setLoading(true);
        try {
            const id = await addAccount(userProfile.businessId, {
                ...newAccount,
                balance: Number(newAccount.balance)
            });
            setAccounts([...accounts, { id, ...newAccount }]);
            setIsModalOpen(false);
            setNewAccount({ name: '', institution: '', type: 'bank', balance: 0, loginUrl: '', lastFour: '' });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

    return (
        <div className="accounts-container">
            <div className="flex justify-between items-center mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>Accounts & Institutions</h1>
                    <p className="text-muted">Manage your connected banks, credit cards, and portals.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Add Account
                </button>
            </div>

            {loading ? (
                <div className="loading-state text-center" style={{ padding: '2rem' }}>Loading accounts...</div>
            ) : accounts.length === 0 ? (
                <div className="empty-state glass-panel text-center" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                    <Building2 size={32} className="mx-auto mb-4 text-muted" style={{ margin: '0 auto 1rem', display: 'block' }} />
                    <h3>No institutions connected</h3>
                    <p className="text-muted mb-6" style={{ marginBottom: '1.5rem' }}>Add your bank accounts and credit cards used for your properties.</p>
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} /> Add Account
                    </button>
                </div>
            ) : (
                <div className="accounts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {accounts.map(acc => {
                        const isCredit = acc.type === 'credit';
                        return (
                            <div key={acc.id} className="glass-panel account-card">
                                <div className="acc-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {isCredit ? <CreditCard size={20} className="text-muted" /> : <Landmark size={20} className="text-muted" />}
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{acc.institution}</h3>
                                            <p className="text-muted" style={{ fontSize: '0.85rem' }}>{acc.name} {acc.lastFour && `(••${acc.lastFour})`}</p>
                                        </div>
                                    </div>
                                    {acc.loginUrl && (
                                        <a href={acc.loginUrl.startsWith('http') ? acc.loginUrl : `https://${acc.loginUrl}`} target="_blank" rel="noopener noreferrer" className="icon-btn" title="Open Portal">
                                            <ExternalLink size={18} />
                                        </a>
                                    )}
                                </div>

                                <div className="acc-body" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                                    <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {isCredit ? 'Current Balance' : 'Available Balance'}
                                    </span>
                                    <div className="font-semibold text-2xl mt-1" style={{ fontSize: '1.5rem', fontWeight: 600, color: isCredit ? 'var(--text-main)' : 'var(--accent-success)' }}>
                                        {formatCurrency(acc.balance)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div className="glass-panel modal-content" style={{ width: '100%', maxWidth: '440px', animation: 'fadeUpIn 0.3s ease-out' }}>
                        <h2 className="mb-4" style={{ marginBottom: '1.5rem' }}>Add Account / Institution</h2>
                        <form onSubmit={handleAddAccount}>
                            <div className="form-group">
                                <label>Institution Name</label>
                                <input required type="text" className="input-field" value={newAccount.institution} onChange={e => setNewAccount({ ...newAccount, institution: e.target.value })} placeholder="e.g. Chase Bank" />
                            </div>

                            <div className="form-group">
                                <label>Account Nickname</label>
                                <input required type="text" className="input-field" value={newAccount.name} onChange={e => setNewAccount({ ...newAccount, name: e.target.value })} placeholder="e.g. Business Checking" />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Account Type</label>
                                    <select required className="input-field" value={newAccount.type} onChange={e => setNewAccount({ ...newAccount, type: e.target.value })} style={{ appearance: 'none' }}>
                                        <option value="bank">Bank Account</option>
                                        <option value="credit">Credit Card</option>
                                        <option value="mortgage">Mortgage Loan</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Current Balance</label>
                                    <input required type="number" step="0.01" className="input-field" value={newAccount.balance} onChange={e => setNewAccount({ ...newAccount, balance: e.target.value })} placeholder="0.00" />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Last 4 Digits</label>
                                    <input type="text" maxLength={4} className="input-field" value={newAccount.lastFour} onChange={e => setNewAccount({ ...newAccount, lastFour: e.target.value })} placeholder="e.g. 1234" />
                                </div>

                                <div className="form-group">
                                    <label>Login Portal URL</label>
                                    <input type="text" className="input-field" value={newAccount.loginUrl} onChange={e => setNewAccount({ ...newAccount, loginUrl: e.target.value })} placeholder="chase.com" />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>Save Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
