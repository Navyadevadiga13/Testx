import { useLocation } from 'react-router-dom';

function ReadingResults() {
  const location = useLocation();
  const { correctCount, total } = location.state || { correctCount: 0, total: 0 };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Your Reading Score</h1>
      <p>You got {correctCount} out of {total} correct.</p>
      <p>Percentage: {((correctCount / total) * 100).toFixed(1)}%</p>
    </div>
  );
}