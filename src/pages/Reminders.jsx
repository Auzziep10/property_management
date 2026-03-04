import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getReminders, addReminder, updateReminderStatus, deleteReminder } from '../services/reminderService';
import { getProperties } from '../services/propertyService';
import { Plus, BellRing, Calendar, CheckCircle2, Circle } from 'lucide-react';

export default function Reminders() {
    const { userProfile } = useAuth();
    const [reminders, setReminders] = useState([]);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [newReminder, setNewReminder] = useState({
        title: '',
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
        propertyId: '',
        completed: false
    });

    useEffect(() => {
        async function fetchData() {
            if (userProfile?.businessId) {
                const [remData, propData] = await Promise.all([
                    getReminders(userProfile.businessId),
                    getProperties(userProfile.businessId)
                ]);

                // Sort by date ascending
                remData.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
                setReminders(remData);
                setProperties(propData);
                setLoading(false);
            }
        }
        fetchData();
    }, [userProfile]);

    async function handleAddReminder(e) {
        e.preventDefault();
        if (!userProfile?.businessId) return;

        setLoading(true);
        try {
            const id = await addReminder(userProfile.businessId, newReminder);
            setReminders([...reminders, { id, ...newReminder }].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
            setIsModalOpen(false);
            setNewReminder({
                title: '', description: '', dueDate: new Date().toISOString().split('T')[0], propertyId: '', completed: false
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function toggleStatus(id, currentStatus) {
        if (!userProfile?.businessId) return;
        try {
            await updateReminderStatus(userProfile.businessId, id, !currentStatus);
            setReminders(reminders.map(r => r.id === id ? { ...r, completed: !currentStatus } : r));
        } catch (err) {
            console.error(err);
        }
    }

    async function handleDelete(id) {
        if (!userProfile?.businessId) return;
        try {
            await deleteReminder(userProfile.businessId, id);
            setReminders(reminders.filter(r => r.id !== id));
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="reminders-container">
            <div className="flex justify-between items-center mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>Upcoming Reminders</h1>
                    <p className="text-muted">Keep track of mortgage payments, maintenance tasks, and lease renewals.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Add Reminder
                </button>
            </div>

            {loading ? (
                <div className="loading-state text-center" style={{ padding: '2rem' }}>Loading reminders...</div>
            ) : reminders.length === 0 ? (
                <div className="empty-state glass-panel text-center" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                    <BellRing size={32} className="mx-auto mb-4 text-muted" style={{ margin: '0 auto 1rem', display: 'block' }} />
                    <h3>No reminders scheduled</h3>
                    <p className="text-muted mb-6" style={{ marginBottom: '1.5rem' }}>Stay on top of your portfolio by scheduling important dates.</p>
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} /> Schedule Task
                    </button>
                </div>
            ) : (
                <div className="reminders-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {reminders.map(rem => {
                        const isLate = new Date(rem.dueDate) < new Date(new Date().setHours(0, 0, 0, 0)) && !rem.completed;
                        const prop = properties.find(p => p.id === rem.propertyId);

                        return (
                            <div key={rem.id} className="glass-panel reminder-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', opacity: rem.completed ? 0.6 : 1, borderLeft: isLate ? '4px solid var(--accent-danger)' : '1px solid var(--border-color)' }}>
                                <button onClick={() => toggleStatus(rem.id, rem.completed)} className="icon-btn" style={{ padding: 0 }}>
                                    {rem.completed ? <CheckCircle2 size={24} style={{ color: 'var(--accent-success)' }} /> : <Circle size={24} />}
                                </button>

                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: 0, fontSize: '1.05rem', textDecoration: rem.completed ? 'line-through' : 'none' }}>{rem.title}</h3>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                                        <span className="text-muted" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: isLate ? 'var(--accent-danger)' : undefined }}>
                                            <Calendar size={14} /> {new Date(rem.dueDate).toLocaleDateString()}
                                        </span>
                                        {prop && (
                                            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                                                • {prop.name || prop.address}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button className="btn btn-secondary" onClick={() => handleDelete(rem.id)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Delete</button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div className="glass-panel modal-content" style={{ width: '100%', maxWidth: '440px', animation: 'fadeUpIn 0.3s ease-out' }}>
                        <h2 className="mb-4" style={{ marginBottom: '1.5rem' }}>Add Reminder</h2>
                        <form onSubmit={handleAddReminder}>
                            <div className="form-group">
                                <label>Task / Title</label>
                                <input required type="text" className="input-field" value={newReminder.title} onChange={e => setNewReminder({ ...newReminder, title: e.target.value })} placeholder="e.g. Pay Property Tax" />
                            </div>

                            <div className="form-group">
                                <label>Due Date</label>
                                <input required type="date" className="input-field" value={newReminder.dueDate} onChange={e => setNewReminder({ ...newReminder, dueDate: e.target.value })} />
                            </div>

                            <div className="form-group">
                                <label>Related Property (Optional)</label>
                                <select className="input-field" value={newReminder.propertyId} onChange={e => setNewReminder({ ...newReminder, propertyId: e.target.value })} style={{ appearance: 'none' }}>
                                    <option value="">-- General --</option>
                                    {properties.map(p => (
                                        <option key={p.id} value={p.id}>{p.name || p.address}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Notes</label>
                                <textarea className="input-field" rows="3" value={newReminder.description} onChange={e => setNewReminder({ ...newReminder, description: e.target.value })} placeholder="Any additional details..." />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>Save Reminder</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
