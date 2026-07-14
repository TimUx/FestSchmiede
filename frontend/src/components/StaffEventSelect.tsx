import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import type { PublicEvent } from '@/types';
import { touchSelectSx } from '@/theme/touch';

type StaffEventSelectProps = {
  events: PublicEvent[];
  value: string;
  onChange: (eventId: string) => void;
  labelId: string;
  compact?: boolean;
  sx?: SxProps<Theme>;
};

export function StaffEventSelect({ events, value, onChange, labelId, compact = false, sx }: StaffEventSelectProps) {
  const formSx: SxProps<Theme> = [
    compact ? { minWidth: { xs: 140, sm: 220 }, maxWidth: 320 } : touchSelectSx,
    ...(sx === undefined ? [] : Array.isArray(sx) ? sx : [sx]),
  ];

  return (
    <FormControl fullWidth={!compact} size={compact ? 'small' : 'medium'} sx={formSx}>
      <InputLabel id={labelId} shrink>
        Veranstaltung
      </InputLabel>
      <Select
        labelId={labelId}
        label="Veranstaltung"
        value={value}
        onChange={(e) => onChange(String(e.target.value))}
        displayEmpty
        renderValue={(selected) => {
          if (!selected) {
            return (
              <Typography component="span" color="text.secondary" sx={{ fontSize: compact ? '0.875rem' : '1.15rem' }}>
                Veranstaltung wählen
              </Typography>
            );
          }
          const event = events.find((item) => item.id === selected);
          if (!event) return selected;
          return compact
            ? event.name
            : `${event.name} · ${event.eventDateLabel}`;
        }}
      >
        {events.map((event) => (
          <MenuItem key={event.id} value={event.id}>
            {event.name} · {event.eventDateLabel}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
