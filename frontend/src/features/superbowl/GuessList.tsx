import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import type { Guess } from './types';

interface GuessListProps {
  guesses: Guess[];
  winningCategory?: string | null;
}

export default function GuessList({ guesses, winningCategory }: GuessListProps) {
  if (guesses.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">No predictions yet.</Typography>
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        All Predictions
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: 'primary.main', color: '#fff' }}>Name</TableCell>
              <TableCell sx={{ bgcolor: 'primary.main', color: '#fff' }}>Category</TableCell>
              <TableCell sx={{ bgcolor: 'primary.main', color: '#fff' }}>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {guesses.map((guess, index) => {
              const isWinner = winningCategory && guess.category.toLowerCase() === winningCategory.toLowerCase();
              return (
                <TableRow
                  key={guess.id}
                  sx={{
                    bgcolor: isWinner
                      ? 'success.light'
                      : index % 2 === 0
                        ? 'transparent'
                        : 'action.hover',
                  }}
                >
                  <TableCell sx={isWinner ? { fontWeight: 700 } : undefined}>
                    {guess.guesserName}{isWinner ? ' 🏆' : ''}
                  </TableCell>
                  <TableCell>{guess.category}</TableCell>
                  <TableCell>{new Date(guess.guessedAt).toLocaleTimeString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
