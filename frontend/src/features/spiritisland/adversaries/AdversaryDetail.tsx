import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { Adversary } from '../types';
import { fetchAdversary } from '../api';
import { SI_COLORS } from '../siTheme';

function difficultyColor(difficulty: number): string {
  if (difficulty <= 3) return '#2e7d32';
  if (difficulty <= 6) return '#f57f17';
  if (difficulty <= 9) return '#e65100';
  return '#b71c1c';
}

export default function AdversaryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [adversary, setAdversary] = useState<Adversary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchAdversary(Number(id))
      .then(setAdversary)
      .catch(() => setError('Adversary not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Box sx={{ textAlign: 'center', py: 8 }}><CircularProgress sx={{ color: SI_COLORS.forestMid }} /></Box>;
  if (error || !adversary) return <Alert severity="error">{error || 'Adversary not found'}</Alert>;

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/spirit-island/adversaries')}
        sx={{ mb: 2, color: SI_COLORS.forestMid }}
      >
        All Adversaries
      </Button>

      <Paper elevation={0} sx={{
        background: `linear-gradient(135deg, #4a1c1c 0%, #7b2d2d 50%, #3d1a1a 100%)`,
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
          {adversary.name}
        </Typography>
        <Typography sx={{ color: SI_COLORS.textOnDark, opacity: 0.9, lineHeight: 1.6 }}>
          {adversary.description}
        </Typography>
      </Paper>

      <Typography variant="h5" sx={{ color: SI_COLORS.forestDark, fontWeight: 700, mb: 2 }}>
        Difficulty Levels
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {adversary.levels.map(level => (
          <Paper key={level.id} elevation={0} sx={{
            bgcolor: SI_COLORS.cardBg,
            border: `1px solid ${SI_COLORS.parchmentDark}`,
            borderRadius: 3,
            p: 3,
            borderLeft: `4px solid ${difficultyColor(level.difficulty)}`,
            transition: 'border-color 0.2s',
            '&:hover': { borderColor: SI_COLORS.forestLight },
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: SI_COLORS.textPrimary }}>
                Level {level.level}
              </Typography>
              <Chip
                label={`Difficulty ${level.difficulty}`}
                size="small"
                sx={{
                  bgcolor: difficultyColor(level.difficulty) + '18',
                  color: difficultyColor(level.difficulty),
                  fontWeight: 700,
                }}
              />
              {level.name && (
                <Typography variant="body2" sx={{
                  color: SI_COLORS.textMuted,
                  fontStyle: 'italic',
                }}>
                  {level.name}
                </Typography>
              )}
            </Box>
            <Typography variant="body2" sx={{ color: SI_COLORS.textSecondary, lineHeight: 1.6 }}>
              {level.effect}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
