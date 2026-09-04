import { Container, Typography } from '@mui/material';
import { PlatformPublicLayout } from '@/components/PlatformPublicLayout';
import { BrandingHead } from '@/components/BrandingHead';
import { usePlatform } from '@/contexts/PlatformProvider';

export function PlatformDownloadPage() {
  const { platform } = usePlatform();

  return (
    <PlatformPublicLayout>
      <BrandingHead titleSuffix="Download" path="/download" description="FestSchmiede herunterladen und selbst hosten – Open-Source-Veranstaltungsplattform für Vereine." />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{
          fontWeight: 700
        }}>
          Download
        </Typography>
        <Typography component="p" sx={{ mb: 2 }}>
          {platform.name} wird als Docker-Image ausgeliefert. Kontaktieren Sie Ihren Plattformadministrator
          für Zugangsdaten und Deployment-Anleitungen.
        </Typography>
        <Typography sx={{
          color: "text.secondary"
        }}>
          Aktuelle Version: {platform.version}
        </Typography>
      </Container>
    </PlatformPublicLayout>
  );
}
