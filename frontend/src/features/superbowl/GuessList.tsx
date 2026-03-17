import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { Guess } from './types';

interface GuessListProps {
  guesses: Guess[];
  winningCategory?: string | null;
}

export default function GuessList({ guesses, winningCategory }: GuessListProps) {
  if (guesses.length === 0) {
    return <Typography color="text.secondary">No guesses yet.</Typography>;
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Name</strong></TableCell>
            <TableCell><strong>Category</strong></TableCell>
            <TableCell><strong>Time</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {guesses.map((guess) => {
            const isWinner = winningCategory && guess.category.toLowerCase() === winningCategory.toLowerCase();
            return (
              <TableRow
                key={guess.id}
                sx={isWinner ? { backgroundColor: 'success.light' } : undefined}
              >
                <TableCell>{guess.guesserName}{isWinner ? ' 🏆' : ''}</TableCell>
                <TableCell>{guess.category}</TableCell>
                <TableCell>{new Date(guess.guessedAt).toLocaleTimeString()}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
