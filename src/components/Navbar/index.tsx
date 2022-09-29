import classNames from 'classnames';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { MdExpandMore } from 'react-icons/md';
import { useAuth } from '../../contexts/AuthProvider';

import styles from './Navbar.module.css';

const NonDropdownA = styled.a.attrs({
  className: 'underline-offset-4 hover:underline hover:decoration-4 focus:outline-none cursor-pointer'
})``;

const NonDropdownSpan = styled.span.attrs({
  className: 'underline-offset-4 hover:underline hover:decoration-4 focus:outline-none cursor-pointer'
})``;

/* class NavItem {
  constructor(name: string,
    url: string,
    hideMobile: boolean,
    external: boolean,) {
    this.name = name;
    this.url = url;
    this.hideMobile = hideMobile;
    this.external = external;
  }

  name: string;
  url: string;
  hideMobile: boolean;
  external: boolean;
} */

const Nav = styled.nav.attrs({
  className: classNames('mix-blend-difference', 'fixed', 'w-full', 'top-0' /*, styles.navbar */)
})`
  color: var(--colors-background);
`;

export default function Navbar() {
  const { profile, logout } = useAuth();
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const toggleMobileExpanded = () => {
    setMobileExpanded(!mobileExpanded);
  }

  return <Nav>
    {/* desktop viewport */}
    <div className="fixed w-full flex justify-end p-2.5 space-x-3 hidden sm:flex">
      {/* test internal link */}

      <NavLink to="/" >
        <NonDropdownSpan>Home</NonDropdownSpan>
      </NavLink>

      <NavLink to="/storage" >
        <NonDropdownSpan>Manage Storage</NonDropdownSpan>
      </NavLink>

      <NavLink to="/binaries" >
        <NonDropdownSpan>App Binaries</NonDropdownSpan>
      </NavLink>

      {profile?.authenticated && <NavLink to="/profile" >
        <NonDropdownSpan>Profile</NonDropdownSpan>
      </NavLink>}

      {profile?.authenticated ?
        <NonDropdownSpan onClick={logout}>Logout</NonDropdownSpan> :
        <NavLink to="/login" >
          <NonDropdownSpan>Login</NonDropdownSpan>
        </NavLink>}
    </div>


    {/* expanding mobile panel */}
    <div className={classNames('fixed', 'w-full', styles['mobile-panel'], {
      [styles['mobile-panel-expanded']]: mobileExpanded
    }, 'shadow-lg', 'shadow-teal-600/50')}>
      {/* inner container with padding */}
      <div className={classNames('pt-10', 'px-2', 'pb-2', 'space-y-1')}>


      </div>
    </div>



    {/* abbreviated mobile navbar */}
    <div className={classNames('fixed', 'w-full', 'flex', 'justify-end', 'p-2.5', 'space-x-3', {
      'sm:hidden': !mobileExpanded
    })}>

      {/* <button onClick={toggleMobileExpanded}>
        <MdExpandMore className={
          classNames(styles['expand-chevron'], {
            [styles.expanded]: mobileExpanded
          })
        } size={'1.5em'} />
      </button> */}

      <NavLink to="/" >
        <NonDropdownSpan>Home</NonDropdownSpan>
      </NavLink>

      <NavLink to="/storage" >
        <NonDropdownSpan>Manage Storage</NonDropdownSpan>
      </NavLink>

      <NavLink to="/binaries" >
        <NonDropdownSpan>App Binaries</NonDropdownSpan>
      </NavLink>

      {profile?.authenticated && <NavLink to="/profile" >
        <NonDropdownSpan>Profile</NonDropdownSpan>
      </NavLink>}

      {profile?.authenticated && <NavLink to="/profile" >
        <NonDropdownSpan>Profile</NonDropdownSpan>
      </NavLink>}

      {profile?.authenticated ?
        <NonDropdownSpan onClick={logout}>Logout</NonDropdownSpan> :
        <NavLink to="/login" >
          <NonDropdownSpan>Login</NonDropdownSpan>
        </NavLink>}
    </div>


  </Nav>
}
