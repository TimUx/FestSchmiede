import { Container, Link as MuiLink, Typography } from '@mui/material';
import { PlatformPublicLayout } from '@/components/PlatformPublicLayout';
import { BrandingHead } from '@/components/BrandingHead';
import { usePlatform } from '@/contexts/PlatformProvider';
import { DEFAULT_PLATFORM } from '@/types/tenant';

function repositoryDocsUrl(githubUrl?: string | null): string {
  const base = (githubUrl ?? DEFAULT_PLATFORM.githubUrl ?? 'https://github.com/TimUx/FestSchmiede').replace(/\/$/, '');
  return `${base}/tree/main/docs`;
}

export function PlatformDocsPage() {
  const { platform } = usePlatform();
  const docsUrl = repositoryDocsUrl(platform.githubUrl);

  return (
    <PlatformPublicLayout>
      <BrandingHead titleSuffix="Dokumentation" path="/dokumentation" description="Dokumentation und Guides für FestSchmiede – Installation, Betrieb und Nutzung der Open-Source-Veranstaltungsplattform." />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{
          fontWeight: 700
        }}>
          Dokumentation
        </Typography>
        <Typography component="p" sx={{ mb: 2 }}>
          Technische Dokumentation und Administratorhandbücher finden Sie im Projekt-Repository unter{' '}
          <MuiLink href={docsUrl} target="_blank" rel="noopener noreferrer">
            docs/
          </MuiLink>
          .
        </Typography>
        <Typography sx={{
          color: "text.secondary"
        }}>
          Für Mandantenadministratoren steht nach dem Login die integrierte Hilfe im Admin-Bereich zur Verfügung.
        </Typography>
      </Container>
    </PlatformPublicLayout>
  );
}
