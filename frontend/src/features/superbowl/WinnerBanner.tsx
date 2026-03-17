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
    <Paper
      elevation={6}
      sx={{
        p: { xs: 3, sm: 4 },
        mb: 3,
        textAlign: 'center',
        background: 'linear-gradient(135deg, #f9a825, #ff8f00, #f9a825)',
        color: '#fff',
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ color: 'rgba(255,255,255,0.9)', mb: 1 }}
      >
        The First Commercial Was
      </Typography>
      <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
        {winningCategory}
      </Typography>
      {winners.length > 0 ? (
        <Box>
          <Typography
            variant="h5"
            sx={{
              color: '#fff',
              fontWeight: 700,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Winner{winners.length > 1 ? 's' : ''}: {winners.map((w) => w.guesserName).join(', ')}
          </Typography>
        </Box>
      ) : (
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
          Nobody guessed it!
        </Typography>
      )}
    </Paper>
  );
}
