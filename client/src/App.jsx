import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Container, Row, Alert, Button, Col } from 'react-bootstrap';
import { Routes, Route, Outlet, Navigate, Link, useNavigate } from 'react-router-dom';
import { PlayFill } from 'react-bootstrap-icons';

import NavHeader from './components/NavBar';
import {LoginForm} from './components/AuthComponents';
import Profile from './components/Profile';
import API from './API.mjs';
import GameComponent from './components/Game';

function App() {

  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo(); // we have the user info here
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        console.log(err);
      }
    };
    checkAuth();
  }, []);



  const login = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setUser(user);
    }catch(err) {
      throw user;
    }
  }
  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(null);
    navigate('/');

  }

  return (
    <Routes>
      <Route path="/" element={
        <>
          <NavHeader  loggedIn={loggedIn} handleLogout={handleLogout} userInfo={user} />
          <Row className='mt-5 mx-0 p-0 d-flex justify-content-center '>
            <Col xs={5} className='d-flex flex-column align-items-center justify-content-center'>
            <h2 className='mb-5'>Welcome to What Do You Meme Game!</h2>
              <Button className='btn-dark' onClick={() => navigate('/game')}>
                <PlayFill size={30} className='me-2' />
                Play Now!
              </Button>
            </Col>
       
          </Row>
        </>
      }/> 

      <Route path="/game" element={
        <>
          <NavHeader loggedIn={loggedIn} handleLogout={handleLogout} userInfo={user} />
          <GameComponent loggedIn={loggedIn} user={user} />
        </>
      } />

      <Route path="/login" element={
        loggedIn ? <Navigate to="/" /> :
          <>
            <NavHeader loggedIn={loggedIn} handleLogout={handleLogout} userInfo={user}/>
            <LoginForm login={login} />
          </> 
      } /> 

      <Route path="/profile" element={
        <>
          <NavHeader loggedIn={loggedIn} handleLogout={handleLogout} userInfo={user} />
          <Profile userInfo={user} />
        </>
      } />


      <Route path="*" element={
        <>
          <NavHeader loggedIn={loggedIn} handleLogout={handleLogout} userInfo={user} />
          <h3 className='p-5'> Page not found - return to <Link to="/">Home</Link></h3>
        </>
      } />
    
    </Routes>
  )
}



export default App
