import classNames from 'classnames';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { MdExpandMore } from 'react-icons/md';
import { useAuth } from '../../contexts/AuthProvider';

import styles from './Navbar.module.css';

const MobileSpan = styled.span.attrs({
  className: 'p-2 block underline-offset-4 hover:underline hover:decoration-4 focus:outline-none cursor-pointer'
})`
  // color: var(--colors-primary);
`;

const NonDropdownSpan = styled.span.attrs({
  className: 'underline-offset-4 hover:underline hover:decoration-4 focus:outline-none cursor-pointer'
})``;

class NavItem {
  constructor(name: string,
    url: string,
    hideMobile: boolean,
    external: boolean,

    authenticated: boolean,
    notAuthenticated: boolean,

    callback?: () => any
  ) {
    this.name = name;
    this.url = url;
    this.hideMobile = hideMobile;
    this.external = external;

    this.authenticated = authenticated;
    this.notAuthenticated = notAuthenticated;

    this.callback = callback;
  }

  name: string;
  url: string;
  hideMobile: boolean;
  external: boolean;

  authenticated: boolean;
  notAuthenticated: boolean;

  callback?: () => any;
}

const Nav = styled.nav.attrs({
  className: classNames('fixed', 'w-full', 'top-0', 'z-40' /*, styles.navbar */)
})`
  // color: var(--colors-background);
`;

export default function Navbar() {
  const { profile, logout } = useAuth();
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const toggleMobileExpanded = () => {
    setMobileExpanded(!mobileExpanded);
  }

  const navItems = [
    {
      name: 'Home',
      url: '/',
      hideMobile: false, external: false,

      authenticated: true,
      notAuthenticated: true
    },
    {
      name: 'Manage Storage',
      url: '/storage',
      hideMobile: false, external: false,

      authenticated: true,
      notAuthenticated: true
    },
    {
      name: 'App Binaries',
      url: '/binaries',
      hideMobile: false, external: false,

      authenticated: true,
      notAuthenticated: true
    },
    {
      name: 'Profile',
      url: '/profile',

      hideMobile: true, external: false,

      authenticated: true,
      notAuthenticated: false
    },
    {
      name: 'Login',
      url: '/login',

      hideMobile: false, external: false,

      authenticated: false,
      notAuthenticated: true
    },
    {
      name: 'Logout',
      url: '',

      hideMobile: true, external: false,

      authenticated: true,
      notAuthenticated: false,
      callback: () => { logout() }
    }

  ] as NavItem[]

  return <Nav>
    {/* desktop viewport */}
    <div className="fixed w-full flex justify-end p-2.5 space-x-3 hidden sm:flex">
      {/* test internal link */}

      {navItems.map(({ name, url, external, authenticated, notAuthenticated, callback }) => {
        let show = (authenticated && profile?.authenticated || notAuthenticated && !profile?.authenticated);
        if (!show) return null;

        if (callback) return <NonDropdownSpan onClick={callback}>{name}</NonDropdownSpan>
        return <NavLink to={url} >
          <NonDropdownSpan>{name}</NonDropdownSpan>
        </NavLink>

      })}

    </div>


    {/* expanding mobile panel */}
    <div className={classNames('fixed', 'w-full', styles['mobile-panel'], {
      [styles['mobile-panel-expanded']]: mobileExpanded
    }, 'shadow-lg', 'shadow-teal-600/50')}>
      {/* inner container with padding */}
      <div className={classNames('pt-10', 'px-2', 'pb-2', 'space-y-1')}>

        {navItems
          .filter(({ hideMobile }) => hideMobile)
          .map(({ name, url, external, authenticated, notAuthenticated, callback }) => {

            let show = (authenticated && profile?.authenticated || notAuthenticated && !profile?.authenticated);
            if (!show) return null;
            if (callback)
              return <div><MobileSpan onClick={callback}>{name}</MobileSpan></div>
            return <NavLink to={url} >
              <MobileSpan>{name}</MobileSpan>
            </NavLink>
          })}
      </div>
    </div>



    {/* abbreviated mobile navbar */}
    <div className={classNames('fixed', 'w-full', 'flex', 'justify-end', 'p-2.5', 'space-x-3', {
      'sm:hidden': !mobileExpanded
    })}>

      {navItems.filter(({ hideMobile }) => !hideMobile).map(({ name, url, external, authenticated, notAuthenticated, callback }) => {
        let show = (authenticated && profile?.authenticated || notAuthenticated && !profile?.authenticated);
        if (!show) return null;

        if (callback) return <NonDropdownSpan onClick={callback}>{name}</NonDropdownSpan>
        return <NavLink to={url} >
          <NonDropdownSpan>{name}</NonDropdownSpan>
        </NavLink>

      })}

      <button onClick={toggleMobileExpanded}>
        <MdExpandMore className={
          classNames(styles['expand-chevron'], {
            [styles.expanded]: mobileExpanded
          })
        } size={'1.5em'} />
      </button>

    </div>


  </Nav>
}
