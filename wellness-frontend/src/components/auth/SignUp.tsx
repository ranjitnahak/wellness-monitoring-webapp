import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';

export function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Starting sign up process...');

    if (password !== confirmPassword) {
      console.log('Password mismatch');
      return setError('Passwords do not match');
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Attempting to sign up with:', { email, name });
      await signUp(email, password, name);
      console.log('Sign up successful, navigating to dashboard');
      navigate('/');
    } catch (error) {
      console.error('Sign up error details:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
      // Note: The actual navigation will happen after the OAuth redirect
    } catch (error) {
      console.error('Google sign in error:', error);
      setError(error instanceof Error ? error.message : 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        
        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            className="w-100 mb-3"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </Form>

        <div className="text-center mb-3">
          <span className="text-muted">or</span>
        </div>

        <Button
          variant="outline-dark"
          className="w-100 mb-3 d-flex align-items-center justify-content-center gap-2"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <FcGoogle size={20} />
          Sign up with Google
        </Button>

        <div className="text-center mt-3">
          Already have an account? <Link to="/signin">Sign In</Link>
        </div>
      </div>
    </Container>
  );
}
