import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Alert, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { WellnessCheckInForm } from './wellness/WellnessCheckInForm';
import { WellnessHistory } from './wellness/WellnessHistory';
import { WellnessCheckIn } from '../types/wellness';
import { supabase } from '../services/supabase';

export function Dashboard() {
  const [error, setError] = useState<string | null>(null);
  const [checkIns, setCheckIns] = useState<WellnessCheckIn[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
  }, [user, navigate]);

  const fetchCheckIns = async () => {
    try {
      const { data, error } = await supabase
        .from('wellness_checkins')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false })
        .limit(7);

      if (error) {
        console.error('Error fetching check-ins:', error);
        throw error;
      }

      setCheckIns(data || []);
    } catch (error) {
      console.error('Error fetching check-ins:', error);
      setError('Failed to load wellness check-ins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchCheckIns();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to log out');
    }
  };

  const handleCheckInSuccess = () => {
    fetchCheckIns();
  };

  // If not authenticated, don't render the dashboard
  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>Wellness Dashboard</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Row>
          <Col md={12} lg={6}>
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Daily Wellness Check-in</h5>
              </Card.Header>
              <Card.Body>
                <WellnessCheckInForm onSubmitSuccess={handleCheckInSuccess} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={12} lg={6}>
            <WellnessHistory checkIns={checkIns} />
          </Col>
        </Row>
      </Container>
    </>
  );
}
