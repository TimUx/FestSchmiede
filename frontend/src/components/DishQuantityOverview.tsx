import { useState } from 'react';
import {
  Accordion, AccordionSummary, AccordionDetails, Box, Card, CardContent, TextField, Tooltip, Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { DashboardStats } from '@/types';

const quantityHint = 'Mengen aus allen Bestellungen dieser Veranstaltung.\n\nNoch auszugeben umfasst auch fertige, noch nicht abgeholte Bestellungen. Stornierte Bestellungen werden nicht mitgezählt.';

export function DishQuantityOverview({ dishes }: { dishes: DashboardStats['dishQuantities'] }) {
  const [search, setSearch] = useState('');
  const filteredDishes = dishes.filter((dish) =>
    dish.name.toLocaleLowerCase('de-DE').includes(search.trim().toLocaleLowerCase('de-DE'))
  );

  return (
    <Accordion defaultExpanded disableGutters slotProps={{ heading: { component: 'h2' } }} sx={{ mb: 4 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="dish-quantities-content" id="dish-quantities-heading">
        <Typography variant="h6" component="span" sx={{ fontWeight: 800 }}>
          Speisen &amp; Getränke ({dishes.length})
        </Typography>
        <Tooltip
          title={<Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{quantityHint}</Typography>}
          arrow
          placement="top"
          describeChild
        >
          <Box
            component="span"
            role="img"
            aria-label="Hinweis zu den Artikelmengen"
            tabIndex={0}
            onClick={(event) => event.stopPropagation()}
            sx={{ display: 'inline-flex', color: 'text.secondary', ml: 1 }}
          >
            <InfoOutlinedIcon fontSize="small" />
          </Box>
        </Tooltip>
      </AccordionSummary>
      <AccordionDetails id="dish-quantities-content">
        {(dishes.length > 10 || search !== '') && (
          <TextField
            label="Speisen & Getränke suchen"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            size="small"
            fullWidth
            sx={{ mb: 2 }}
          />
        )}
        {dishes.length === 0 ? (
          <Typography color="text.secondary">Für diese Veranstaltung sind noch keine Speisen oder Getränke vorhanden.</Typography>
        ) : filteredDishes.length === 0 ? (
          <Typography color="text.secondary">Keine passenden Speisen oder Getränke gefunden.</Typography>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' }, gap: 2 }}>
            {filteredDishes.map((dish) => (
              <Card key={dish.foodItemId} variant="outlined" component="article" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 700, mb: 2, overflowWrap: 'anywhere' }}>
                    {dish.name}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Gesamt bestellt</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800 }}>{dish.totalQuantity.toLocaleString('de-DE')}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Noch auszugeben</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800 }} color={dish.outstandingQuantity > 0 ? 'warning.main' : 'text.secondary'}>
                        {dish.outstandingQuantity.toLocaleString('de-DE')}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
