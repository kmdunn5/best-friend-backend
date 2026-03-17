import { useEffect, useState, useCallback } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { fetchCurrentGame } from './api';
import type { Game, Guess } from './types';
import GuessForm from './GuessForm';
import GuessList from './GuessList';
import WinnerBanner from './WinnerBanner';

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
        <Typography variant="h4">Super Bowl Commercial Guessing</Typography>
        <Typography color="text.secondary" sx={{ mt: 2 }}>No game available yet.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Super Bowl {game.year} Commercial Guessing
      </Typography>

      {game.status === 'CLOSED' && (
        <Box>
          <Alert severity="info">Guessing is not open yet.</Alert>
          {game.guessingOpensAt && (
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Opens at: {new Date(game.guessingOpensAt).toLocaleString()}
            </Typography>
          )}
        </Box>
      )}

      {game.status === 'OPEN' && (
        <Box>
          {alreadyGuessed ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Your guess has been submitted!
            </Alert>
          ) : (
            <GuessForm gameId={game.id} onGuessSubmitted={handleGuessSubmitted} />
          )}
          <GuessList guesses={game.guesses} />
        </Box>
      )}

      {game.status === 'LOCKED' && (
        <Box>
          <Alert severity="info" sx={{ mb: 2 }}>Guessing is locked. Waiting for the big reveal!</Alert>
          <GuessList guesses={game.guesses} />
        </Box>
      )}

      {game.status === 'REVEALED' && (
        <Box>
          <WinnerBanner winningCategory={game.winningCategory!} guesses={game.guesses} />
          <GuessList guesses={game.guesses} winningCategory={game.winningCategory} />
        </Box>
      )}
    </Container>
  );
}
