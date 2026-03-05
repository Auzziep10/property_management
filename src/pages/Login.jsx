import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

export default function Login() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    async function handleGoogleLogin() {
        setError('');
        setLoading(true);
        try {
            await loginWithGoogle();
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to authenticate with Google');
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isRegistering) {
                await register(email, password, displayName, businessName);
            } else {
                await login(email, password);
            }
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to authenticate');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-container">
            <div className="glass-panel login-card">
                <div className="login-header">
                    <div className="logo-icon-large"></div>
                    <h2>{isRegistering ? 'Create your business account' : 'Welcome back'}</h2>
                    <p className="text-muted">
                        {isRegistering
                            ? 'Start managing your property portfolio efficiently.'
                            : 'Sign in to manage your properties and financials.'}
                    </p>
                </div>

                {error && <div className="error-alert">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    {isRegistering && (
                        <>
                            <div className="form-group">
                                <label>Your Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    required
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="form-group">
                                <label>Business / Organization Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    required
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    placeholder="Doe Properties LLC"
                                />
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            className="input-field"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="input-field"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary login-btn"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : (isRegistering ? 'Create Account' : 'Sign In')}
                    </button>
                </form>

                <div className="flex items-center my-4" style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
                    <span style={{ padding: '0 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>or continue with</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="btn btn-secondary"
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', padding: '0.85rem' }}
                    disabled={loading}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                </button>

                <div className="login-footer">
                    <p className="text-muted">
                        {isRegistering ? 'Already have an account?' : 'Don\'t have an account?'}
                        <button
                            className="text-link-btn"
                            onClick={() => setIsRegistering(!isRegistering)}
                        >
                            {isRegistering ? 'Sign In' : 'Sign Up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
