import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Container, Typography, Skeleton, Button } from '@mui/material';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { colors } from '../theme/theme';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const res = await api.get(`/cms/blogs/slug/${slug}`);
      return res.data.data;
    },
  });

  if (isLoading) return <Container sx={{ py: 10 }}><Skeleton height={400} /></Container>;

  return (
    <Container maxWidth="md" sx={{ py: 10 }}>
      <Box sx={{ bgcolor: colors.secondary, py: 2, px: 2, mb: 3, borderRadius: 2, display: 'flex', justifyContent: 'center' }}>
        <Logo to="/" height={56} />
      </Box>
      <Button onClick={() => navigate('/')}>← Back</Button>
      <Typography variant="h3" fontWeight={800} mt={2}>{data?.title}</Typography>
      <Box mt={3} dangerouslySetInnerHTML={{ __html: data?.content || '' }} />
    </Container>
  );
}
