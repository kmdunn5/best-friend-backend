import { useEffect, useState, useCallback } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import { fetchCurrentGame } from './api';
import type { Game, Guess } from './types';
import GuessForm from './GuessForm';
import GuessList from './GuessList';
import WinnerBanner from './WinnerBanner';

const statusChipProps: Record<string, { label: string; color: 'success' | 'default' | 'warning' | 'secondary' }> = {
  OPEN: { label: 'Guessing Open', color: 'success' },
  CLOSED: { label: 'Guessing Closed', color: 'default' },
  LOCKED: { label: 'Locked In', color: 'warning' },
  REVEALED: { label: 'Winner Revealed', color: 'secondary' },
};

export default function SuperBowlGuessing() {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alreadyGuessed, setAlreadyGuessed] = useState(false);

  const loadGame = useCallback(async () => {
    try {
      const data = await fetchCurrentGame();
      setGame(data);
      if (data) {
        const stored = localStorage.getItem(`sb-commercial-guess-${data.id}`);
        setAlreadyGuessed(!!stored);
      }
    } catch {
      setError('Failed to load game data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  useEffect(() => {
    if (!game || game.status !== 'OPEN') return;
    const interval = setInterval(loadGame, 10000);
    return () => clearInterval(interval);
  }, [game?.status, loadGame]);

  const handleGuessSubmitted = (guess: Guess) => {
    setAlreadyGuessed(true);
    if (game) {
      setGame({ ...game, guesses: [...game.guesses, guess] });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!game) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1a237e, #534bae)',
            borderRadius: 3,
            p: { xs: 3, sm: 5 },
            mb: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" sx={{ color: '#fff' }}>
            Super Bowl Commercial Guessing
          </Typography>
        </Box>
        <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          No game available yet.
        </Typography>
      </Container>
    );
  }

  const chip = statusChipProps[game.status];

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a237e, #534bae)',
          borderRadius: 3,
          p: { xs: 3, sm: 5 },
          mb: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" sx={{ color: '#fff', mb: 1 }}>
          Super Bowl {game.year} Commercial Guessing
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
          Who will predict the first commercial?
        </Typography>
      </Box>

      {chip && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Chip label={chip.label} color={chip.color} />
        </Box>
      )}

      {game.status === 'CLOSED' && (
        <Paper sx={{ p: { xs: 3, sm: 5 }, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom>
            Guessing is not open yet
          </Typography>
          {game.guessingOpensAt && (
            <Typography color="text.secondary">
              Opens at: {new Date(game.guessingOpensAt).toLocaleString()}
            </Typography>
          )}
        </Paper>
      )}

      {game.status === 'OPEN' && (
        <Box>
          {alreadyGuessed ? (
            <Alert variant="filled" severity="success" sx={{ mb: 3 }}>
              Your guess has been submitted!
            </Alert>
          ) : (
            <GuessForm gameId={game.id} onGuessSubmitted={handleGuessSubmitted} />
          )}
          <Paper sx={{ p: { xs: 2, sm: 3 }, border: '1px solid', borderColor: 'divider' }}>
            <GuessList guesses={game.guesses} />
          </Paper>
        </Box>
      )}

      {game.status === 'LOCKED' && (
        <Box>
          <Paper
            sx={{
              p: { xs: 3, sm: 4 },
              mb: 3,
              textAlign: 'center',
              border: '2px solid',
              borderColor: 'secondary.main',
            }}
          >
            <Typography variant="h6" sx={{ color: 'secondary.dark' }}>
              Guessing is locked — waiting for kickoff!
            </Typography>
          </Paper>
          <Paper sx={{ p: { xs: 2, sm: 3 }, border: '1px solid', borderColor: 'divider' }}>
            <GuessList guesses={game.guesses} />
          </Paper>
        </Box>
      )}

      {game.status === 'REVEALED' && (
        <Box>
          <WinnerBanner winningCategory={game.winningCategory!} guesses={game.guesses} />
          <Paper sx={{ p: { xs: 2, sm: 3 }, border: '1px solid', borderColor: 'divider' }}>
            <GuessList guesses={game.guesses} winningCategory={game.winningCategory} />
          </Paper>
        </Box>
      )}
    </Container>
  );
}
