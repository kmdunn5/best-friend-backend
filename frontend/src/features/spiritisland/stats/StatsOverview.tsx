import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import type { OverviewStats, SpiritStats, AdversaryStats, MatchupStats } from '../types';
import { LOSS_REASON_LABELS, type LossReason } from '../types';
import {
  fetchOverviewStats, fetchSpiritStats,
  fetchAdversaryStats, fetchMatchupStats,
} from '../api';
import { SI_COLORS, SI_GRADIENTS } from '../siTheme';

function MetricCard({ label, value, subtitle }: { label: string; value: string | number; subtitle?: string }) {
  return (
    <Paper elevation={0} sx={{
      bgcolor: SI_COLORS.cardBg,
      border: `1px solid ${SI_COLORS.parchmentDark}`,
      borderRadius: 3,
      p: 3,
      textAlign: 'center',
    }}>
      <Typography variant="h3" sx={{ fontWeight: 800, color: SI_COLORS.forestDark, fontSize: { xs: '1.8rem', sm: '2.2rem' } }}>
        {value}
      </Typography>
      <Typography variant="subtitle2" sx={{ color: SI_COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem' }}>
        {label}
      </Typography>
      {subtitle && (
        <Typography variant="caption" sx={{ color: SI_COLORS.textSecondary, display: 'block', mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
}

function WinRateBar({ rate, label }: { rate: number; label?: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
      {label && (
        <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'right', fontWeight: 700, color: SI_COLORS.textPrimary, fontSize: '0.8rem' }}>
          {rate}%
        </Typography>
      )}
      <Box sx={{ flexGrow: 1 }}>
        <LinearProgress
          variant="determinate"
          value={rate}
          sx={{
            height: 10,
            borderRadius: 5,
            bgcolor: SI_COLORS.parchmentDark,
            '& .MuiLinearProgress-bar': {
              background: rate >= 60 ? SI_GRADIENTS.statBar : rate >= 40 ? SI_COLORS.gold : '#c62828',
              borderRadius: 5,
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default function StatsOverview() {
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [spiritStats, setSpiritStats] = useState<SpiritStats[]>([]);
  const [adversaryStats, setAdversaryStats] = useState<AdversaryStats[]>([]);
  const [matchupStats, setMatchupStats] = useState<MatchupStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [includeFake, setIncludeFake] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchOverviewStats(includeFake),
      fetchSpiritStats(includeFake),
      fetchAdversaryStats(includeFake),
      fetchMatchupStats(includeFake),
    ])
      .then(([o, s, a, m]) => { setOverview(o); setSpiritStats(s); setAdversaryStats(a); setMatchupStats(m); })
      .catch(() => setError('Failed to load stats'))
      .finally(() => setLoading(false));
  }, [includeFake]);

  if (loading) return <Box sx={{ textAlign: 'center', py: 8 }}><CircularProgress sx={{ color: SI_COLORS.forestMid }} /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!overview) return null;

  const playedSpirits = spiritStats.filter(s => s.gamesPlayed > 0);
  const playedAdversaries = adversaryStats.filter(a => a.gamesPlayed > 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ color: SI_COLORS.forestDark, fontWeight: 700 }}>
          Stats Dashboard
        </Typography>
        <FormControlLabel
          control={<Switch checked={includeFake} onChange={e => setIncludeFake(e.target.checked)}
            sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: SI_COLORS.forestMid },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: SI_COLORS.forestLight } }} />}
          label={<Typography variant="body2" sx={{ color: SI_COLORS.textMuted }}>Include test data</Typography>}
        />
      </Box>

      {overview.totalGames === 0 ? (
        <Paper elevation={0} sx={{ bgcolor: SI_COLORS.cardBg, border: `1px solid ${SI_COLORS.parchmentDark}`, borderRadius: 3, p: 6, textAlign: 'center' }}>
          <Typography sx={{ color: SI_COLORS.textMuted }}>No games to analyze yet. Log some games first!</Typography>
        </Paper>
      ) : (
        <>
          {/* Overview Metrics */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <MetricCard label="Games Played" value={overview.totalGames} />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <MetricCard label="Win Rate" value={`${overview.winRate}%`} subtitle={`${overview.totalWins}W / ${overview.totalLosses}L`} />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <MetricCard label="Avg Terror Level" value={overview.avgTerrorLevel ?? '—'} subtitle="at victory" />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <MetricCard label="Avg Rounds" value={overview.avgRounds ?? '—'}
                subtitle={overview.mostCommonLossReason ? `Top loss: ${LOSS_REASON_LABELS[overview.mostCommonLossReason as LossReason] ?? overview.mostCommonLossReason}` : undefined} />
            </Grid>
          </Grid>

          {/* Spirit Stats */}
          {playedSpirits.length > 0 && (
            <Paper elevation={0} sx={{
              bgcolor: SI_COLORS.cardBg,
              border: `1px solid ${SI_COLORS.parchmentDark}`,
              borderRadius: 3,
              overflow: 'hidden',
              mb: 4,
            }}>
              <Box sx={{ px: 3, py: 2, bgcolor: SI_COLORS.parchment, borderBottom: `1px solid ${SI_COLORS.parchmentDark}` }}>
                <Typography variant="h6" sx={{ color: SI_COLORS.forestDark, fontWeight: 700 }}>
                  Spirit Performance
                </Typography>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: SI_COLORS.textSecondary }}>Spirit</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: SI_COLORS.textSecondary }} align="center">Games</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: SI_COLORS.textSecondary, minWidth: 180 }}>Win Rate</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: SI_COLORS.textSecondary, display: { xs: 'none', sm: 'table-cell' } }} align="center">Avg Dmg</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: SI_COLORS.textSecondary, display: { xs: 'none', sm: 'table-cell' } }} align="center">Avg Fear</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: SI_COLORS.textSecondary, display: { xs: 'none', md: 'table-cell' } }} align="center">Avg Kills</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {playedSpirits.map(s => (
                      <TableRow key={s.id} sx={{ '&:hover': { bgcolor: SI_COLORS.parchment } }}>
                        <TableCell sx={{ fontWeight: 600, color: SI_COLORS.textPrimary, fontSize: '0.85rem' }}>
                          {s.spiritName}
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={`${s.wins}W ${s.losses}L`} size="small" sx={{
                            bgcolor: SI_COLORS.forestDark + '14',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }} />
                        </TableCell>
                        <TableCell>
                          <WinRateBar rate={s.winRate} label="rate" />
                        </TableCell>
                        <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' }, fontWeight: 600 }}>
                          {s.avgDamageDealt}
                        </TableCell>
                        <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' }, fontWeight: 600 }}>
                          {s.avgFearGenerated}
                        </TableCell>
                        <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' }, fontWeight: 600 }}>
                          {s.avgCitiesDestroyed + s.avgTownsDestroyed + s.avgExplorersDestroyed}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/* Adversary Stats */}
          {playedAdversaries.length > 0 && (
            <Paper elevation={0} sx={{
              bgcolor: SI_COLORS.cardBg,
              border: `1px solid ${SI_COLORS.parchmentDark}`,
              borderRadius: 3,
              overflow: 'hidden',
              mb: 4,
            }}>
              <Box sx={{ px: 3, py: 2, bgcolor: SI_COLORS.parchment, borderBottom: `1px solid ${SI_COLORS.parchmentDark}` }}>
                <Typography variant="h6" sx={{ color: SI_COLORS.forestDark, fontWeight: 700 }}>
                  Adversary Record
                </Typography>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: SI_COLORS.textSecondary }}>Adversary</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: SI_COLORS.textSecondary }} align="center">Level</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: SI_COLORS.textSecondary }} align="center">Diff.</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: SI_COLORS.textSecondary }} align="center">Record</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: SI_COLORS.textSecondary, minWidth: 150 }}>Win Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {playedAdversaries.map(a => (
                      <TableRow key={a.id} sx={{ '&:hover': { bgcolor: SI_COLORS.parchment } }}>
                        <TableCell sx={{ fontWeight: 600, color: SI_COLORS.textPrimary, fontSize: '0.85rem' }}>
                          {a.adversaryName}
                        </TableCell>
                        <TableCell align="center">{a.level}</TableCell>
                        <TableCell align="center">
                          <Chip label={a.difficulty} size="small" sx={{
                            bgcolor: a.difficulty <= 3 ? '#2e7d3218' : a.difficulty <= 6 ? '#f57f1718' : '#c6282818',
                            color: a.difficulty <= 3 ? '#2e7d32' : a.difficulty <= 6 ? '#f57f17' : '#c62828',
                            fontWeight: 700,
                            fontSize: '0.7rem',
                          }} />
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={`${a.wins}W ${a.losses}L`} size="small" sx={{
                            bgcolor: SI_COLORS.forestDark + '14',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }} />
                        </TableCell>
                        <TableCell>
                          <WinRateBar rate={a.winRate} label="rate" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/* Matchup Matrix */}
          {matchupStats.length > 0 && (
            <Paper elevation={0} sx={{
              bgcolor: SI_COLORS.cardBg,
              border: `1px solid ${SI_COLORS.parchmentDark}`,
              borderRadius: 3,
              overflow: 'hidden',
            }}>
              <Box sx={{ px: 3, py: 2, bgcolor: SI_COLORS.parchment, borderBottom: `1px solid ${SI_COLORS.parchmentDark}` }}>
                <Typography variant="h6" sx={{ color: SI_COLORS.forestDark, fontWeight: 700 }}>
                  Spirit vs Adversary Matchups
                </Typography>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: SI_COLORS.textSecondary }}>Spirit</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: SI_COLORS.textSecondary }}>Adversary</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: SI_COLORS.textSecondary }} align="center">Lvl</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: SI_COLORS.textSecondary }} align="center">Games</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: SI_COLORS.textSecondary, minWidth: 120 }}>Win Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {matchupStats.map(m => (
                      <TableRow key={m.id} sx={{ '&:hover': { bgcolor: SI_COLORS.parchment } }}>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{m.spiritName}</TableCell>
                        <TableCell sx={{ fontSize: '0.85rem' }}>{m.adversaryName}</TableCell>
                        <TableCell align="center">{m.adversaryLevel}</TableCell>
                        <TableCell align="center">{m.gamesPlayed}</TableCell>
                        <TableCell>
                          <WinRateBar rate={m.winRate} label="rate" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
}
