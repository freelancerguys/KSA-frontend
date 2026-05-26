import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Container,
  useScrollTrigger,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { motion } from 'framer-motion';
import { colors } from '../theme/theme';
import Logo from './Logo';

const links = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Blogs', href: '#blogs' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 50 });

  const scrollTo = (href) => {
    setOpen(false);
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          left: 0,
          right: 0,
          width: '100%',
          backgroundColor: trigger ? 'rgba(17,17,17,0.95)' : 'transparent',
          backgroundImage: 'none',
          backdropFilter: trigger ? 'blur(10px)' : 'none',
          boxShadow: trigger ? 4 : 'none',
          transition: 'all 0.3s',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: { xs: 0.75, md: 1 },
              minHeight: { xs: 56, md: 64 },
            }}
          >
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Logo to="/" height={trigger ? 44 : 52} />
            </motion.div>

            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 0.5,
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              {links.map((l) => (
                <Button
                  key={l.href}
                  onClick={() => scrollTo(l.href)}
                  sx={{ color: colors.textOnDark, fontWeight: 500, px: 1.25 }}
                >
                  {l.label}
                </Button>
              ))}
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/login')}
                sx={{ ml: 1, fontWeight: 700, borderRadius: 2 }}
              >
                Student Login
              </Button>
            </Box>

            <IconButton
              sx={{ display: { md: 'none' }, color: colors.textOnDark }}
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ p: 2, bgcolor: colors.secondary, display: 'flex', justifyContent: 'center' }} onClick={() => setOpen(false)}>
          <Logo to="/" height={56} />
        </Box>
        <List sx={{ width: 260, pt: 1 }}>
          {links.map((l) => (
            <ListItemButton key={l.href} onClick={() => scrollTo(l.href)}>
              <ListItemText primary={l.label} />
            </ListItemButton>
          ))}
          <ListItemButton onClick={() => { setOpen(false); navigate('/login'); }}>
            <ListItemText primary="Student Login" />
          </ListItemButton>
        </List>
      </Drawer>
    </>
  );
}
