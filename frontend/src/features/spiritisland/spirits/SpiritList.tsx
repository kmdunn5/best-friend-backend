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
import type { Spirit } from '../types';
import { COMPLEXITY_COLORS } from '../types';
import { fetchSpirits } from '../api';
import { SI_COLORS, SI_GRADIENTS } from '../siTheme';
import ElementChips from '../ElementChips';

export default function SpiritList() {
  const [spirits, setSpirits] = useState<Spirit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSpirits()
      .then(setSpirits)
      .catch(() => setError('Failed to load spirits'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ textAlign: 'center', py: 8 }}><CircularProgress sx={{ color: SI_COLORS.forestMid }} /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" sx={{ color: SI_COLORS.forestDark, mb: 3, fontWeight: 700 }}>
        Spirits
      </Typography>

      <Grid container spacing={3}>
        {spirits.map(spirit => (
          <Grid key={spirit.id} size={{ xs: 12, sm: 6, md: 4 }}>
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
                onClick={() => navigate(`/spirit-island/spirits/${spirit.id}`)}
                sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
              >
                <Box sx={{
                  background: SI_GRADIENTS.header,
                  px: 2.5,
                  py: 2,
                }}>
                  <Typography variant="h6" sx={{
                    color: SI_COLORS.textOnDark,
                    fontWeight: 700,
                    fontSize: '1rem',
                    lineHeight: 1.3,
                  }}>
                    {spirit.name}
                  </Typography>
                </Box>

                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5, p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={spirit.complexity}
                      size="small"
                      sx={{
                        bgcolor: `${COMPLEXITY_COLORS[spirit.complexity]}14`,
                        color: COMPLEXITY_COLORS[spirit.complexity],
                        border: `1px solid ${COMPLEXITY_COLORS[spirit.complexity]}40`,
                        fontWeight: 700,
                        fontSize: '0.7rem',
                      }}
                    />
                  </Box>

                  <Typography variant="body2" sx={{
                    color: SI_COLORS.textSecondary,
                    fontSize: '0.8rem',
                    lineHeight: 1.5,
                    flexGrow: 1,
                  }}>
                    {spirit.description}
                  </Typography>

                  <ElementChips elements={spirit.primaryElements} />
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
