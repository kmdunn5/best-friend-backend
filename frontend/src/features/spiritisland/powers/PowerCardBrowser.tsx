import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import BoltIcon from '@mui/icons-material/Bolt';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import type { PowerCard, CardType } from '../types';
import { fetchPowerCards } from '../api';
import { SI_COLORS } from '../siTheme';
import ElementChips from '../ElementChips';

export default function PowerCardBrowser() {
  const [cards, setCards] = useState<PowerCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<CardType | 'ALL'>('ALL');
  const [speedFilter, setSpeedFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchPowerCards()
      .then(setCards)
      .catch(() => setError('Failed to load power cards'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return cards.filter(card => {
      if (typeFilter !== 'ALL' && card.cardType !== typeFilter) return false;
      if (speedFilter !== 'ALL' && card.speed !== speedFilter) return false;
      if (search && !card.name.toLowerCase().includes(search.toLowerCase())
          && !(card.description ?? '').toLowerCase().includes(search.toLowerCase())
          && !(card.elements ?? '').toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [cards, search, typeFilter, speedFilter]);

  if (loading) return <Box sx={{ textAlign: 'center', py: 8 }}><CircularProgress sx={{ color: SI_COLORS.forestMid }} /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" sx={{ color: SI_COLORS.forestDark, mb: 3, fontWeight: 700 }}>
        Power Cards
      </Typography>

      {/* Filters */}
      <Paper elevation={0} sx={{
        bgcolor: SI_COLORS.cardBg,
        border: `1px solid ${SI_COLORS.parchmentDark}`,
        borderRadius: 3,
        p: 2.5,
        mb: 3,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        alignItems: { sm: 'center' },
      }}>
        <TextField
          placeholder="Search cards..."
          size="small"
          value={search}
          onChange={e => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: SI_COLORS.textMuted }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ minWidth: 200, flexGrow: 1 }}
        />

        <ToggleButtonGroup
          size="small"
          value={typeFilter}
          exclusive
          onChange={(_, v) => v && setTypeFilter(v)}
          sx={{ '& .MuiToggleButton-root': { fontSize: '0.75rem', px: 2 } }}
        >
          <ToggleButton value="ALL">All</ToggleButton>
          <ToggleButton value="UNIQUE">Unique</ToggleButton>
          <ToggleButton value="MINOR">Minor</ToggleButton>
          <ToggleButton value="MAJOR">Major</ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          size="small"
          value={speedFilter}
          exclusive
          onChange={(_, v) => v && setSpeedFilter(v)}
          sx={{ '& .MuiToggleButton-root': { fontSize: '0.75rem', px: 2 } }}
        >
          <ToggleButton value="ALL">All</ToggleButton>
          <ToggleButton value="FAST">Fast</ToggleButton>
          <ToggleButton value="SLOW">Slow</ToggleButton>
        </ToggleButtonGroup>
      </Paper>

      <Typography variant="body2" sx={{ color: SI_COLORS.textMuted, mb: 2 }}>
        {filtered.length} card{filtered.length !== 1 ? 's' : ''}
      </Typography>

      <Grid container spacing={2}>
        {filtered.map(card => (
          <Grid key={card.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper elevation={0} sx={{
              bgcolor: SI_COLORS.cardBg,
              border: `1px solid ${SI_COLORS.parchmentDark}`,
              borderRadius: 3,
              p: 2.5,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              transition: 'border-color 0.2s',
              '&:hover': { borderColor: SI_COLORS.forestLight },
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                <Typography sx={{ fontWeight: 700, color: SI_COLORS.textPrimary, fontSize: '0.9rem', lineHeight: 1.3 }}>
                  {card.name}
                </Typography>
                <Chip
                  label={card.cost}
                  size="small"
                  sx={{
                    bgcolor: SI_COLORS.goldLight + '30',
                    color: SI_COLORS.goldDark,
                    fontWeight: 700,
                    minWidth: 28,
                    flexShrink: 0,
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                <Chip
                  label={card.cardType}
                  size="small"
                  sx={{
                    bgcolor: card.cardType === 'MAJOR' ? '#1565c018' : card.cardType === 'UNIQUE' ? SI_COLORS.spiritPurple + '18' : '#79554818',
                    color: card.cardType === 'MAJOR' ? '#0d47a1' : card.cardType === 'UNIQUE' ? SI_COLORS.spiritPurple : '#795548',
                    fontWeight: 600,
                    fontSize: '0.65rem',
                  }}
                />
                <Chip
                  icon={card.speed === 'FAST'
                    ? <BoltIcon sx={{ fontSize: 14 }} />
                    : <HourglassBottomIcon sx={{ fontSize: 14 }} />}
                  label={card.speed}
                  size="small"
                  sx={{
                    bgcolor: card.speed === 'FAST' ? '#e5393518' : '#1565c018',
                    color: card.speed === 'FAST' ? '#c62828' : '#0d47a1',
                    fontWeight: 600,
                    fontSize: '0.65rem',
                    '& .MuiChip-icon': {
                      color: card.speed === 'FAST' ? '#c62828' : '#0d47a1',
                    },
                  }}
                />
              </Box>

              <ElementChips elements={card.elements} />

              {card.description && (
                <Typography variant="body2" sx={{
                  color: SI_COLORS.textSecondary,
                  fontSize: '0.78rem',
                  lineHeight: 1.5,
                  flexGrow: 1,
                }}>
                  {card.description}
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
