import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { BrandingHead } from '@/components/BrandingHead';
import { PlatformPublicLayout } from '@/components/PlatformPublicLayout';
import { MarketingHero } from '@/components/marketing/MarketingLayout';
import { MarketingBreadcrumbs } from '@/components/marketing/MarketingBreadcrumbs';
import { listSeoPages } from '@/content/seo';
import type { SeoCluster } from '@/content/seo/types';

const CLUSTER_META: Record<SeoCluster, { title: string; description: string }> = {
  software: {
    title: 'Software',
    description: 'Vereinssoftware, Festsoftware und Veranstaltungssoftware im Überblick.',
  },
  organisation: {
    title: 'Organisation',
    description: 'Essensbestellung, Küchenmonitor, Abholnummern und Abläufe am Fest.',
  },
  veranstaltungen: {
    title: 'Veranstaltungen',
    description: 'Feuerwehrfest, Schützenfest, Dorffest, Straßenfest und Kirmes digital organisieren.',
  },
};

export function PlatformThemenPage() {
  const pages = listSeoPages();
  const clusters = (Object.keys(CLUSTER_META) as SeoCluster[]).map((cluster) => ({
    cluster,
    ...CLUSTER_META[cluster],
    items: pages.filter((p) => p.cluster === cluster),
  }));

  return (
    <PlatformPublicLayout>
      <BrandingHead
        titleSuffix="Themen & Ratgeber"
        description="Ratgeber und Themenübersichten zu Vereinssoftware, Festorganisation, Essensbestellung, Küchenmonitor und typischen Vereinsfesten – von FestSchmiede."
        path="/themen"
        breadcrumbs={[
          { name: 'Start', path: '/' },
          { name: 'Themen', path: '/themen' },
        ]}
        ogImagePath="/screenshots/06-dashboard.png"
      />
      <MarketingHero
        title="Themen & Ratgeber"
        subtitle="Fachliche Übersichten zu Vereinssoftware, Festorganisation und digitalen Abläufen – klar strukturiert für Suche und Praxis."
      >
        <MarketingBreadcrumbs items={[{ label: 'Start', to: '/' }, { label: 'Themen' }]} />
      </MarketingHero>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {clusters.map((group) => (
          <Box key={group.cluster} id={group.cluster} component="section" sx={{ mb: 6 }}>
            <Typography variant="h2" component="h2" fontWeight={800} sx={{ fontSize: '1.5rem', mb: 1 }}>
              {group.title}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2, maxWidth: 720 }}>
              {group.description}
            </Typography>
            <Grid container spacing={2}>
              {group.items.map((page) => (
                <Grid key={page.slug} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardActionArea component={Link} to={`/${page.slug}`} sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h3" component="h3" fontWeight={700} sx={{ fontSize: '1.05rem', mb: 1 }}>
                          {page.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {page.metaDescription}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Container>
    </PlatformPublicLayout>
  );
}
