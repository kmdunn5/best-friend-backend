import { Routes, Route, Navigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Button as BsButton } from 'react-bootstrap';
import SuperBowlGuessing from './features/superbowl/SuperBowlGuessing';
import AdminPanel from './features/superbowl/AdminPanel';
import SpiritIslandLayout from './features/spiritisland/SpiritIslandLayout';
import SpiritList from './features/spiritisland/spirits/SpiritList';
import SpiritDetail from './features/spiritisland/spirits/SpiritDetail';
import AdversaryList from './features/spiritisland/adversaries/AdversaryList';
import AdversaryDetail from './features/spiritisland/adversaries/AdversaryDetail';
import PowerCardBrowser from './features/spiritisland/powers/PowerCardBrowser';
import GameLog from './features/spiritisland/games/GameLog';
import GameForm from './features/spiritisland/games/GameForm';
import GameDetail from './features/spiritisland/games/GameDetail';
import StatsOverview from './features/spiritisland/stats/StatsOverview';

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

function SIPage({ children }: { children: React.ReactNode }) {
  return <SpiritIslandLayout>{children}</SpiritIslandLayout>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/superbowl" element={<SuperBowlGuessing />} />
      <Route path="/superbowl/admin" element={<AdminPanel />} />

      {/* Spirit Island */}
      <Route path="/spirit-island" element={<Navigate to="/spirit-island/spirits" replace />} />
      <Route path="/spirit-island/spirits" element={<SIPage><SpiritList /></SIPage>} />
      <Route path="/spirit-island/spirits/:id" element={<SIPage><SpiritDetail /></SIPage>} />
      <Route path="/spirit-island/adversaries" element={<SIPage><AdversaryList /></SIPage>} />
      <Route path="/spirit-island/adversaries/:id" element={<SIPage><AdversaryDetail /></SIPage>} />
      <Route path="/spirit-island/powers" element={<SIPage><PowerCardBrowser /></SIPage>} />
      <Route path="/spirit-island/games" element={<SIPage><GameLog /></SIPage>} />
      <Route path="/spirit-island/games/new" element={<SIPage><GameForm /></SIPage>} />
      <Route path="/spirit-island/games/:id" element={<SIPage><GameDetail /></SIPage>} />
      <Route path="/spirit-island/stats" element={<SIPage><StatsOverview /></SIPage>} />
    </Routes>
  );
}

export default App;
