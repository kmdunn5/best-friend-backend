import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import type { Guess } from './types';

interface WinnerBannerProps {
  winningCategory: string;
  guesses: Guess[];
}

export default function WinnerBanner({ winningCategory, guesses }: WinnerBannerProps) {
  const winners = guesses.filter(
    (g) => g.category.toLowerCase() === winningCategory.toLowerCase()
  );

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, textAlign: 'center', backgroundColor: '#fff8e1' }}>
      <Typography variant="h4" gutterBottom>
        The first commercial was: <strong>{winningCategory}</strong>
      </Typography>
      {winners.length > 0 ? (
        <Box>
          <Typography variant="h5" color="success.main">
            Winner{winners.length > 1 ? 's' : ''}: {winners.map((w) => w.guesserName).join(', ')}
          </Typography>
        </Box>
      ) : (
        <Typography variant="h6" color="text.secondary">
          Nobody guessed it!
        </Typography>
      )}
    </Paper>
  );
}
