import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import type { Game } from '../types';
import { LOSS_REASON_LABELS } from '../types';
import { fetchGames } from '../api';
import { SI_COLORS } from '../siTheme';

export default function GameLog() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames(true)
      .then(setGames)
      .catch(() => setError('Failed to load games'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ textAlign: 'center', py: 8 }}><CircularProgress sx={{ color: SI_COLORS.forestMid }} /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ color: SI_COLORS.forestDark, fontWeight: 700 }}>
          Game Log
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/spirit-island/games/new')}
          sx={{
            bgcolor: SI_COLORS.forestMid,
            '&:hover': { bgcolor: SI_COLORS.forestDark },
            fontWeight: 600,
          }}
        >
          Log Game
        </Button>
      </Box>

      {games.length === 0 ? (
        <Paper elevation={0} sx={{
          bgcolor: SI_COLORS.cardBg,
          border: `1px solid ${SI_COLORS.parchmentDark}`,
          borderRadius: 3,
          p: 6,
          textAlign: 'center',
        }}>
          <Typography sx={{ color: SI_COLORS.textMuted, mb: 2 }}>
            No games logged yet. Play a game and record the results!
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate('/spirit-island/games/new')}
            sx={{ borderColor: SI_COLORS.forestMid, color: SI_COLORS.forestMid }}
          >
            Log Your First Game
          </Button>
        </Paper>
      ) : (
        <Paper elevation={0} sx={{
          bgcolor: SI_COLORS.cardBg,
          border: `1px solid ${SI_COLORS.parchmentDark}`,
          borderRadius: 3,
          overflow: 'hidden',
        }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: SI_COLORS.parchment }}>
                  <TableCell sx={{ fontWeight: 700, color: SI_COLORS.textSecondary }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: SI_COLORS.textSecondary }}>Result</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: SI_COLORS.textSecondary }}>Spirits</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: SI_COLORS.textSecondary, display: { xs: 'none', sm: 'table-cell' } }}>Players</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: SI_COLORS.textSecondary, display: { xs: 'none', md: 'table-cell' } }}>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {games.map(game => (
                  <TableRow
                    key={game.id}
                    hover
                    onClick={() => navigate(`/spirit-island/games/${game.id}`)}
                    sx={{
                      cursor: 'pointer',
                      opacity: game.fake ? 0.6 : 1,
                      '&:hover': { bgcolor: SI_COLORS.parchment },
                    }}
                  >
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {new Date(game.playedAt).toLocaleDateString()}
                        {game.fake && (
                          <Chip label="Test" size="small" sx={{
                            bgcolor: '#9e9e9e20',
                            color: '#757575',
                            fontSize: '0.6rem',
                            height: 18,
                          }} />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={game.result === 'WIN'
                          ? `Win (TL${game.victoryTerrorLevel})`
                          : `Loss`}
                        size="small"
                        sx={{
                          bgcolor: game.result === 'WIN' ? '#2e7d3218' : '#c6282818',
                          color: game.result === 'WIN' ? '#2e7d32' : '#c62828',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                        }}
                      />
                      {game.result === 'LOSS' && game.lossReason && (
                        <Typography variant="caption" sx={{ display: 'block', color: SI_COLORS.textMuted, mt: 0.5, fontSize: '0.65rem' }}>
                          {LOSS_REASON_LABELS[game.lossReason]}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                        {game.spirits?.map(gs => (
                          <Typography key={gs.id} variant="body2" sx={{ fontSize: '0.8rem', color: SI_COLORS.textPrimary }}>
                            {gs.spiritName}
                          </Typography>
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                        {game.spirits?.map(gs => (
                          <Typography key={gs.id} variant="body2" sx={{ fontSize: '0.8rem', color: SI_COLORS.textSecondary }}>
                            {gs.playerName}
                          </Typography>
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        <Chip label={`${game.numPlayers}P`} size="small" sx={{
                          bgcolor: SI_COLORS.forestDark + '14',
                          color: SI_COLORS.forestDark,
                          fontSize: '0.65rem',
                          height: 22,
                        }} />
                        {game.numRounds && (
                          <Chip label={`${game.numRounds} rounds`} size="small" sx={{
                            bgcolor: SI_COLORS.forestDark + '14',
                            color: SI_COLORS.forestDark,
                            fontSize: '0.65rem',
                            height: 22,
                          }} />
                        )}
                        {game.boardSetup && (
                          <Chip label={`Board ${game.boardSetup}`} size="small" sx={{
                            bgcolor: SI_COLORS.forestDark + '14',
                            color: SI_COLORS.forestDark,
                            fontSize: '0.65rem',
                            height: 22,
                          }} />
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}
