import { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (event) => {
      event.preventDefault();
      
      const credentials = { username, password };
      
      props.login(credentials);
  };

  return (
    <Row className='d-flex justify-content-center mt-5 p-5 m-auto'>
      <Col md={6}>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='username' className='mb-3'>
              <Form.Label>Username</Form.Label>
              <Form.Control type='text' value={username} onChange={ev => setUsername(ev.target.value)} required={true} />
          </Form.Group>

          <Form.Group controlId='password' className='mb-3'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} required={true} minLength={4}/>
          </Form.Group>

          <Button className='btn-dark' type='submit'>Login</Button>
          <Link className='btn btn-danger mx-2 my-2' to={'/'} >Cancel</Link>
      </Form>
    </Col>
  </Row>
  )
};

function LogoutButton(props) {
  return(
    <Button variant='outline-light' onClick={props.logout}>Logout</Button>
  )
}

export{ LoginForm, LogoutButton };