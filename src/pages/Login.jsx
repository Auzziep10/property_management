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

    const { login, register } = useAuth();
    const navigate = useNavigate();

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
