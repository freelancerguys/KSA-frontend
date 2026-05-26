import { useQuery } from '@tanstack/react-query';
import { Box } from '@mui/material';
import { api } from '../api/client';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import AboutSection from '../components/AboutSection';
import CoachSection from '../components/CoachSection';
import GallerySection from '../components/GallerySection';
import ContentGridSection from '../components/ContentGridSection';

export default function LandingPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['public-content'],
    queryFn: async () => {
      const res = await api.get('/cms/public');
      return res.data.data;
    },
  });

  const settings = data?.settings || {};

  return (
    <Box>
      <Navbar />
      <Hero settings={settings} />

      <AboutSection aboutText={settings.aboutText} />

      <ContentGridSection
        id="achievements"
        subtitle="HALL OF FAME"
        title="Recent Achievements"
        items={data?.achievements || []}
        isLoading={isLoading}
        imageKey="image"
        descriptionKey="description"
        bgcolor="#f5f5f5"
        emptyMessage="Achievements will appear here soon."
      />

      <CoachSection />

      <GallerySection items={data?.gallery || []} />

      <ContentGridSection
        subtitle="LATEST"
        title="Recent Activities"
        items={data?.activities || []}
        isLoading={isLoading}
        imageKey="image"
        descriptionKey="caption"
        emptyMessage="Recent activities will appear here soon."
      />

      <ContentGridSection
        id="blogs"
        subtitle="INSIGHTS"
        title="Blogs"
        items={data?.blogs || []}
        isLoading={isLoading}
        imageKey="thumbnail"
        descriptionKey="excerpt"
        linkable
        bgcolor="#f5f5f5"
        emptyMessage="Blog posts will appear here soon."
      />

      <Footer settings={settings} />
    </Box>
  );
}
