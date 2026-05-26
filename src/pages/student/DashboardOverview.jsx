import { useQuery } from '@tanstack/react-query';
import { Grid, CardContent, Typography, Skeleton, Chip, Alert } from '@mui/material';
import { api } from '../../api/client';
import { colors } from '../../theme/theme';
import { useAuthStore } from '../../store/authStore';
import GlassCard, { statCardSx } from '../../components/student/GlassCard';
import { formatCurrency } from '../../utils/currency';
import PageHeader from '../../components/student/PageHeader';
import StudentProfileCard from '../../components/student/StudentProfileCard';

export default function DashboardOverview() {
  const { profile } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ['student-dashboard'],
    queryFn: async () => (await api.get('/students/dashboard')).data.data,
  });

  if (isLoading) return <Skeleton variant="rounded" height={320} sx={{ borderRadius: 3 }} />;

  const student = data?.student || profile;
  const cards = [
    { label: 'Monthly Fee', value: formatCurrency(data?.amount), sub: data?.feeType === 'custom' ? 'Custom' : 'Default' },
    { label: 'Approved Payments', value: data?.approvedPayments ?? 0, sub: 'Total cleared' },
    { label: 'Academy UPI', value: data?.globalUPI || '—', sub: 'Global setting' },
    {
      label: 'Payment Status',
      value: data?.pendingPayment ? 'Pending' : 'Clear',
      sub: data?.pendingPayment ? `${data.pendingPayment.month}` : 'All good',
      warn: !!data?.pendingPayment,
    },
  ];

  return (
    <>
      <PageHeader title={`Welcome, ${student?.fullName?.split(' ')[0] || 'Shooter'}`} subtitle="Your academy dashboard at a glance" />
      <StudentProfileCard profile={student} />
      <Grid container spacing={2}>
        {cards.map((c, i) => (
          <Grid item xs={6} md={3} key={c.label}>
            <GlassCard delay={i * 0.08} sx={statCardSx}>
              <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                <Typography variant="caption" color="text.secondary">{c.label}</Typography>
                <Typography variant="h6" fontWeight={800} mt={0.5} sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                  {c.value}
                </Typography>
                <Typography variant="caption" color={c.warn ? 'warning.main' : 'text.secondary'}>
                  {c.sub}
                </Typography>
              </CardContent>
            </GlassCard>
          </Grid>
        ))}
      </Grid>
      {data?.pendingPayment && (
        <GlassCard delay={0.4} sx={{ mt: 2, bgcolor: colors.primaryMuted, borderColor: colors.primary }}>
          <CardContent>
            <Chip label="Action needed" color="warning" size="small" />
            <Typography mt={1} variant="body2">
              Payment for {data.pendingPayment.month} {data.pendingPayment.year} is awaiting admin approval.
            </Typography>
          </CardContent>
        </GlassCard>
      )}
      {data?.paymentInstructions && (
        <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>{data.paymentInstructions}</Alert>
      )}
    </>
  );
}
