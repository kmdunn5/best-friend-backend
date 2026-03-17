import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import type { Spirit, Adversary } from '../types';
import { fetchSpirits, fetchAdversaries, createGame } from '../api';
import { SI_COLORS, SI_GRADIENTS } from '../siTheme';

interface SpiritEntry {
  spiritId: string;
  playerName: string;
  damageDealt: string;
  fearGenerated: string;
  citiesDestroyed: string;
  townsDestroyed: string;
  explorersDestroyed: string;
}

const emptySpiritEntry = (): SpiritEntry => ({
  spiritId: '', playerName: '', damageDealt: '', fearGenerated: '',
  citiesDestroyed: '', townsDestroyed: '', explorersDestroyed: '',
});

export default function GameForm() {
  const navigate = useNavigate();
  const [spirits, setSpirits] = useState<Spirit[]>([]);
  const [adversaries, setAdversaries] = useState<Adversary[]>([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [numPlayers, setNumPlayers] = useState('2');
  const [adversaryLevelId, setAdversaryLevelId] = useState('');
  const [result, setResult] = useState('WIN');
  const [lossReason, setLossReason] = useState('');
  const [victoryTerrorLevel, setVictoryTerrorLevel] = useState('');
  const [numRounds, setNumRounds] = useState('');
  const [boardSetup, setBoardSetup] = useState('');
  const [notes, setNotes] = useState('');
  const [spiritEntries, setSpiritEntries] = useState<SpiritEntry[]>([emptySpiritEntry(), emptySpiritEntry()]);

  useEffect(() => {
    Promise.all([fetchSpirits(), fetchAdversaries()])
      .then(([s, a]) => { setSpirits(s); setAdversaries(a); })
      .catch(() => setError('Failed to load reference data'));
  }, []);

  const addSpirit = () => setSpiritEntries([...spiritEntries, emptySpiritEntry()]);
  const removeSpirit = (idx: number) => setSpiritEntries(spiritEntries.filter((_, i) => i !== idx));
  const updateSpirit = (idx: number, field: keyof SpiritEntry, value: string) => {
    const updated = [...spiritEntries];
    updated[idx] = { ...updated[idx], [field]: value };
    setSpiritEntries(updated);
  };

  // Build adversary level options
  const advLevelOptions = adversaries.flatMap(adv =>
    adv.levels.map(lvl => ({
      id: lvl.id,
      label: `${adv.name} — Level ${lvl.level} (Difficulty ${lvl.difficulty})`,
    }))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const gameSpirits = spiritEntries
        .filter(s => s.spiritId && s.playerName)
        .map(s => ({
          spiritId: Number(s.spiritId),
          playerName: s.playerName,
          damageDealt: s.damageDealt ? Number(s.damageDealt) : null,
          fearGenerated: s.fearGenerated ? Number(s.fearGenerated) : null,
          citiesDestroyed: s.citiesDestroyed ? Number(s.citiesDestroyed) : null,
          townsDestroyed: s.townsDestroyed ? Number(s.townsDestroyed) : null,
          explorersDestroyed: s.explorersDestroyed ? Number(s.explorersDestroyed) : null,
        }));

      if (gameSpirits.length === 0) {
        setError('Add at least one spirit to the game');
        setSubmitting(false);
        return;
      }

      const data: Record<string, unknown> = {
        numPlayers: Number(numPlayers),
        result,
        spirits: gameSpirits,
      };
      if (adversaryLevelId) data.adversaryLevelId = Number(adversaryLevelId);
      if (result === 'LOSS' && lossReason) data.lossReason = lossReason;
      if (result === 'WIN' && victoryTerrorLevel) data.victoryTerrorLevel = Number(victoryTerrorLevel);
      if (numRounds) data.numRounds = Number(numRounds);
      if (boardSetup) data.boardSetup = boardSetup;
      if (notes) data.notes = notes;

      await createGame(data);
      navigate('/spirit-island/games');
    } catch {
      setError('Failed to save game');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/spirit-island/games')}
        sx={{ mb: 2, color: SI_COLORS.forestMid }}
      >
        Game Log
      </Button>

      <Typography variant="h4" sx={{ color: SI_COLORS.forestDark, mb: 3, fontWeight: 700 }}>
        Log a Game
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        {/* Game Setup */}
        <Paper elevation={0} sx={{
          bgcolor: SI_COLORS.cardBg,
          border: `1px solid ${SI_COLORS.parchmentDark}`,
          borderRadius: 3,
          p: 3,
          mb: 3,
        }}>
          <Typography variant="h6" sx={{ color: SI_COLORS.forestDark, fontWeight: 700, mb: 2 }}>
            Game Setup
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                select label="Players" fullWidth size="small"
                value={numPlayers} onChange={e => setNumPlayers(e.target.value)}
              >
                {[1, 2, 3, 4].map(n => <MenuItem key={n} value={String(n)}>{n}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 9 }}>
              <TextField
                select label="Adversary" fullWidth size="small"
                value={adversaryLevelId} onChange={e => setAdversaryLevelId(e.target.value)}
              >
                <MenuItem value="">No Adversary</MenuItem>
                {advLevelOptions.map(opt => (
                  <MenuItem key={opt.id} value={String(opt.id)}>{opt.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                label="Rounds" type="number" fullWidth size="small"
                value={numRounds} onChange={e => setNumRounds(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                label="Boards" placeholder="A,B" fullWidth size="small"
                value={boardSetup} onChange={e => setBoardSetup(e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Result */}
        <Paper elevation={0} sx={{
          bgcolor: SI_COLORS.cardBg,
          border: `1px solid ${SI_COLORS.parchmentDark}`,
          borderRadius: 3,
          p: 3,
          mb: 3,
        }}>
          <Typography variant="h6" sx={{ color: SI_COLORS.forestDark, fontWeight: 700, mb: 2 }}>
            Result
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                select label="Result" fullWidth size="small" required
                value={result} onChange={e => setResult(e.target.value)}
              >
                <MenuItem value="WIN">Win</MenuItem>
                <MenuItem value="LOSS">Loss</MenuItem>
              </TextField>
            </Grid>
            {result === 'WIN' && (
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField
                  select label="Terror Level" fullWidth size="small"
                  value={victoryTerrorLevel} onChange={e => setVictoryTerrorLevel(e.target.value)}
                >
                  {[1, 2, 3, 4].map(n => (
                    <MenuItem key={n} value={String(n)}>
                      {n === 4 ? 'Fear Deck Empty' : `Terror Level ${n}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
            {result === 'LOSS' && (
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField
                  select label="Loss Reason" fullWidth size="small"
                  value={lossReason} onChange={e => setLossReason(e.target.value)}
                >
                  <MenuItem value="BLIGHT">Blight Overrun</MenuItem>
                  <MenuItem value="SPIRIT_DESTROYED">Spirit Destroyed</MenuItem>
                  <MenuItem value="TIME_RAN_OUT">Time Ran Out</MenuItem>
                </TextField>
              </Grid>
            )}
          </Grid>
        </Paper>

        {/* Spirits */}
        <Paper elevation={0} sx={{
          bgcolor: SI_COLORS.cardBg,
          border: `1px solid ${SI_COLORS.parchmentDark}`,
          borderRadius: 3,
          p: 3,
          mb: 3,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: SI_COLORS.forestDark, fontWeight: 700 }}>
              Spirits Played
            </Typography>
            <Button size="small" startIcon={<AddIcon />} onClick={addSpirit}
              sx={{ color: SI_COLORS.forestMid }}>
              Add Spirit
            </Button>
          </Box>

          {spiritEntries.map((entry, idx) => (
            <Paper key={idx} elevation={0} sx={{
              bgcolor: SI_COLORS.parchment,
              borderRadius: 2,
              p: 2,
              mb: 2,
              border: `1px solid ${SI_COLORS.parchmentDark}`,
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ color: SI_COLORS.forestDark, fontWeight: 600 }}>
                  Player {idx + 1}
                </Typography>
                {spiritEntries.length > 1 && (
                  <IconButton size="small" onClick={() => removeSpirit(idx)} sx={{ color: '#c62828' }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select label="Spirit" fullWidth size="small" required
                    value={entry.spiritId} onChange={e => updateSpirit(idx, 'spiritId', e.target.value)}
                  >
                    {spirits.map(s => <MenuItem key={s.id} value={String(s.id)}>{s.name}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Player Name" fullWidth size="small" required
                    value={entry.playerName} onChange={e => updateSpirit(idx, 'playerName', e.target.value)}
                  />
                </Grid>

                <Grid size={{ xs: 4, sm: 2 }}>
                  <TextField label="Damage" type="number" fullWidth size="small"
                    value={entry.damageDealt} onChange={e => updateSpirit(idx, 'damageDealt', e.target.value)} />
                </Grid>
                <Grid size={{ xs: 4, sm: 2 }}>
                  <TextField label="Fear" type="number" fullWidth size="small"
                    value={entry.fearGenerated} onChange={e => updateSpirit(idx, 'fearGenerated', e.target.value)} />
                </Grid>
                <Grid size={{ xs: 4, sm: 2 }}>
                  <TextField label="Cities" type="number" fullWidth size="small"
                    value={entry.citiesDestroyed} onChange={e => updateSpirit(idx, 'citiesDestroyed', e.target.value)} />
                </Grid>
                <Grid size={{ xs: 4, sm: 2 }}>
                  <TextField label="Towns" type="number" fullWidth size="small"
                    value={entry.townsDestroyed} onChange={e => updateSpirit(idx, 'townsDestroyed', e.target.value)} />
                </Grid>
                <Grid size={{ xs: 4, sm: 2 }}>
                  <TextField label="Explorers" type="number" fullWidth size="small"
                    value={entry.explorersDestroyed} onChange={e => updateSpirit(idx, 'explorersDestroyed', e.target.value)} />
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Paper>

        {/* Notes */}
        <Paper elevation={0} sx={{
          bgcolor: SI_COLORS.cardBg,
          border: `1px solid ${SI_COLORS.parchmentDark}`,
          borderRadius: 3,
          p: 3,
          mb: 3,
        }}>
          <TextField
            label="Notes" multiline rows={3} fullWidth
            value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Any memorable moments or observations..."
          />
        </Paper>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={() => navigate('/spirit-island/games')}
            sx={{ borderColor: SI_COLORS.forestMid, color: SI_COLORS.forestMid }}>
            Cancel
          </Button>
          <Button
            type="submit" variant="contained" disabled={submitting}
            sx={{
              background: SI_GRADIENTS.goldAccent,
              color: SI_COLORS.forestDark,
              fontWeight: 700,
              '&:hover': { background: SI_GRADIENTS.goldAccent, filter: 'brightness(1.1)' },
            }}
          >
            {submitting ? 'Saving...' : 'Save Game'}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
