import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import {
  fetchCurrentGame,
  adminCreateGame,
  adminUpdateStatus,
  adminSetWinner,
} from './api';
import type { Game, GameStatus } from './types';

const STATUS_ORDER: GameStatus[] = ['CLOSED', 'OPEN', 'LOCKED', 'REVEALED'];

export default function AdminPanel() {
  const [secret, setSecret] = useState(() => localStorage.getItem('sb-admin-secret') ?? '');
  const [game, setGame] = useState<Game | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [newYear, setNewYear] = useState(new Date().getFullYear());
  const [newOpensAt, setNewOpensAt] = useState('');
  const [winnerCategory, setWinnerCategory] = useState('');

  useEffect(() => {
    fetchCurrentGame().then(setGame).catch(() => {});
  }, []);

  useEffect(() => {
    localStorage.setItem('sb-admin-secret', secret);
  }, [secret]);

  const clearMessages = () => { setMessage(''); setError(''); };

  const handleCreateGame = async () => {
    clearMessages();
    try {
      const created = await adminCreateGame(secret, newYear, newOpensAt || undefined);
      setGame(created);
      setMessage(`Game created for year ${created.year}`);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleStatusChange = async (status: GameStatus) => {
    if (!game) return;
    clearMessages();
    try {
      const updated = await adminUpdateStatus(secret, game.id, status);
      setGame(updated);
      setMessage(`Status changed to ${status}`);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleSetWinner = async () => {
    if (!game || !winnerCategory.trim()) return;
    clearMessages();
    try {
      const updated = await adminSetWinner(secret, game.id, winnerCategory.trim());
      setGame(updated);
      setMessage(`Winner set: ${winnerCategory}`);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Super Bowl Admin
      </Typography>

      <TextField
        label="Admin Secret"
        type="password"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
      />

      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Divider sx={{ mb: 3 }} />
      <Typography variant="h6" gutterBottom>Create New Game</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Year"
          type="number"
          value={newYear}
          onChange={(e) => setNewYear(Number(e.target.value))}
        />
        <TextField
          label="Opens At (ISO)"
          value={newOpensAt}
          onChange={(e) => setNewOpensAt(e.target.value)}
          placeholder="2026-02-08T18:00:00Z"
        />
        <Button variant="contained" onClick={handleCreateGame}>Create</Button>
      </Box>

      {game && (
        <>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="h6" gutterBottom>
            Current Game: {game.year} (Status: {game.status})
          </Typography>

          <Typography variant="subtitle2" gutterBottom>Change Status</Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            {STATUS_ORDER.map((s) => (
              <Button
                key={s}
                variant={game.status === s ? 'contained' : 'outlined'}
                size="small"
                onClick={() => handleStatusChange(s)}
                disabled={game.status === s}
              >
                {s}
              </Button>
            ))}
          </Box>

          <Divider sx={{ mb: 3 }} />
          <Typography variant="subtitle2" gutterBottom>Set Winning Category</Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              label="Winning Category"
              value={winnerCategory}
              onChange={(e) => setWinnerCategory(e.target.value)}
            />
            <Button variant="contained" color="success" onClick={handleSetWinner}>
              Reveal Winner
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
}
