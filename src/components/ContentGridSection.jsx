import { Box, Container, Grid, Skeleton, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { getUploadUrl } from '../api/client';
import SectionTitle from './SectionTitle';
import ContentCard from './ContentCard';
import HorizontalMarquee from './HorizontalMarquee';
import { colors } from '../theme/theme';

const CAROUSEL_THRESHOLD = 3;

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const cardSlideWidth = {
  xs: 280,
  sm: 320,
  md: 360,
};

function CardSkeleton() {
  return (
    <Box
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        border: `1px solid ${colors.border}`,
        bgcolor: colors.background,
      }}
    >
      <Skeleton variant="rectangular" height={200} />
      <Box sx={{ p: 2.5 }}>
        <Skeleton width="80%" height={28} />
        <Skeleton width="100%" sx={{ mt: 1.5 }} />
        <Skeleton width="70%" />
      </Box>
    </Box>
  );
}

function renderCard(item, { imageKey, descriptionKey, linkable }) {
  const imageSrc = item[imageKey] ? getUploadUrl(item[imageKey]) : null;
  const description = item[descriptionKey] || '';
  const href = linkable && item.slug ? `/blogs/${item.slug}` : undefined;

  return (
    <ContentCard
      image={imageSrc}
      title={item.title}
      description={description}
      href={href}
      showReadMore={!!href}
    />
  );
}

export default function ContentGridSection({
  id,
  subtitle,
  title,
  items = [],
  isLoading = false,
  imageKey = 'image',
  descriptionKey = 'description',
  linkable = false,
  bgcolor,
  emptyMessage = 'No items to show yet.',
}) {
  const useCarousel = items.length > CAROUSEL_THRESHOLD;
  const loopItems = useCarousel ? [...items, ...items] : items;
  const scrollDuration = Math.max(items.length * 7, 28);
  const cardOpts = { imageKey, descriptionKey, linkable };

  return (
    <Box
      id={id}
      className="section"
      sx={{
        bgcolor: bgcolor || colors.background,
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <SectionTitle subtitle={subtitle} title={title} />
      </Container>

      {isLoading ? (
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {[1, 2, 3].map((i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <CardSkeleton />
              </Grid>
            ))}
          </Grid>
        </Container>
      ) : items.length === 0 ? (
        <Container maxWidth="lg">
          <Typography textAlign="center" color="text.secondary" py={4}>
            {emptyMessage}
          </Typography>
        </Container>
      ) : useCarousel ? (
        <HorizontalMarquee duration={scrollDuration} gap={3}>
          {loopItems.map((item, index) => (
            <Box
              key={`${item._id || item.slug}-${index}`}
              sx={{
                width: cardSlideWidth,
                minWidth: cardSlideWidth,
                flexShrink: 0,
              }}
            >
              {renderCard(item, cardOpts)}
            </Box>
          ))}
        </HorizontalMarquee>
      ) : (
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {items.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={item._id || item.slug || index}>
                <motion.div {...fadeUp} transition={{ delay: index * 0.08 }}>
                  {renderCard(item, cardOpts)}
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
    </Box>
  );
}
