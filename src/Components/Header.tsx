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
        <a href="#" tabIndex={-1} className="brand-logo center">Iszolea Packages Publisher</a>
        <ul className="right">
          <li
            className={settingsLinkClass}>
            <a
              href="#"
              tabIndex={-1}
              title="Settings"
              onClick={() => props.handleSettingsClick(!props.isSettingsActive)}>
              <i className="material-icons">settings</i>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Header;
