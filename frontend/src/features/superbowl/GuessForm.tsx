import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { submitGuess } from './api';
import type { Guess } from './types';

interface GuessFormProps {
  gameId: number;
  onGuessSubmitted: (guess: Guess) => void;
}

export default function GuessForm({ gameId, onGuessSubmitted }: GuessFormProps) {
  const [guesserName, setGuesserName] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guesserName.trim() || !category.trim()) {
      setError('Both fields are required');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const guess = await submitGuess(gameId, guesserName.trim(), category.trim());
      localStorage.setItem(
        `sb-commercial-guess-${gameId}`,
        JSON.stringify({ guessId: guess.id, guesserName: guess.guesserName, category: guess.category })
      );
      onGuessSubmitted(guess);
    } catch {
      setError('Failed to submit guess. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        mb: 3,
        border: '1px solid',
        borderColor: 'primary.light',
        background: 'linear-gradient(180deg, rgba(26,35,126,0.03), rgba(26,35,126,0.08))',
      }}
    >
      <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
        Make Your Prediction
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        {error && <Alert variant="filled" severity="error">{error}</Alert>}
        <TextField
          label="Your Name"
          value={guesserName}
          onChange={(e) => setGuesserName(e.target.value)}
          required
          sx={{ borderRadius: 3 }}
        />
        <TextField
          label="Commercial Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Beer, Cars, Insurance..."
          required
          sx={{ borderRadius: 3 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          size="large"
          fullWidth
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Guess'}
        </Button>
      </Box>
    </Paper>
  );
}
