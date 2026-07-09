import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Link, useLocation } from 'react-router-dom';
import { useThemeMode } from '@/contexts/ThemeContext';
import { usePlatform } from '@/contexts/PlatformProvider';

const NAV_ITEMS = [
  { label: 'Start', path: '/' },
  { label: 'Funktionen', path: '/funktionen' },
  { label: 'Dokumentation', path: '/dokumentation' },
  { label: 'Download', path: '/download' },
  { label: 'Status', path: '/plattform-status' },
];

interface PlatformPublicLayoutProps {
  children: React.ReactNode;
}

export function PlatformPublicLayout({ children }: PlatformPublicLayoutProps) {
  const { mode, toggleMode } = useThemeMode();
  const { platform } = usePlatform();
  const location = useLocation();

  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="fixed" elevation={1} color="primary">
        <Toolbar>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 700 }}
          >
            {platform.name}
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, mr: 2 }}>
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                color="inherit"
                size="small"
                sx={{ fontWeight: location.pathname === item.path ? 700 : 400 }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
          <Button component={Link} to="/platform/login" color="inherit" size="small" sx={{ mr: 1 }}>
            Anmelden
          </Button>
          <IconButton onClick={toggleMode} color="inherit" aria-label="Design wechseln">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <Box component="footer" sx={{ py: 2, borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            <Typography component={Link} to="/impressum" variant="body2" color="text.secondary" sx={{ textDecoration: 'none' }}>
              Impressum
            </Typography>
            <Typography component={Link} to="/datenschutz" variant="body2" color="text.secondary" sx={{ textDecoration: 'none' }}>
              Datenschutz
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
