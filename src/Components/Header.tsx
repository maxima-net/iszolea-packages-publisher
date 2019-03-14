import React from 'react';

interface HeaderProps {
    handleSettingsClick(value: boolean): void;
    isSettingsActive: boolean;
}

function Header(props: HeaderProps) {
    const settingsLinkClass = props.isSettingsActive ? 'active' : undefined;
    
    return (
        <nav>
            <div className="nav-wrapper blue darken-1">
                <a href="#" className="brand-logo center">Iszolea Packages Publisher</a>
                <ul className="right">
                    <li
                        className={settingsLinkClass}>
                        <a 
                            href="#"
                            onClick={() => props.handleSettingsClick(!props.isSettingsActive)}>
                            Settings
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Header;
