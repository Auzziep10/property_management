import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Home, CircleDollarSign, Building2, BellRing, Settings } from 'lucide-react';
import './Layout.css';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
    const location = useLocation();
    const { userProfile } = useAuth();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/properties', label: 'Properties', icon: Home },
        { path: '/financials', label: 'Financials', icon: CircleDollarSign },
        { path: '/accounts', label: 'Accounts & Inst.', icon: Building2 },
        { path: '/reminders', label: 'Reminders', icon: BellRing },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="app-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-icon"></div>
                    <h2>PropManager</h2>
                </div>

                <div className="business-selector">
                    <div className="business-info">
                        <span className="business-name">{userProfile?.name || 'My Business'}</span>
                        <span className="business-role">Owner Account</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-item ${isActive ? 'active' : ''}`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                <header className="topbar">
                    <div className="topbar-search">
                        <input type="text" className="search-input" placeholder="Search properties, expenses..." />
                    </div>
                    <div className="topbar-actions">
                        <button className="icon-btn"><BellRing size={20} /></button>
                        <div className="avatar-circle">
                            {userProfile?.displayName ? userProfile.displayName.charAt(0) : 'U'}
                        </div>
                    </div>
                </header>

                <div className="page-wrapper">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
