import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Link } from 'react-router-dom';
import type { HomeDefinition, HomeEventType, HomeProblemSection } from '@/content/homePageContent';

export function HeroBenefitList({
  items,
}: {
  items: readonly { label: string; href: string }[];
}) {
  return (
    <Box
      component="ul"
      sx={{
        listStyle: 'none',
        m: 0,
        mt: 3,
        p: 0,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' },
        gap: { xs: 1, md: 1.25 },
        maxWidth: 900,
      }}
    >
      {items.map((item) => (
        <Box
          key={item.label}
          component="li"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}
        >
          <CheckCircleOutlineIcon color="primary" fontSize="small" aria-hidden />
          <Typography
            component={Link}
            to={item.href}
            variant="body2"
            fontWeight={600}
            sx={{ color: 'text.primary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export function ProblemSolutionBlocks({ items }: { items: HomeProblemSection[] }) {
  return (
    <Stack spacing={4}>
      {items.map((item) => (
        <Box key={item.id} id={item.id} component="article" sx={{ scrollMarginTop: 96 }}>
          <Typography variant="h3" component="h3" fontWeight={800} sx={{ fontSize: { xs: '1.2rem', md: '1.35rem' }, mb: 1.5 }}>
            {item.title}
          </Typography>
          <Typography paragraph sx={{ lineHeight: 1.75, maxWidth: 820 }}>
            {item.problem}
          </Typography>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.75 }}>
            Typische Ursachen
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            {item.causes.map((cause) => (
              <Typography key={cause} component="li" color="text.secondary" sx={{ mb: 0.5, lineHeight: 1.6 }}>
                {cause}
              </Typography>
            ))}
          </Box>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.75 }}>
            Digitale Alternative
          </Typography>
          <Typography paragraph sx={{ lineHeight: 1.75, maxWidth: 820 }}>
            {item.solution}
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 1.5 }}>
            {item.bullets.map((bullet) => (
              <Typography key={bullet} component="li" sx={{ mb: 0.5, lineHeight: 1.6 }}>
                {bullet}
              </Typography>
            ))}
          </Box>
          <Button component={Link} to={item.link.to} size="small">
            {item.link.label}
          </Button>
        </Box>
      ))}
    </Stack>
  );
}

export function DefinitionGrid({ items }: { items: HomeDefinition[] }) {
  return (
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid key={item.term} size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardActionArea component={Link} to={item.to} sx={{ height: '100%', alignItems: 'stretch' }}>
              <CardContent>
                <Typography variant="h3" component="h3" fontWeight={700} sx={{ fontSize: '1.05rem', mb: 1 }}>
                  {item.term}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {item.body}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export function EventTypeGrid({ items }: { items: HomeEventType[] }) {
  return (
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid key={item.title} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardActionArea component={Link} to={item.to} sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h3" component="h3" fontWeight={700} sx={{ fontSize: '1.05rem', mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                  {item.challenge}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export function ComparisonTable({
  headers,
  rows,
  caption,
}: {
  headers: string[];
  rows: string[][];
  caption: string;
}) {
  return (
    <Box sx={{ overflowX: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
      <Table size="small" aria-label={caption}>
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header} sx={{ fontWeight: 700 }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row[0]}>
              {row.map((cell, index) => (
                <TableCell key={`${row[0]}-${index}`} sx={{ fontWeight: index === 0 ? 600 : 400 }}>
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
