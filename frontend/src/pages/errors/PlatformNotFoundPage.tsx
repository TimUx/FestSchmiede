import { Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export function PlatformNotFoundPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom sx={{
        fontWeight: 700
      }}>
        Seite nicht gefunden
      </Typography>
      <Typography
        sx={{
          color: "text.secondary",
          mb: 3
        }}>
        Die angeforderte Plattformseite existiert nicht.
      </Typography>
      <Button component={Link} to="/" variant="contained">
        Zur Startseite
      </Button>
    </Container>
  );
}
