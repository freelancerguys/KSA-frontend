import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Chip,
  useMediaQuery,
  useTheme,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { api } from '../../api/client';
import { colors } from '../../theme/theme';
import GlassCard, { statCardSx } from '../../components/student/GlassCard';
import PageHeader from '../../components/student/PageHeader';
import {
  MAX_SHOT_SCORE,
  MAX_SHOTS_PER_SERIES,
  sumSeriesShots,
  sumSessionSeries,
  isValidShotValue,
  canAddShotToSeries,
  seriesShotCountLabel,
  formatShotList,
} from '../../utils/scores';

const emptySeries = () => [{ name: 'Series 1', shots: [], isComplete: false }];

function SessionSeriesEditor({
  series,
  setSeries,
  activeSeries,
  setActiveSeries,
  shotInput,
  setShotInput,
  isMobile,
  inputSize,
  shotError,
  setShotError,
}) {
  const activeShots = series[activeSeries]?.shots || [];
  const seriesFull = !canAddShotToSeries(activeShots);

  const addShot = () => {
    if (seriesFull) {
      setShotError(`Maximum ${MAX_SHOTS_PER_SERIES} shots per series`);
      return;
    }
    if (!isValidShotValue(shotInput)) {
      setShotError(`Enter a score from 0 to ${MAX_SHOT_SCORE}`);
      return;
    }
    setShotError('');
    const val = parseFloat(shotInput);
    const updated = [...series];
    updated[activeSeries].shots.push({ value: val });
    setSeries(updated);
    setShotInput('');
  };

  const addSeries = () => {
    setSeries([...series, { name: `Series ${series.length + 1}`, shots: [], isComplete: false }]);
    setActiveSeries(series.length);
  };

  const removeShot = (seriesIdx, shotIdx) => {
    const updated = [...series];
    updated[seriesIdx].shots = updated[seriesIdx].shots.filter((_, i) => i !== shotIdx);
    setSeries(updated);
  };

  return (
    <>
      <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
        {series.map((s, i) => (
          <Chip
            key={i}
            label={`${s.name} ${seriesShotCountLabel(s.shots)} · ${sumSeriesShots(s.shots)}`}
            onClick={() => setActiveSeries(i)}
            color={activeSeries === i ? 'primary' : 'default'}
            sx={{ minHeight: isMobile ? 40 : 32 }}
          />
        ))}
        <Chip icon={<AddIcon />} label="Series" onClick={addSeries} variant="outlined" sx={{ minHeight: isMobile ? 40 : 32 }} />
      </Box>
      <Grid container spacing={1} alignItems="stretch">
        <Grid item xs={8} sm={9}>
          <TextField
            fullWidth
            label="Shot score"
            type="number"
            size={inputSize}
            error={!!shotError}
            helperText={
              shotError
              || (seriesFull
                ? `This series is full (${MAX_SHOTS_PER_SERIES}/${MAX_SHOTS_PER_SERIES} shots)`
                : `${seriesShotCountLabel(activeShots)} · max score ${MAX_SHOT_SCORE}`)
            }
            inputProps={{ min: 0, max: MAX_SHOT_SCORE, step: 0.1, style: { fontSize: isMobile ? '1.25rem' : '1rem' } }}
            value={shotInput}
            onChange={(e) => {
              setShotInput(e.target.value);
              if (shotError) setShotError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && addShot()}
          />
        </Grid>
        <Grid item xs={4} sm={3}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            onClick={addShot}
            disabled={seriesFull}
            sx={{ height: '100%', minHeight: 48 }}
          >
            Add
          </Button>
        </Grid>
      </Grid>
      <Box mt={2} display="flex" flexWrap="wrap" gap={0.75}>
        {series[activeSeries]?.shots.map((sh, i) => (
          <Chip
            key={i}
            label={sh.value}
            onDelete={() => removeShot(activeSeries, i)}
            sx={{ bgcolor: colors.primary, color: colors.secondary, fontWeight: 700, fontSize: isMobile ? '0.95rem' : '0.8rem', height: isMobile ? 36 : 28 }}
          />
        ))}
      </Box>
      <Box mt={2} p={1.5} borderRadius={2} sx={{ bgcolor: colors.primaryMuted, border: `1px solid ${colors.border}` }}>
        <Typography variant="body2" fontWeight={700}>
          {series[activeSeries]?.name}: {seriesShotCountLabel(series[activeSeries]?.shots)} · total{' '}
          {sumSeriesShots(series[activeSeries]?.shots)}
        </Typography>
        <Typography variant="body2" fontWeight={800} color={colors.text}>
          All series total: {sumSessionSeries(series)}
        </Typography>
      </Box>
    </>
  );
}

export default function ScoresPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().slice(0, 10));
  const [series, setSeries] = useState(emptySeries());
  const [shotInput, setShotInput] = useState('');
  const [activeSeries, setActiveSeries] = useState(0);
  const [shotError, setShotError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editSeries, setEditSeries] = useState(emptySeries());
  const [editActiveSeries, setEditActiveSeries] = useState(0);
  const [editShotInput, setEditShotInput] = useState('');
  const [editShotError, setEditShotError] = useState('');
  const qc = useQueryClient();

  const { data } = useQuery({
    queryKey: ['scores'],
    queryFn: async () => (await api.get('/scores')).data.data,
  });

  const { data: analytics } = useQuery({
    queryKey: ['score-analytics'],
    queryFn: async () => (await api.get('/scores/analytics')).data.data,
  });

  const saveMutation = useMutation({
    mutationFn: () => api.post('/scores', { sessionDate, series }),
    onSuccess: () => {
      qc.invalidateQueries(['scores', 'score-analytics']);
      setSeries(emptySeries());
      setActiveSeries(0);
      setShotError('');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => api.put(`/scores/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries(['scores', 'score-analytics']);
      setEditOpen(false);
      setEditingSession(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/scores/${id}`),
    onSuccess: () => {
      qc.invalidateQueries(['scores', 'score-analytics']);
      setEditOpen(false);
      setEditingSession(null);
    },
  });

  const openEdit = (session) => {
    setEditingSession(session);
    setEditDate(new Date(session.sessionDate).toISOString().slice(0, 10));
    setEditSeries(
      session.series?.length
        ? session.series.map((s, i) => ({
            name: s.name || `Series ${i + 1}`,
            shots: [...(s.shots || [])],
            isComplete: s.isComplete || false,
          }))
        : emptySeries(),
    );
    setEditActiveSeries(0);
    setEditShotInput('');
    setEditShotError('');
    setEditOpen(true);
  };

  const stats = data?.stats || analytics?.stats || {};
  const inputSize = isMobile ? 'medium' : 'small';

  return (
    <>
      <PageHeader title="Shooting Scores" subtitle="Log practice sessions and track progress" />

      <Grid container spacing={2} mb={2}>
        {[
          { label: 'Total Shots', value: stats.totalShots },
          { label: 'Average', value: stats.average },
          { label: 'Best', value: stats.best },
          { label: 'Sessions', value: stats.sessions },
        ].map((s, i) => (
          <Grid item xs={6} md={3} key={s.label}>
            <GlassCard delay={i * 0.05} sx={statCardSx}>
              <CardContent sx={{ p: 1.5 }}>
                <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                <Typography variant="h6" fontWeight={800}>{s.value ?? 0}</Typography>
              </CardContent>
            </GlassCard>
          </Grid>
        ))}
      </Grid>

      <GlassCard delay={0.1}>
        <CardContent>
          <Typography fontWeight={700} mb={1}>Log session</Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Up to {MAX_SHOTS_PER_SERIES} shots per series (min 1 to save). Each shot: 0–{MAX_SHOT_SCORE}.
          </Typography>
          <TextField
            fullWidth
            type="date"
            label="Session date"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />
          <SessionSeriesEditor
            series={series}
            setSeries={setSeries}
            activeSeries={activeSeries}
            setActiveSeries={setActiveSeries}
            shotInput={shotInput}
            setShotInput={setShotInput}
            isMobile={isMobile}
            inputSize={inputSize}
            shotError={shotError}
            setShotError={setShotError}
          />
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            size="large"
            sx={{ mt: 2, py: 1.5 }}
            disabled={!series.some((s) => s.shots.length > 0) || saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
          >
            {saveMutation.isPending ? 'Saving…' : 'Save session'}
          </Button>
        </CardContent>
      </GlassCard>

      <Grid container spacing={2} mt={0}>
        <Grid item xs={12} md={6}>
          <GlassCard delay={0.15}>
            <CardContent>
              <Typography fontWeight={700} mb={1}>Weekly progress</Typography>
              <Box sx={{ width: '100%', height: { xs: 200, md: 220 } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics?.weekly || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, MAX_SHOT_SCORE]} width={30} />
                    <Tooltip />
                    <Line type="monotone" dataKey="average" stroke={colors.primary} strokeWidth={2} dot />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </GlassCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <GlassCard delay={0.2}>
            <CardContent>
              <Typography fontWeight={700} mb={1}>Monthly accuracy</Typography>
              <Box sx={{ width: '100%', height: { xs: 200, md: 220 } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.monthly || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, MAX_SHOT_SCORE]} width={30} />
                    <Tooltip />
                    <Bar dataKey="average" fill={colors.secondary} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </GlassCard>
        </Grid>
      </Grid>

      <Typography fontWeight={700} mt={3} mb={1.5}>Session history</Typography>
      {(data?.sessions || []).length === 0 && (
        <Typography color="text.secondary">No sessions logged yet.</Typography>
      )}
      {(data?.sessions || []).map((session, i) => (
        <GlassCard key={session._id} delay={0.05 * i} sx={{ mb: 1.5 }}>
          <CardContent sx={{ py: 1.5 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
              <Box flex={1} minWidth={0}>
                <Typography fontWeight={800}>
                  {new Date(session.sessionDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </Typography>
                {session.series.map((s, idx) => (
                  <Box key={idx} mt={1}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>{s.name}:</strong> {formatShotList(s.shots)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.textMuted }}>
                      {seriesShotCountLabel(s.shots)} · series total: <strong>{sumSeriesShots(s.shots)}</strong>
                    </Typography>
                  </Box>
                ))}
                <Typography variant="body2" fontWeight={800} mt={1.5} sx={{ color: colors.secondary }}>
                  Session total (all series): {sumSessionSeries(session.series)}
                </Typography>
              </Box>
              <IconButton
                aria-label="Edit session"
                onClick={() => openEdit(session)}
                sx={{ border: `1px solid ${colors.border}`, borderRadius: 2 }}
              >
                <EditIcon />
              </IconButton>
            </Box>
          </CardContent>
        </GlassCard>
      ))}

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Edit session</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="date"
            label="Session date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />
          <SessionSeriesEditor
            series={editSeries}
            setSeries={setEditSeries}
            activeSeries={editActiveSeries}
            setActiveSeries={setEditActiveSeries}
            shotInput={editShotInput}
            setShotInput={setEditShotInput}
            isMobile={isMobile}
            inputSize={inputSize}
            shotError={editShotError}
            setShotError={setEditShotError}
          />
          {updateMutation.isError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              Could not save session. Each series allows up to {MAX_SHOTS_PER_SERIES} shots (0–{MAX_SHOT_SCORE} each).
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Button
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => {
              if (window.confirm('Delete this session permanently?')) {
                deleteMutation.mutate(editingSession._id);
              }
            }}
            disabled={deleteMutation.isPending}
          >
            Delete
          </Button>
          <Box flex={1} />
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={updateMutation.isPending || !editSeries.some((s) => s.shots.length > 0)}
            onClick={() =>
              updateMutation.mutate({
                id: editingSession._id,
                payload: { sessionDate: editDate, series: editSeries },
              })
            }
          >
            {updateMutation.isPending ? 'Saving…' : 'Save changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
