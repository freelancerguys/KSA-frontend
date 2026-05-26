import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  Dialog,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { motion } from 'framer-motion';
import { getUploadUrl } from '../api/client';
import SectionTitle from './SectionTitle';
import HorizontalMarquee from './HorizontalMarquee';
import { colors } from '../theme/theme';

const CAROUSEL_THRESHOLD = 4;

function GalleryCard({ item, onClick }) {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        overflow: 'hidden',
        borderRadius: 2,
        flexShrink: 0,
        '&:hover': { boxShadow: `0 12px 40px ${colors.primary}44` },
        '&:hover img': { transform: 'scale(1.06)' },
      }}
    >
      <CardMedia
        component="img"
        height="180"
        image={getUploadUrl(item.image)}
        alt={item.title || 'Gallery image'}
        loading="lazy"
        sx={{ transition: 'transform 0.35s', objectFit: 'cover' }}
      />
    </Card>
  );
}

export default function GallerySection({ items = [] }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const useCarousel = items.length > CAROUSEL_THRESHOLD;
  const loopItems = useCarousel ? [...items, ...items] : items;
  const scrollDuration = Math.max(items.length * 6, 24);

  const active = items[activeIndex];
  const hasMultiple = items.length > 1;

  const openAt = (index) => {
    setActiveIndex(index % items.length);
    setOpen(true);
  };

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i <= 0 ? items.length - 1 : i - 1));
  }, [items.length]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i >= items.length - 1 ? 0 : i + 1));
  }, [items.length]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, goPrev, goNext]);

  if (!items.length) return null;

  return (
    <Box id="gallery" className="section" sx={{ bgcolor: '#f5f5f5' }}>
      <Container maxWidth="lg">
        <SectionTitle subtitle="MOMENTS" title="Gallery" />
      </Container>

      {useCarousel ? (
        <Box sx={{ mt: 1 }}>
          <HorizontalMarquee duration={scrollDuration} gap={2}>
            {loopItems.map((g, index) => (
              <Box
                key={`${g._id}-${index}`}
                sx={{
                  width: { xs: 260, sm: 300, md: 280 },
                  minWidth: { xs: 260, sm: 300, md: 280 },
                  flexShrink: 0,
                }}
              >
                <GalleryCard item={g} onClick={() => openAt(index)} />
              </Box>
            ))}
          </HorizontalMarquee>
        </Box>
      ) : (
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            {items.map((g, index) => (
              <Grid item xs={6} sm={4} md={3} key={g._id}>
                <motion.div whileHover={{ scale: 1.03 }}>
                  <GalleryCard item={g} onClick={() => openAt(index)} />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(0,0,0,0.92)',
            boxShadow: 'none',
            maxWidth: '100vw',
            width: '100%',
            m: 0,
            borderRadius: 0,
            minHeight: { xs: '100%', sm: 'auto' },
          },
        }}
        slotProps={{
          backdrop: { sx: { bgcolor: 'rgba(0,0,0,0.88)' } },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: { xs: '100dvh', sm: '90vh' },
            p: { xs: 2, sm: 4 },
            outline: 'none',
          }}
          onClick={() => setOpen(false)}
        >
          <IconButton
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            sx={{
              position: 'absolute',
              top: { xs: 8, sm: 16 },
              right: { xs: 8, sm: 16 },
              color: '#fff',
              bgcolor: 'rgba(255,255,255,0.12)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' },
              zIndex: 2,
            }}
          >
            <CloseIcon />
          </IconButton>

          {hasMultiple && (
            <>
              <IconButton
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                sx={{
                  position: 'absolute',
                  left: { xs: 4, sm: 16 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#fff',
                  bgcolor: 'rgba(255,255,255,0.12)',
                  '&:hover': { bgcolor: colors.primary, color: colors.secondary },
                  zIndex: 2,
                }}
              >
                <ChevronLeftIcon fontSize="large" />
              </IconButton>
              <IconButton
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                sx={{
                  position: 'absolute',
                  right: { xs: 4, sm: 16 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#fff',
                  bgcolor: 'rgba(255,255,255,0.12)',
                  '&:hover': { bgcolor: colors.primary, color: colors.secondary },
                  zIndex: 2,
                }}
              >
                <ChevronRightIcon fontSize="large" />
              </IconButton>
            </>
          )}

          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '100%',
              width: '100%',
            }}
          >
            {active?.image && (
              <Box
                component="img"
                src={getUploadUrl(active.image)}
                alt={active.title || 'Gallery image'}
                sx={{
                  maxWidth: '100%',
                  maxHeight: { xs: '75dvh', sm: '82vh' },
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: 1,
                  boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
                }}
              />
            )}
            {active?.title && (
              <Typography
                variant="h6"
                sx={{ color: '#fff', mt: 2, textAlign: 'center', fontWeight: 600 }}
              >
                {active.title}
              </Typography>
            )}
            {hasMultiple && (
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mt: 1 }}>
                {activeIndex + 1} / {items.length}
              </Typography>
            )}
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}
