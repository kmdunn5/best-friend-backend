import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { ELEMENT_COLORS, ELEMENT_ICONS } from './types';

interface ElementChipsProps {
  elements: string;
  size?: 'small' | 'medium';
}

export default function ElementChips({ elements, size = 'small' }: ElementChipsProps) {
  if (!elements) return null;

  const els = elements.split(',').map(e => e.trim());

  return (
    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
      {els.map(el => (
        <Chip
          key={el}
          label={`${ELEMENT_ICONS[el] ?? ''} ${el.charAt(0) + el.slice(1).toLowerCase()}`}
          size={size}
          sx={{
            bgcolor: `${ELEMENT_COLORS[el] ?? '#666'}18`,
            color: ELEMENT_COLORS[el] ?? '#666',
            border: `1px solid ${ELEMENT_COLORS[el] ?? '#666'}40`,
            fontWeight: 600,
            fontSize: size === 'small' ? '0.7rem' : '0.8rem',
          }}
        />
      ))}
    </Box>
  );
}
