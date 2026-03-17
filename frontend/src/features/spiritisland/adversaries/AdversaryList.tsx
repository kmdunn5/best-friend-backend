import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import type { Adversary } from '../types';
import { fetchAdversaries } from '../api';
import { SI_COLORS, SI_GRADIENTS } from '../siTheme';

export default function AdversaryList() {
  const [adversaries, setAdversaries] = useState<Adversary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdversaries()
      .then(setAdversaries)
      .catch(() => setError('Failed to load adversaries'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ textAlign: 'center', py: 8 }}><CircularProgress sx={{ color: SI_COLORS.forestMid }} /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" sx={{ color: SI_COLORS.forestDark, mb: 3, fontWeight: 700 }}>
        Adversaries
      </Typography>

      <Grid container spacing={3}>
        {adversaries.map(adv => {
          const minDiff = adv.levels.length > 0 ? Math.min(...adv.levels.map(l => l.difficulty)) : 0;
          const maxDiff = adv.levels.length > 0 ? Math.max(...adv.levels.map(l => l.difficulty)) : 0;

          return (
            <Grid key={adv.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                elevation={0}
                sx={{
                  background: SI_GRADIENTS.card,
                  border: `1px solid ${SI_COLORS.parchmentDark}`,
                  borderRadius: 3,
                  height: '100%',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: SI_COLORS.forestLight,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 20px ${SI_COLORS.forestDark}18`,
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate(`/spirit-island/adversaries/${adv.id}`)}
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                >
                  <Box sx={{
                    background: `linear-gradient(135deg, #4a1c1c 0%, #7b2d2d 50%, #3d1a1a 100%)`,
                    px: 2.5,
                    py: 2,
                  }}>
                    <Typography variant="h6" sx={{
                      color: SI_COLORS.textOnDark,
                      fontWeight: 700,
                      fontSize: '1rem',
                    }}>
                      {adv.name}
                    </Typography>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5, p: 2.5 }}>
                    <Typography variant="body2" sx={{
                      color: SI_COLORS.textSecondary,
                      fontSize: '0.8rem',
                      lineHeight: 1.5,
                      flexGrow: 1,
                    }}>
                      {adv.description}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip
                        label={`${adv.levels.length} Levels`}
                        size="small"
                        sx={{
                          bgcolor: SI_COLORS.forestDark + '14',
                          color: SI_COLORS.forestDark,
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                      <Chip
                        label={`Difficulty ${minDiff}–${maxDiff}`}
                        size="small"
                        sx={{
                          bgcolor: '#c6282818',
                          color: '#c62828',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
