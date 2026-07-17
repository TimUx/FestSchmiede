import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { PlatformPublicLayout } from '@/components/PlatformPublicLayout';
import { BrandingHead } from '@/components/BrandingHead';
import { MarketingHero, MarketingSection, CtaBand } from '@/components/marketing/MarketingLayout';
import { OrderProcessFlow } from '@/components/marketing/OrderProcessFlow';
import {
  ComparisonTable,
  DefinitionGrid,
  EventTypeGrid,
  HeroBenefitList,
  ProblemSolutionBlocks,
} from '@/components/marketing/HomeKnowledgeBlocks';
import { usePlatform } from '@/contexts/PlatformProvider';
import { SCREENSHOTS } from '@/content/platformMarketing';
import {
  HOME_COMPARISON,
  HOME_DEFINITIONS,
  HOME_EEAT,
  HOME_EVENT_TYPES,
  HOME_HERO,
  HOME_PROBLEMS,
  HOME_QUICK_BENEFITS,
  HOME_SUMMARY,
  HOME_TOPIC_LINKS,
} from '@/content/homePageContent';
import { SponsorLinks } from '@/components/SponsorLinks';

export function PlatformHomePage() {
  const { platform } = usePlatform();

  return (
    <PlatformPublicLayout>
      <BrandingHead
        titleSuffix="Digitale Organisation für Vereinsfeste"
        description="FestSchmiede digitalisiert Bestellung, Küche und Abholung am Vereinsfest – Open Source für Feuerwehrfeste, Schützenfeste, Dorffeste und ähnliche Veranstaltungen."
        path="/"
        breadcrumbs={[{ name: 'Start', path: '/' }]}
        ogImagePath="/screenshots/01-bestellseite-monitor.png"
      />

      <MarketingHero showLogo title={HOME_HERO.title} subtitle={HOME_HERO.subtitle}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button component={Link} to={HOME_HERO.primaryCta.to} variant="contained" size="large">
            {HOME_HERO.primaryCta.label}
          </Button>
          {platform.registrationEnabled ? (
            <Button component={Link} to={HOME_HERO.secondaryCtaApply.to} variant="outlined" size="large">
              {HOME_HERO.secondaryCtaApply.label}
            </Button>
          ) : (
            <Button component={Link} to={HOME_HERO.secondaryCtaContact.to} variant="outlined" size="large">
              {HOME_HERO.secondaryCtaContact.label}
            </Button>
          )}
          <Button
            component="a"
            href={platform.githubUrl ?? 'https://github.com/TimUx/FestSchmiede'}
            target="_blank"
            rel="noopener noreferrer"
            variant="text"
            size="large"
          >
            GitHub
          </Button>
        </Stack>
        <HeroBenefitList items={HOME_QUICK_BENEFITS} />
      </MarketingHero>

      <MarketingSection
        title="Probleme am Vereinsfest – und digitale Antworten"
        subtitle="Nicht Feature-Listen entscheiden, sondern konkrete Engpässe: Zettel, Schlangen, Küchenchaos und unklare Übergaben."
      >
        <ProblemSolutionBlocks items={HOME_PROBLEMS} />
      </MarketingSection>

      <MarketingSection
        id="bestellprozess"
        title="So läuft der Ablauf"
        subtitle="Gast bestellt → Küche erhält die Bestellung → Küche meldet fertig → Abholnummer erscheint → Gast holt ab."
        sx={{ bgcolor: 'background.paper' }}
      >
        <OrderProcessFlow />
      </MarketingSection>

      <MarketingSection
        title={HOME_COMPARISON.title}
        subtitle="Ein Überblick für Vorstände und Festleitungen, die den Unterschied greifbar machen wollen."
      >
        <ComparisonTable
          caption={HOME_COMPARISON.title}
          headers={HOME_COMPARISON.headers}
          rows={HOME_COMPARISON.rows}
        />
      </MarketingSection>

      <MarketingSection
        title="Begriffe kurz erklärt"
        subtitle="Definitionen für Suche und Praxis – jeweils mit weiterführendem Ratgeber."
        sx={{ bgcolor: 'background.paper' }}
      >
        <DefinitionGrid items={HOME_DEFINITIONS} />
      </MarketingSection>

      <MarketingSection
        title="Veranstaltungsarten"
        subtitle="Jede Festform hat eigene Engpässe. Hier die typischen Herausforderungen – ohne Copy-Paste."
      >
        <EventTypeGrid items={HOME_EVENT_TYPES} />
      </MarketingSection>

      <MarketingSection
        title="Einblicke in die Praxis"
        subtitle="Screenshots aus Bestellung, Küche und Organisation."
        sx={{ bgcolor: 'background.paper' }}
      >
        <Grid container spacing={2}>
          {SCREENSHOTS.slice(0, 3).map((s) => (
            <Grid key={s.src} size={{ xs: 12, md: 4 }}>
              <Card>
                <Box
                  component="img"
                  src={s.src}
                  alt={s.alt}
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={600}
                  sx={{ width: '100%', height: 'auto', display: 'block', borderBottom: 1, borderColor: 'divider' }}
                />
                <CardContent>
                  <Typography fontWeight={600}>{s.title}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Button component={Link} to="/screenshots" sx={{ mt: 3 }}>
          Alle Screenshots ansehen
        </Button>
      </MarketingSection>

      <MarketingSection title={HOME_EEAT.whyTitle} subtitle="Herkunft, Zielgruppe und Abgrenzung – sachlich."
      >
        <Stack spacing={3} sx={{ maxWidth: 820 }}>
          <Box>
            <Typography paragraph sx={{ lineHeight: 1.75 }}>{HOME_EEAT.whyBody}</Typography>
          </Box>
          <Box>
            <Typography variant="h3" component="h3" fontWeight={700} sx={{ fontSize: '1.15rem', mb: 1 }}>
              {HOME_EEAT.whoTitle}
            </Typography>
            <Typography paragraph sx={{ lineHeight: 1.75 }}>{HOME_EEAT.whoBody}</Typography>
          </Box>
          <Box>
            <Typography variant="h3" component="h3" fontWeight={700} sx={{ fontSize: '1.15rem', mb: 1 }}>
              {HOME_EEAT.whenTitle}
            </Typography>
            <Typography paragraph sx={{ lineHeight: 1.75 }}>{HOME_EEAT.whenBody}</Typography>
          </Box>
          <Box>
            <Typography variant="h3" component="h3" fontWeight={700} sx={{ fontSize: '1.15rem', mb: 1 }}>
              {HOME_EEAT.diffTitle}
            </Typography>
            <Typography paragraph sx={{ lineHeight: 1.75 }}>{HOME_EEAT.diffBody}</Typography>
          </Box>
        </Stack>
        <Button component={Link} to="/ueber-das-projekt" sx={{ mt: 1 }}>
          Mehr über das Projekt
        </Button>
      </MarketingSection>

      <MarketingSection
        title="Themencluster"
        subtitle="Weiterlesen nach Suchintention – Software, Organisation und Veranstaltungen."
        sx={{ bgcolor: 'background.paper' }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          {HOME_TOPIC_LINKS.map((item) => (
            <Button key={item.to} component={Link} to={item.to} variant="outlined" size="small">
              {item.label}
            </Button>
          ))}
        </Box>
      </MarketingSection>

      <MarketingSection title={HOME_SUMMARY.title}>
        <Box component="ul" sx={{ pl: 3, maxWidth: 820 }}>
          {HOME_SUMMARY.points.map((point) => (
            <Typography key={point} component="li" sx={{ mb: 1, lineHeight: 1.7 }}>
              {point}
            </Typography>
          ))}
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
          <Button component={Link} to="/faq" variant="outlined">
            FAQ öffnen
          </Button>
          <Button component={Link} to="/funktionen" variant="text">
            Funktionen im Überblick
          </Button>
        </Stack>
      </MarketingSection>

      <MarketingSection
        title="Open Source"
        subtitle="Transparent, erweiterbar und unabhängig von einem geschlossenen Anbieter."
      >
        <Typography sx={{ maxWidth: 760, mb: 2, lineHeight: 1.7 }}>
          FestSchmiede ist Open Source. Der Quellcode ist einsehbar, Mitarbeit ist willkommen und Organisationen
          bleiben unabhängig. Das ist Vertrauensbasis – kein Marketingversprechen.
        </Typography>
        <Button
          component="a"
          href={platform.githubUrl ?? 'https://github.com/TimUx/FestSchmiede'}
          target="_blank"
          rel="noopener noreferrer"
          variant="outlined"
        >
          GitHub Repository
        </Button>
      </MarketingSection>

      <MarketingSection
        title="Projekt unterstützen"
        subtitle="Freiwillige Unterstützung hilft bei Weiterentwicklung und Betrieb."
        sx={{ bgcolor: 'background.default' }}
      >
        <Box sx={{ maxWidth: 720 }}>
          <SponsorLinks variant="prominent" />
        </Box>
      </MarketingSection>

      <CtaBand
        title="Nächstes Fest ruhiger organisieren?"
        subtitle="Mandant beantragen, Themen nachlesen oder den Ablauf mit dem Team durchspielen – ohne Feature-Theater."
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          {platform.registrationEnabled && (
            <Button component={Link} to="/mandant-beantragen" variant="contained" size="large">
              Mandant beantragen
            </Button>
          )}
          <Button component={Link} to="/fuer-vereine" variant="outlined" size="large">
            Für Vereine
          </Button>
          <Button component={Link} to="/kontakt" variant="text" size="large">
            Kontakt
          </Button>
        </Stack>
      </CtaBand>
    </PlatformPublicLayout>
  );
}
