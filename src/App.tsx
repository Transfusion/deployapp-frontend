import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet, Navigate, useSearchParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthProvider';

import Navbar from './components/Navbar';
import logo from './logo.svg';
// import './App.css';

import Login from '../src/pages/Login';
import Home from './pages/Home';
import ManageStorage from './pages/ManageStorage';
import Binaries from './pages/Binaries';
import ManageBinaryPage from './pages/ManageBinaryPage';
import PublicBinaryPage from './pages/PublicBinaryPage';
import Profile from './pages/Profile';
import AccountVerification from './pages/AccountVerification';
import ChangeEmailVerification from './pages/ChangeEmailVerification';
import ResetPasswordVerification from './pages/ResetPasswordVerification';
import AliasPage from './pages/AliasPage';


// const Home = () => (
//   <div>
//     <h2>Home</h2>
//   </div>
// );

// const Login = () => {
//   <div>
//     <h2>Login</h2>
//   </div>
// }

const GlobalRedirectLayout = () => {
  const location = useLocation(); // <-- current location being accessed
  // const { isAuthenticated } = /* auth state from local state/context/redux/etc */
  const [searchParams, setSearchParams] = useSearchParams();

  if (searchParams.has('authError')) {
    return <Navigate
      to="/login"
      replace                    // <-- redirect
      state={{ from: location, authError: searchParams.get('authError') }} // <-- forward location
    />
  } else if (searchParams.has('verify')) {
    return <Navigate
      to="/verify"
      replace                    // <-- redirect
      state={{ from: location, verify: searchParams.get('verify') }} // <-- forward location
    />
  } else if (searchParams.has('confirm_change_email')) {
    return <Navigate
      to="/confirm_change_email"
      replace
      state={({ from: location, confirm_change_email: searchParams.get('confirm_change_email'), new_email: searchParams.get('new_email') })} />
  } else if (searchParams.has('confirm_reset_password')) {
    // http://localhost:3000/?confirm_reset_password=590dcccc-f90f-440e-ab90-91e2527f05e8
    return <Navigate
      to="/confirm_reset_password"
      replace
      state={({ from: location, confirm_reset_password: searchParams.get('confirm_reset_password') })} />
  }
  return <Outlet />
};


function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}

          <Navbar />
          <Routes>
            <Route element={<GlobalRedirectLayout />}>
              <Route index element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify" element={<AccountVerification />} />
              <Route path="/confirm_change_email" element={<ChangeEmailVerification />} />
              <Route path="/confirm_reset_password" element={<ResetPasswordVerification />} />
              <Route path="/storage" element={<ManageStorage />} />
              <Route path="/binaries" element={<Binaries />} />
              <Route path="/manage/:binaryId" element={<ManageBinaryPage />} />
              <Route path="/i/:binaryId" element={<PublicBinaryPage />} />
              <Route path="/a/:alias" element={<AliasPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
