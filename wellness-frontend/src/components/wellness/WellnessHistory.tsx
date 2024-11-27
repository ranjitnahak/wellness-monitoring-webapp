import React from 'react';
import { Table, Card } from 'react-bootstrap';
import { WellnessCheckIn } from '../../types/wellness';

interface WellnessHistoryProps {
  checkIns: WellnessCheckIn[];
}

export function WellnessHistory({ checkIns }: WellnessHistoryProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRatingDescription = (rating: number, metric: string) => {
    const descriptions: { [key: string]: { [key: number]: string } } = {
      sleep: {
        1: 'Poor',
        2: 'Fair',
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent'
      },
      fatigue: {
        1: 'Very Fatigued',
        2: 'Fatigued',
        3: 'Moderate',
        4: 'Fresh',
        5: 'Very Fresh'
      },
      mood: {
        1: 'Poor',
        2: 'Fair',
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent'
      },
      stress: {
        1: 'Very Stressed',
        2: 'Stressed',
        3: 'Moderate',
        4: 'Relaxed',
        5: 'Very Relaxed'
      },
      soreness: {
        1: 'Very Sore',
        2: 'Sore',
        3: 'Moderate',
        4: 'Minimal',
        5: 'None'
      }
    };

    return descriptions[metric]?.[rating] || rating.toString();
  };

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">Recent Check-ins</h5>
      </Card.Header>
      <Card.Body>
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Sleep</th>
                <th>Fatigue</th>
                <th>Mood</th>
                <th>Stress</th>
                <th>Soreness</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {checkIns.map((checkIn) => (
                <tr key={checkIn.id}>
                  <td>{formatDate(checkIn.date)}</td>
                  <td>{getRatingDescription(checkIn.sleep, 'sleep')}</td>
                  <td>{getRatingDescription(checkIn.fatigue, 'fatigue')}</td>
                  <td>{getRatingDescription(checkIn.mood, 'mood')}</td>
                  <td>{getRatingDescription(checkIn.stress, 'stress')}</td>
                  <td>{getRatingDescription(checkIn.soreness, 'soreness')}</td>
                  <td>{checkIn.notes || '-'}</td>
                </tr>
              ))}
              {checkIns.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center">
                    No check-ins recorded yet
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
}
