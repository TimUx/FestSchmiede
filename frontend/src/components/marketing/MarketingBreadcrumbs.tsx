import { Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export interface MarketingBreadcrumbItem {
  label: string;
  to?: string;
}

interface MarketingBreadcrumbsProps {
  items: MarketingBreadcrumbItem[];
}

/** Sichtbare Breadcrumbs für Marketing-/SEO-Seiten (www). */
export function MarketingBreadcrumbs({ items }: MarketingBreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <Breadcrumbs
      aria-label="Brotkrumen-Navigation"
      sx={{ mb: 2, '& a': { color: 'text.secondary' } }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        if (isLast || !item.to) {
          return (
            <Typography key={`${item.label}-${index}`} color="text.primary" variant="body2">
              {item.label}
            </Typography>
          );
        }
        return (
          <MuiLink
            key={item.to}
            component={Link}
            to={item.to}
            underline="hover"
            variant="body2"
          >
            {item.label}
          </MuiLink>
        );
      })}
    </Breadcrumbs>
  );
}
