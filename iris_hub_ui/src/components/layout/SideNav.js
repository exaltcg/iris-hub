import React from 'react';
import { Link } from 'react-router-dom';

const SideNav = () => {
    return (
        <div className="col-2" style={{ minWidth: '271px', backgroundColor: '#d7d7db' }}>
            <aside>
                <nav className="navbar">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to="/" className="nav-link active">Dashboard</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/" className="nav-link">Settings</Link>
                        </li>
                    </ul>

                </nav>
            </aside>
        </div>
    );
}

export default SideNav;