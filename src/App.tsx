import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthProvider';

import Navbar from './components/Navbar';
import logo from './logo.svg';
// import './App.css';

import Login from '../src/pages/Login';
import Home from './pages/Home';
import { userInfo } from 'os';
import ManageStorage from './pages/ManageStorage';
import Binaries from './pages/Binaries';
import ManageBinaryPage from './pages/ManageBinaryPage';


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
            <Route index element={<Home />} />
            <Route path="/profile" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/storage" element={<ManageStorage />} />
            <Route path="/binaries" element={<Binaries />} />
            <Route path="/manage/:binaryId" element={<ManageBinaryPage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
