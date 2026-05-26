import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Card, CardContent, Typography, Button, TextField, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { api } from '../../api/client';
import GlassCard from '../../components/student/GlassCard';
import PageHeader from '../../components/student/PageHeader';
export default function DiaryPage() {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const qc = useQueryClient();

  const { data: diaries } = useQuery({
    queryKey: ['diaries', search, dateFilter],
    queryFn: async () => {
      const params = {};
      if (search) params.search = search;
      if (dateFilter) params.date = dateFilter;
      return (await api.get('/diaries', { params })).data.data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = { title, content };
      if (editId) return api.put(`/diaries/${editId}`, payload);
      return api.post('/diaries', payload);
    },
    onSuccess: () => {
      qc.invalidateQueries(['diaries']);
      setOpen(false);
      setTitle('');
      setContent('');
      setEditId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/diaries/${id}`),
    onSuccess: () => qc.invalidateQueries(['diaries']),
  });

  const openEdit = (d) => {
    setEditId(d._id);
    setTitle(d.title);
    setContent(d.content);
    setOpen(true);
  };

  return (
    <Box>
      <PageHeader title="Diary / Notes" subtitle="Training notes and daily reflections" />
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="primary" size="large" startIcon={<AddIcon />} onClick={() => { setEditId(null); setTitle(''); setContent(''); setOpen(true); }}>
          New Entry
        </Button>
      </Box>
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth size="small" label="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth size="small" type="date" label="Filter by date" InputLabelProps={{ shrink: true }} value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {(diaries || []).map((d) => (
          <Grid item xs={12} md={6} key={d._id}>
            <GlassCard>
              <CardContent>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontWeight={700}>{d.title}</Typography>
                  <Box>
                    <IconButton size="small" onClick={() => openEdit(d)}><EditIcon /></IconButton>
                    <IconButton size="small" color="error" onClick={() => deleteMutation.mutate(d._id)}><DeleteIcon /></IconButton>
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary">{new Date(d.entryDate).toLocaleDateString()}</Typography>
                <Typography variant="body2" mt={1} dangerouslySetInnerHTML={{ __html: d.content }} />
              </CardContent>
            </GlassCard>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Edit Entry' : 'New Diary Entry'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} margin="normal" />
          <TextField fullWidth label="Notes (HTML supported)" value={content} onChange={(e) => setContent(e.target.value)} margin="normal" multiline rows={8} placeholder="Use basic HTML: <b>bold</b>, <ul><li>item</li></ul>" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={() => saveMutation.mutate()} disabled={!title || !content}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
