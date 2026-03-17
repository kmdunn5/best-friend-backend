import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
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
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: { xs: 4, sm: 8 } }}>
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
        Best Friends
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
        Welcome to the Best Friends platform.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Card elevation={0} sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          transition: 'all 0.2s ease',
          '&:hover': { borderColor: '#2d5a3f', transform: 'translateY(-2px)', boxShadow: '0 4px 20px rgba(27,58,45,0.1)' },
        }}>
          <CardActionArea onClick={() => navigate('/spirit-island')}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 3 }}>
              <Typography sx={{ fontSize: '2rem' }}>🏝️</Typography>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b3a2d' }}>
                  Spirit Island
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Game tracker, spirit &amp; adversary reference, and play stats
                </Typography>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card elevation={0} sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          transition: 'all 0.2s ease',
          '&:hover': { borderColor: '#1a237e', transform: 'translateY(-2px)', boxShadow: '0 4px 20px rgba(26,35,126,0.1)' },
        }}>
          <CardActionArea onClick={() => navigate('/superbowl')}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 3 }}>
              <Typography sx={{ fontSize: '2rem' }}>🏈</Typography>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e' }}>
                  Super Bowl Commercial Guessing
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Guess the first commercial category and compete with friends
                </Typography>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
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
