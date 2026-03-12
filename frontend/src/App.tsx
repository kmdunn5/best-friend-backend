import { Routes, Route } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Button as BsButton } from 'react-bootstrap';

function Home() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        Best Friends
      </Typography>
      <Typography variant="body1" gutterBottom>
        Welcome to the Best Friends platform.
      </Typography>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Button variant="contained">MUI Button</Button>
        <BsButton variant="primary">Bootstrap Button</BsButton>
      </div>
    </Container>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
