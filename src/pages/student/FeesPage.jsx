import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, CardContent, Typography, Button, TextField, Grid, Alert, Chip, Skeleton,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { api } from '../../api/client';
import { colors } from '../../theme/theme';
import GlassCard, { statCardSx } from '../../components/student/GlassCard';
import PageHeader from '../../components/student/PageHeader';
import ResponsiveDataList, { StatusChip } from '../../components/student/ResponsiveDataList';
import { formatCurrency } from '../../utils/currency';

export default function FeesPage() {
  const [transactionId, setTransactionId] = useState('');
  const [file, setFile] = useState(null);
  const qc = useQueryClient();

  const { data: feeInfo } = useQuery({
    queryKey: ['student-dashboard'],
    queryFn: async () => (await api.get('/students/dashboard')).data.data,
  });

  const { data: qr, isLoading: qrLoading, refetch } = useQuery({
    queryKey: ['upi-qr', feeInfo?.amount],
    queryFn: async () => (await api.get('/payments/qr')).data.data,
    enabled: !!feeInfo,
  });

  const { data: payments } = useQuery({
    queryKey: ['my-payments'],
    queryFn: async () => (await api.get('/payments/my')).data.data,
  });

  const { data: invoices } = useQuery({
    queryKey: ['my-invoices'],
    queryFn: async () => (await api.get('/payments/invoices')).data.data,
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const form = new FormData();
      form.append('proof', file);
      form.append('transactionId', transactionId.trim());
      return api.post('/payments/submit', form);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-payments'] });
      qc.invalidateQueries({ queryKey: ['student-dashboard'] });
      qc.invalidateQueries({ queryKey: ['upi-qr'] });
      setFile(null);
      setTransactionId('');
    },
  });

  const downloadQr = () => {
    if (!qr?.dataUrl) return;
    const a = document.createElement('a');
    a.href = qr.dataUrl;
    a.download = 'upi-qr.png';
    a.click();
  };

  const downloadInvoice = async (inv) => {
    const res = await api.get(`/invoices/download/${inv._id}`, { responseType: 'blob' });
    const disposition = res.headers['content-disposition'] || '';
    const match = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";\n]+)"?/i);
    const filename = match?.[1] || inv.downloadFilename || `${inv.invoiceNumber}.pdf`;
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = decodeURIComponent(filename);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const pending = feeInfo?.pendingPayment;
  const paymentRows = (payments || feeInfo?.feeHistory || []).map((p) => ({ ...p, id: p._id }));

  return (
    <>
      <PageHeader title="Fees & Payment" subtitle="Scan UPI QR, pay, and upload your screenshot" />

      <Grid container spacing={2} mb={2}>
        {[
          { label: 'Amount', value: formatCurrency(feeInfo?.amount), sub: feeInfo?.feeType === 'custom' ? 'Custom fee' : 'Default fee' },
          { label: 'Due', value: `${feeInfo?.dueDay ?? 5}th`, sub: 'Each month' },
          { label: 'Status', value: pending ? 'Pending' : 'Clear', sub: pending ? 'Awaiting approval' : 'OK', warn: pending },
          { label: 'UPI', value: qr?.upiId || '—', sub: 'Academy global' },
        ].map((c, i) => (
          <Grid item xs={6} key={c.label}>
            <GlassCard delay={i * 0.06} sx={statCardSx}>
              <CardContent sx={{ p: 1.5 }}>
                <Typography variant="caption" color="text.secondary">{c.label}</Typography>
                <Typography fontWeight={800} variant="body1">{c.value}</Typography>
                <Typography variant="caption" color={c.warn ? 'warning.main' : 'text.secondary'}>{c.sub}</Typography>
              </CardContent>
            </GlassCard>
          </Grid>
        ))}
      </Grid>

      <GlassCard delay={0.1}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Typography fontWeight={700} mb={2} textAlign="center">Pay via UPI</Typography>
          {qrLoading ? (
            <Skeleton variant="rounded" height={280} sx={{ maxWidth: 320, mx: 'auto' }} />
          ) : (
            <Box
              sx={{
                maxWidth: 320,
                mx: 'auto',
                p: 2,
                bgcolor: '#fff',
                borderRadius: 3,
                border: `2px solid ${colors.primary}`,
                textAlign: 'center',
              }}
            >
              {qr?.dataUrl && (
                <img src={qr.dataUrl} alt="UPI QR" style={{ width: '100%', height: 'auto', display: 'block' }} />
              )}
              <Typography mt={2} fontWeight={700} fontSize="1.25rem">{formatCurrency(qr?.amount)}</Typography>
              <Typography variant="body2" color="text.secondary">{qr?.upiId}</Typography>
            </Box>
          )}
          <Box mt={2} display="flex" gap={1} flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="center">
            <Button fullWidth variant="outlined" onClick={() => refetch()}>Refresh QR</Button>
            <Button fullWidth variant="contained" color="primary" startIcon={<DownloadIcon />} onClick={downloadQr}>
              Download
            </Button>
          </Box>
        </CardContent>
      </GlassCard>

      <GlassCard delay={0.2} sx={{ mt: 2 }}>
        <CardContent>
          <Typography fontWeight={700} mb={1}>Upload payment proof</Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            You can submit multiple payments in the same month (e.g. partial fees or extra sessions).
          </Typography>
          <TextField
            fullWidth
            label="Transaction ID / UTR"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            margin="normal"
            size="medium"
          />
          <Button
            fullWidth
            variant="outlined"
            component="label"
            size="large"
            startIcon={<UploadFileIcon />}
            sx={{
              mt: 1,
              py: 1.5,
              ...(file
                ? { borderStyle: 'dashed', borderColor: colors.primary, bgcolor: colors.primaryMuted, color: colors.text }
                : { borderStyle: 'dashed', borderColor: colors.border, color: colors.text }),
            }}
          >
            {file ? file.name : 'Tap to choose screenshot'}
            <input type="file" hidden accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            size="large"
            sx={{ mt: 2, py: 1.5 }}
            disabled={!file || !transactionId.trim() || submitMutation.isPending}
            onClick={() => submitMutation.mutate()}
          >
            {submitMutation.isPending ? 'Submitting…' : 'Submit for approval'}
          </Button>
          {submitMutation.isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {submitMutation.error?.response?.data?.message || 'Submission failed. Please try again.'}
            </Alert>
          )}
          {submitMutation.isSuccess && <Alert severity="success" sx={{ mt: 2 }}>Submitted successfully</Alert>}
        </CardContent>
      </GlassCard>

      <GlassCard delay={0.3} sx={{ mt: 2 }}>
        <CardContent>
          <Typography fontWeight={700} mb={2}>Payment history</Typography>
          <ResponsiveDataList
            rows={paymentRows}
            columns={[
              { field: 'period', label: 'Period', render: (r) => `${r.month} ${r.year}` },
              { field: 'amount', label: 'Amount', render: (r) => formatCurrency(r.amount) },
              { field: 'utr', label: 'UTR', render: (r) => r.transactionId || '—' },
              { field: 'status', label: 'Status', render: (r) => <StatusChip status={r.status} /> },
            ]}
            renderMobileCard={(r) => (
              <>
                <Typography fontWeight={700}>{r.month} {r.year}</Typography>
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Typography>{formatCurrency(r.amount)}</Typography>
                  <StatusChip status={r.status} />
                </Box>
              </>
            )}
          />
        </CardContent>
      </GlassCard>

      {(invoices || []).length > 0 && (
        <GlassCard delay={0.35} sx={{ mt: 2 }}>
          <CardContent>
            <Typography fontWeight={700} mb={2}>Invoices</Typography>
            {invoices.map((inv) => (
              <Box key={inv._id} display="flex" justifyContent="space-between" alignItems="center" py={1.5}
                sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" fontWeight={600}>{inv.invoiceNumber}</Typography>
                <Button size="small" startIcon={<DownloadIcon />} onClick={() => downloadInvoice(inv)}>PDF</Button>
              </Box>
            ))}
          </CardContent>
        </GlassCard>
      )}
    </>
  );
}
