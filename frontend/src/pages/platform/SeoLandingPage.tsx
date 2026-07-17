import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
import { BrandingHead } from '@/components/BrandingHead';
import { PlatformPublicLayout } from '@/components/PlatformPublicLayout';
import { CtaBand, MarketingHero } from '@/components/marketing/MarketingLayout';
import { MarketingBreadcrumbs } from '@/components/marketing/MarketingBreadcrumbs';
import type { SeoLandingPage } from '@/content/seo/types';
import { getSeoPageBySlug, listSeoPages } from '@/content/seo';

const CLUSTER_LABEL: Record<SeoLandingPage['cluster'], string> = {
  software: 'Software',
  organisation: 'Organisation',
  veranstaltungen: 'Veranstaltungen',
};

function paragraphs(text: string) {
  return text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
}

interface SeoLandingPageViewProps {
  page: SeoLandingPage;
}

export function SeoLandingPageView({ page }: SeoLandingPageViewProps) {
  const related = page.relatedSlugs
    .map((slug) => getSeoPageBySlug(slug))
    .filter((p): p is SeoLandingPage => Boolean(p));

  const clusterPages = listSeoPages()
    .filter((p) => p.cluster === page.cluster && p.slug !== page.slug)
    .slice(0, 6);

  const path = `/${page.slug}`;
  const breadcrumbs = [
    { name: 'Start', path: '/' },
    { name: CLUSTER_LABEL[page.cluster], path: `/themen#${page.cluster}` },
    { name: page.title, path },
  ];

  return (
    <PlatformPublicLayout>
      <BrandingHead
        titleSuffix={page.metaTitle}
        description={page.metaDescription}
        path={path}
        breadcrumbs={breadcrumbs}
        faqs={page.faqs}
        ogImagePath="/screenshots/01-bestellseite-monitor.png"
      />

      <MarketingHero title={page.title} subtitle={paragraphs(page.intro)[0] ?? page.metaDescription}>
        <MarketingBreadcrumbs
          items={[
            { label: 'Start', to: '/' },
            { label: CLUSTER_LABEL[page.cluster], to: `/themen#${page.cluster}` },
            { label: page.title },
          ]}
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1 }}>
          <Button component={Link} to="/mandant-beantragen" variant="contained" size="large">
            Mandant beantragen
          </Button>
          <Button component={Link} to="/funktionen" variant="outlined" size="large">
            Funktionen ansehen
          </Button>
        </Stack>
      </MarketingHero>

      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Box component="article">
          {paragraphs(page.intro).slice(1).map((p) => (
            <Typography key={p.slice(0, 40)} paragraph sx={{ lineHeight: 1.75 }}>
              {p}
            </Typography>
          ))}

          {page.sections.map((section) => (
            <Box key={section.heading} component="section" sx={{ mt: 5 }}>
              <Typography variant="h2" component="h2" fontWeight={800} sx={{ fontSize: { xs: '1.35rem', md: '1.6rem' }, mb: 2 }}>
                {section.heading}
              </Typography>
              {paragraphs(section.body).map((p) => (
                <Typography key={p.slice(0, 40)} paragraph sx={{ lineHeight: 1.75 }}>
                  {p}
                </Typography>
              ))}
              {section.bullets && section.bullets.length > 0 && (
                <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                  {section.bullets.map((item) => (
                    <Typography key={item} component="li" sx={{ mb: 0.75, lineHeight: 1.6 }}>
                      {item}
                    </Typography>
                  ))}
                </Box>
              )}
              {section.table && (
                <Box sx={{ overflowX: 'auto', mb: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Table size="small" aria-label={section.heading}>
                    <TableHead>
                      <TableRow>
                        {section.table.headers.map((h) => (
                          <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {section.table.rows.map((row) => (
                        <TableRow key={row.join('|')}>
                          {row.map((cell, i) => (
                            <TableCell key={`${row[0]}-${i}`}>{cell}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}
            </Box>
          ))}

          <Box component="section" sx={{ mt: 6 }}>
            <Typography variant="h2" component="h2" fontWeight={800} sx={{ fontSize: { xs: '1.35rem', md: '1.6rem' }, mb: 2 }}>
              Häufige Fragen
            </Typography>
            {page.faqs.map((faq) => (
              <Accordion key={faq.q} disableGutters elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`${faq.q}-content`} id={`${faq.q}-header`}>
                  <Typography fontWeight={600}>{faq.q}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>{faq.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>

          {(related.length > 0 || clusterPages.length > 0) && (
            <Box component="nav" aria-label="Verwandte Themen" sx={{ mt: 6 }}>
              <Typography variant="h2" component="h2" fontWeight={800} sx={{ fontSize: { xs: '1.35rem', md: '1.6rem' }, mb: 2 }}>
                Weiterlesen
              </Typography>
              <Stack spacing={1}>
                {(related.length > 0 ? related : clusterPages).map((item) => (
                  <Typography
                    key={item.slug}
                    component={Link}
                    to={`/${item.slug}`}
                    sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                  >
                    {item.title}
                  </Typography>
                ))}
                <Typography
                  component={Link}
                  to="/themen"
                  sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' }, pt: 1 }}
                >
                  Alle Themenübersichten
                </Typography>
              </Stack>
            </Box>
          )}
        </Box>
      </Container>

      <CtaBand title={page.cta.title} subtitle={page.cta.subtitle}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button component={Link} to="/mandant-beantragen" variant="contained" size="large">
            Jetzt Mandant beantragen
          </Button>
          <Button component={Link} to="/kontakt" variant="outlined" size="large">
            Kontakt
          </Button>
        </Stack>
      </CtaBand>
    </PlatformPublicLayout>
  );
}

export function SeoLandingPageRoute({ slug }: { slug: string }) {
  const page = getSeoPageBySlug(slug);
  if (!page) {
    return null;
  }
  return <SeoLandingPageView page={page} />;
}
