import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DishQuantityOverview } from './DishQuantityOverview';

describe('DishQuantityOverview', () => {
  it('renders article quantities including zero values', () => {
    const html = renderToStaticMarkup(<DishQuantityOverview dishes={[
      { foodItemId: 'food', name: 'Bratwurst', totalQuantity: 1234, outstandingQuantity: 17 },
      { foodItemId: 'drink', name: 'Wasser', totalQuantity: 0, outstandingQuantity: 0 },
    ]} />);
    expect(html).toContain('Bratwurst');
    expect(html).toContain('Wasser');
    expect(html).toContain('1.234');
    expect(html).toContain('>17<');
    expect(html).toContain('>0<');
    expect(html).toContain('Gesamt bestellt');
    expect(html).toContain('Noch auszugeben');
    expect(html).toContain('aria-label="Hinweis zu den Artikelmengen"');
    expect(html).not.toContain('suchen');
  });

  it('shows all twenty articles and a search field in an expanded, collapsible section', () => {
    const html = renderToStaticMarkup(<DishQuantityOverview dishes={
      Array.from({ length: 20 }, (_, i) => ({
        foodItemId: `food-${i}`, name: `Artikel ${i}`, totalQuantity: i, outstandingQuantity: i,
      }))
    } />);
    expect(html.match(/<article /g)).toHaveLength(20);
    expect(html).toContain('Artikel 19');
    expect(html).toContain('suchen');
    expect(html).toContain('aria-expanded="true"');
  });

  it('explains an empty event menu', () => {
    const html = renderToStaticMarkup(<DishQuantityOverview dishes={[]} />);
    expect(html).toContain('noch keine Speisen oder Getränke vorhanden');
    expect(html).not.toContain('<article ');
  });
});
