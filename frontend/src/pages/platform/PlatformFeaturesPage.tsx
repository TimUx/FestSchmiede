import { Container, List, ListItem, ListItemText, Typography } from '@mui/material';
import { PlatformPublicLayout } from '@/components/PlatformPublicLayout';
import { BrandingHead } from '@/components/BrandingHead';

const FEATURES = [
  'Online-Vorausbestellungen mit Küchen- und Abholmonitor',
  'Mandantenfähige Verwaltung mehrerer Veranstalter',
  'Optionale Module: Zahlung, Benachrichtigungen, Rechtliches, Druck',
  'Echtzeit-Updates per WebSocket mit Polling-Fallback',
  'Responsive Oberfläche für Desktop, Tablet und Smartphone',
];

export function PlatformFeaturesPage() {
  return (
    <PlatformPublicLayout>
      <BrandingHead titleSuffix="Funktionen" />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Funktionen
        </Typography>
        <List>
          {FEATURES.map((text) => (
            <ListItem key={text} disableGutters>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Container>
    </PlatformPublicLayout>
  );
}
