import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
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
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Your Name"
        value={guesserName}
        onChange={(e) => setGuesserName(e.target.value)}
        required
      />
      <TextField
        label="Commercial Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="e.g. Beer, Cars, Insurance..."
        required
      />
      <Button type="submit" variant="contained" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Guess'}
      </Button>
    </Box>
  );
}
