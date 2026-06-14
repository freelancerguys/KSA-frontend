import { Box, Card, CardContent, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { Link } from 'react-router-dom';
import { colors } from '../theme/theme';

const IMAGE_HEIGHT = 200;

export default function ContentCard({
  image,
  title,
  description,
  href,
  showReadMore = false,
  serialNumber,
}) {
  const media = image ? (
    <Box
      sx={{
        position: 'relative',
        height: IMAGE_HEIGHT,
        overflow: 'hidden',
        bgcolor: colors.surfaceAlt,
      }}
    >
      <Box
        component="img"
        src={image}
        alt={title}
        loading="lazy"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
          transition: 'transform 0.45s ease',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, transparent 55%, rgba(17,17,17,0.35) 100%)',
          pointerEvents: 'none',
        }}
      />
      {serialNumber != null && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            minWidth: 32,
            height: 32,
            px: 1,
            borderRadius: 1.5,
            bgcolor: colors.primary,
            color: colors.secondary,
            fontWeight: 800,
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 1,
          }}
        >
          {String(serialNumber).padStart(2, '0')}
        </Box>
      )}
    </Box>
  ) : (
    <Box
      sx={{
        height: IMAGE_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: colors.surfaceAlt,
        background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.primaryMuted} 100%)`,
        position: 'relative',
      }}
    >
      {serialNumber != null && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            minWidth: 32,
            height: 32,
            px: 1,
            borderRadius: 1.5,
            bgcolor: colors.primary,
            color: colors.secondary,
            fontWeight: 800,
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {String(serialNumber).padStart(2, '0')}
        </Box>
      )}
      <ImageOutlinedIcon sx={{ fontSize: 48, color: colors.textMuted, opacity: 0.35 }} />
    </Box>
  );

  const body = (
    <>
      <Box sx={{ height: 5, bgcolor: colors.primary, flexShrink: 0 }} />
      {media}
      <CardContent
        sx={{
          p: { xs: 2, md: 2.5 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="h6"
          fontWeight={800}
          sx={{
            color: colors.text,
            fontSize: { xs: '1rem', md: '1.1rem' },
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {title}
        </Typography>
        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            mt={1.25}
            sx={{
              lineHeight: 1.65,
              flex: 1,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </Typography>
        )}
        {showReadMore && (
          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            mt={2}
            sx={{ color: colors.secondary, fontWeight: 700, fontSize: '0.875rem' }}
          >
            Read more
            <ArrowForwardIcon className="read-more-icon" sx={{ fontSize: 18, transition: 'transform 0.25s' }} />
          </Box>
        )}
      </CardContent>
    </>
  );

  const cardSx = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 3,
    overflow: 'hidden',
    border: `1px solid ${colors.border}`,
    bgcolor: colors.background,
    boxShadow: `0 8px 32px ${colors.shadow}`,
    transition: 'transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: `0 20px 56px ${colors.primary}44`,
      borderColor: colors.primary,
      '& img': { transform: 'scale(1.06)' },
      '& .read-more-icon': { transform: 'translateX(4px)' },
    },
  };

  if (href) {
    return (
      <Card
        component={Link}
        to={href}
        elevation={0}
        sx={{
          ...cardSx,
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        {body}
      </Card>
    );
  }

  return (
    <Card elevation={0} sx={cardSx}>
      {body}
    </Card>
  );
}
