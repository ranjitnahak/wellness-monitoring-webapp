import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface WellnessCheckIn {
  sleep: number;
  sleep_hours: number;
  fatigue: number;
  mood: number;
  stress: number;
  soreness: number;
  notes: string;
}

interface Props {
  onSubmitSuccess?: () => void;
}

export function WellnessCheckInForm({ onSubmitSuccess }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState<WellnessCheckIn>({
    sleep: 3,
    sleep_hours: 7,
    fatigue: 3,
    mood: 3,
    stress: 3,
    soreness: 3,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submissionData = {
        user_id: user?.id,
        ...checkIn,
        date: new Date().toISOString().split('T')[0]
      };
      
      console.log('Preparing to submit check-in:', submissionData);
      console.log('Sleep hours value:', checkIn.sleep_hours);
      
      const { data, error } = await supabase
        .from('wellness_checkins')
        .insert([submissionData])
        .select();

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Submission error details:', error);
        throw error;
      }

      console.log('Successfully saved check-in:', data);

      // Reset form on success
      setCheckIn({
        sleep: 3,
        sleep_hours: 7,
        fatigue: 3,
        mood: 3,
        stress: 3,
        soreness: 3,
        notes: '',
      });
      onSubmitSuccess?.();
      
    } catch (error) {
      console.error('Submission error:', error);
      setError('Failed to submit check-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof WellnessCheckIn) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = field === 'notes' 
      ? e.target.value 
      : field === 'sleep_hours' 
        ? parseFloat(e.target.value)
        : Number(e.target.value);
        
    console.log(`Updating ${field}:`, newValue);
    
    setCheckIn((prev) => {
      const updated = {
        ...prev,
        [field]: newValue,
      };
      console.log('Updated check-in state:', updated);
      return updated;
    });
  };

  const renderSlider = (
    field: keyof Omit<WellnessCheckIn, 'notes' | 'sleep_hours'>,
    label: string,
    description: string
  ) => (
    <Form.Group className="mb-4">
      <Form.Label>
        <div className="d-flex justify-content-between align-items-center">
          <span>{label}</span>
          <span className="badge bg-primary">{checkIn[field]}</span>
        </div>
      </Form.Label>
      <Form.Range
        min={1}
        max={5}
        step={1}
        value={checkIn[field]}
        onChange={handleChange(field)}
      />
      <div className="d-flex justify-content-between small text-muted">
        <span>Poor</span>
        <span>Excellent</span>
      </div>
      <Form.Text className="text-muted">
        {description}
      </Form.Text>
    </Form.Group>
  );

  const renderHoursSlider = () => (
    <Form.Group className="mb-4">
      <Form.Label>
        <div className="d-flex justify-content-between align-items-center">
          <span>Hours of Sleep</span>
          <span className="badge bg-primary">{checkIn.sleep_hours} hrs</span>
        </div>
      </Form.Label>
      <Form.Range
        min={0}
        max={12}
        step={0.5}
        value={checkIn.sleep_hours}
        onChange={handleChange('sleep_hours')}
      />
      <div className="d-flex justify-content-between small text-muted">
        <span>0 hrs</span>
        <span>12 hrs</span>
      </div>
      <Form.Text className="text-muted">
        How many hours did you sleep last night?
      </Form.Text>
    </Form.Group>
  );

  return (
    <Form onSubmit={handleSubmit}>
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Row>
        <Col md={6}>
          {renderHoursSlider()}
        </Col>
        <Col md={6}>
          {renderSlider(
            'sleep',
            'Sleep Quality',
            'How well did you sleep last night? (1: Very poor, 5: Excellent)'
          )}
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          {renderSlider(
            'fatigue',
            'Energy Level',
            'How energetic do you feel? (1: Extremely tired, 5: Full of energy)'
          )}
        </Col>
        <Col md={6}>
          {renderSlider(
            'mood',
            'Mood',
            'How would you rate your mood? (1: Very low, 5: Very positive)'
          )}
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          {renderSlider(
            'stress',
            'Stress Level',
            'How stressed do you feel? (1: Very stressed, 5: Very relaxed)'
          )}
        </Col>
        <Col md={6}>
          {renderSlider(
            'soreness',
            'Muscle Soreness',
            'How sore are your muscles? (1: Very sore, 5: No soreness)'
          )}
        </Col>
      </Row>

      <Form.Group className="mb-4">
        <Form.Label>Additional Notes</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Any additional comments about your wellness today?"
          value={checkIn.notes}
          onChange={handleChange('notes')}
        />
      </Form.Group>

      <div className="d-grid">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Check-in'}
        </Button>
      </div>
    </Form>
  );
}
