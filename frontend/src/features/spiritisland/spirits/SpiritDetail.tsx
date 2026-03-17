import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BoltIcon from '@mui/icons-material/Bolt';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import type { Spirit } from '../types';
import { COMPLEXITY_COLORS } from '../types';
import { fetchSpirit } from '../api';
import { SI_COLORS, SI_GRADIENTS } from '../siTheme';
import ElementChips from '../ElementChips';

export default function SpiritDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [spirit, setSpirit] = useState<Spirit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchSpirit(Number(id))
      .then(setSpirit)
      .catch(() => setError('Spirit not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Box sx={{ textAlign: 'center', py: 8 }}><CircularProgress sx={{ color: SI_COLORS.forestMid }} /></Box>;
  if (error || !spirit) return <Alert severity="error">{error || 'Spirit not found'}</Alert>;

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/spirit-island/spirits')}
        sx={{ mb: 2, color: SI_COLORS.forestMid }}
      >
        All Spirits
      </Button>

      {/* Hero */}
      <Paper elevation={0} sx={{
        background: SI_GRADIENTS.header,
        borderRadius: 3,
        p: { xs: 3, sm: 4 },
        mb: 3,
      }}>
        <Typography variant="h4" sx={{
          color: SI_COLORS.textOnDark,
          fontWeight: 800,
          fontSize: { xs: '1.5rem', sm: '2rem' },
          mb: 1,
        }}>
          {spirit.name}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
          <Chip
            label={spirit.complexity}
            size="small"
            sx={{
              bgcolor: COMPLEXITY_COLORS[spirit.complexity],
              color: '#fff',
              fontWeight: 700,
            }}
          />
        </Box>

        <Typography sx={{
          color: SI_COLORS.textOnDark,
          opacity: 0.9,
          fontSize: '0.95rem',
          lineHeight: 1.6,
          mb: 2,
        }}>
          {spirit.description}
        </Typography>

        <ElementChips elements={spirit.primaryElements} size="medium" />
      </Paper>

      {/* Unique Powers */}
      {spirit.uniquePowers && spirit.uniquePowers.length > 0 && (
        <Paper elevation={0} sx={{
          bgcolor: SI_COLORS.cardBg,
          border: `1px solid ${SI_COLORS.parchmentDark}`,
          borderRadius: 3,
          overflow: 'hidden',
        }}>
          <Box sx={{
            px: 3,
            py: 2,
            borderBottom: `1px solid ${SI_COLORS.parchmentDark}`,
            bgcolor: SI_COLORS.parchment,
          }}>
            <Typography variant="h6" sx={{ color: SI_COLORS.forestDark, fontWeight: 700 }}>
              Unique Power Cards
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: SI_COLORS.textSecondary }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: SI_COLORS.textSecondary }}>Cost</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: SI_COLORS.textSecondary }}>Speed</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: SI_COLORS.textSecondary }}>Elements</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: SI_COLORS.textSecondary, display: { xs: 'none', md: 'table-cell' } }}>Effect</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {spirit.uniquePowers.map(card => (
                  <TableRow key={card.id} sx={{
                    '&:hover': { bgcolor: SI_COLORS.parchment },
                    transition: 'background-color 0.15s',
                  }}>
                    <TableCell sx={{ fontWeight: 600, color: SI_COLORS.textPrimary }}>
                      {card.name}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={card.cost}
                        size="small"
                        sx={{
                          bgcolor: SI_COLORS.goldLight + '30',
                          color: SI_COLORS.goldDark,
                          fontWeight: 700,
                          minWidth: 32,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={card.speed === 'FAST'
                          ? <BoltIcon sx={{ fontSize: 16 }} />
                          : <HourglassBottomIcon sx={{ fontSize: 16 }} />}
                        label={card.speed}
                        size="small"
                        sx={{
                          bgcolor: card.speed === 'FAST' ? '#e53935' + '18' : '#1565c0' + '18',
                          color: card.speed === 'FAST' ? '#c62828' : '#0d47a1',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          '& .MuiChip-icon': {
                            color: card.speed === 'FAST' ? '#c62828' : '#0d47a1',
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <ElementChips elements={card.elements} />
                    </TableCell>
                    <TableCell sx={{
                      color: SI_COLORS.textSecondary,
                      fontSize: '0.8rem',
                      display: { xs: 'none', md: 'table-cell' },
                    }}>
                      {card.description}
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
