import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { Game } from '../types';
import { LOSS_REASON_LABELS } from '../types';
import { fetchGame } from '../api';
import { SI_COLORS, SI_GRADIENTS } from '../siTheme';

function StatBox({ label, value }: { label: string; value: string | number | null }) {
  if (value === null || value === undefined) return null;
  return (
    <Box sx={{ textAlign: 'center', p: 1.5 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, color: SI_COLORS.forestDark }}>
        {value}
      </Typography>
      <Typography variant="caption" sx={{ color: SI_COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.65rem' }}>
        {label}
      </Typography>
    </Box>
  );
}

export default function GameDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchGame(Number(id))
      .then(setGame)
      .catch(() => setError('Game not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Box sx={{ textAlign: 'center', py: 8 }}><CircularProgress sx={{ color: SI_COLORS.forestMid }} /></Box>;
  if (error || !game) return <Alert severity="error">{error || 'Game not found'}</Alert>;

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/spirit-island/games')}
        sx={{ mb: 2, color: SI_COLORS.forestMid }}
      >
        Game Log
      </Button>

      {/* Hero */}
      <Paper elevation={0} sx={{
        background: game.result === 'WIN' ? SI_GRADIENTS.header : 'linear-gradient(135deg, #4a1c1c 0%, #7b2d2d 50%, #3d1a1a 100%)',
        borderRadius: 3,
        p: { xs: 3, sm: 4 },
        mb: 3,
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Chip
              label={game.result === 'WIN' ? 'Victory' : 'Defeat'}
              sx={{
                bgcolor: game.result === 'WIN' ? '#2e7d32' : '#c62828',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.85rem',
                mb: 1,
              }}
            />
            <Typography variant="h5" sx={{ color: SI_COLORS.textOnDark, fontWeight: 700 }}>
              {new Date(game.playedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
            {game.result === 'WIN' && game.victoryTerrorLevel && (
              <Typography sx={{ color: SI_COLORS.goldLight, mt: 0.5 }}>
                {game.victoryTerrorLevel === 4 ? 'Fear Deck Emptied' : `Terror Level ${game.victoryTerrorLevel}`}
              </Typography>
            )}
            {game.result === 'LOSS' && game.lossReason && (
              <Typography sx={{ color: '#ef9a9a', mt: 0.5 }}>
                {LOSS_REASON_LABELS[game.lossReason]}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <StatBox label="Players" value={game.numPlayers} />
            <StatBox label="Rounds" value={game.numRounds} />
          </Box>
        </Box>
      </Paper>

      {/* Spirit Performances */}
      <Typography variant="h5" sx={{ color: SI_COLORS.forestDark, fontWeight: 700, mb: 2 }}>
        Spirit Performance
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {game.spirits?.map(gs => (
          <Grid key={gs.id} size={{ xs: 12, md: 6 }}>
            <Paper elevation={0} sx={{
              bgcolor: SI_COLORS.cardBg,
              border: `1px solid ${SI_COLORS.parchmentDark}`,
              borderRadius: 3,
              overflow: 'hidden',
            }}>
              <Box sx={{
                background: SI_GRADIENTS.header,
                px: 2.5,
                py: 1.5,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <Typography sx={{ color: SI_COLORS.textOnDark, fontWeight: 700, fontSize: '0.95rem' }}>
                  {gs.spiritName}
                </Typography>
                <Chip label={gs.playerName} size="small" sx={{
                  bgcolor: 'rgba(255,255,255,0.15)',
                  color: SI_COLORS.textOnDark,
                  fontWeight: 600,
                  fontSize: '0.7rem',
                }} />
              </Box>

              <Box sx={{ p: 2.5 }}>
                <Grid container spacing={1}>
                  {[
                    { label: 'Damage', value: gs.damageDealt },
                    { label: 'Fear', value: gs.fearGenerated },
                    { label: 'Cities', value: gs.citiesDestroyed },
                    { label: 'Towns', value: gs.townsDestroyed },
                    { label: 'Explorers', value: gs.explorersDestroyed },
                    { label: 'Prevented', value: gs.damagePrevented },
                    { label: 'Dahan Saved', value: gs.dahanSaved },
                    { label: 'Blight Removed', value: gs.blightRemoved },
                  ].filter(s => s.value !== null && s.value !== undefined).map(stat => (
                    <Grid key={stat.label} size={{ xs: 3 }}>
                      <Box sx={{
                        textAlign: 'center',
                        p: 1,
                        bgcolor: SI_COLORS.parchment,
                        borderRadius: 2,
                      }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: SI_COLORS.forestDark, fontSize: '1.1rem' }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="caption" sx={{ color: SI_COLORS.textMuted, fontSize: '0.6rem', textTransform: 'uppercase' }}>
                          {stat.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {gs.notes && (
                  <Typography variant="body2" sx={{ mt: 2, color: SI_COLORS.textSecondary, fontStyle: 'italic' }}>
                    {gs.notes}
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {game.notes && (
        <Paper elevation={0} sx={{
          bgcolor: SI_COLORS.cardBg,
          border: `1px solid ${SI_COLORS.parchmentDark}`,
          borderRadius: 3,
          p: 3,
        }}>
          <Typography variant="h6" sx={{ color: SI_COLORS.forestDark, fontWeight: 700, mb: 1 }}>
            Game Notes
          </Typography>
          <Typography sx={{ color: SI_COLORS.textSecondary, lineHeight: 1.6 }}>
            {game.notes}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
