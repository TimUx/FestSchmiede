import { Accordion, AccordionDetails, AccordionSummary, Button, Stack, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
import { PlatformPublicLayout } from '@/components/PlatformPublicLayout';
import { BrandingHead } from '@/components/BrandingHead';
import { MarketingSection } from '@/components/marketing/MarketingLayout';
import { FAQ_ITEMS } from '@/content/platformMarketing';
import { SEO_GLOBAL_FAQS } from '@/content/seo';

function mergeFaqs() {
  const seen = new Set<string>();
  return [...FAQ_ITEMS, ...SEO_GLOBAL_FAQS].filter((item) => {
    if (seen.has(item.q)) return false;
    seen.add(item.q);
    return true;
  });
}

export function PlatformFaqPage() {
  const faqs = mergeFaqs();

  return (
    <PlatformPublicLayout>
      <BrandingHead
        titleSuffix="FAQ – Häufige Fragen zu FestSchmiede"
        description="Antworten zu Kosten, Open Source, Mandanten, Hosting, Essensbestellung, Küchenmonitor und Abholung bei FestSchmiede."
        path="/faq"
        faqs={faqs}
        breadcrumbs={[
          { name: 'Start', path: '/' },
          { name: 'FAQ', path: '/faq' },
        ]}
      />
      <MarketingSection
        title="Häufige Fragen"
        subtitle="Antworten zu Kosten, Open Source, Mandanten, Hosting und Abläufen am Vereinsfest."
      >
        {faqs.map((item) => (
          <Accordion key={item.q} disableGutters elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={600}>{item.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary" lineHeight={1.7}>{item.a}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
          <Button component={Link} to="/themen" variant="outlined">
            Themen & Ratgeber
          </Button>
          <Button component={Link} to="/kontakt" variant="contained">
            Kontakt
          </Button>
        </Stack>
      </MarketingSection>
    </PlatformPublicLayout>
  );
}
