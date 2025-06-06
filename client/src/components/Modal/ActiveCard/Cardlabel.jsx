import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function Cardlabel({ labels, getContrastTextColor }) {
  if (!Array.isArray(labels) || labels.length === 0) return null;
  return (
    <>
      <Typography sx={{ fontWeight: '600', color: 'primary.main', mt: 2, mb: 0.5 }}>Labels</Typography>
      <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {[...labels]
          .sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
          .map(label => (
            <span
              key={label.id}
              style={{
                background: label.color,
                color: getContrastTextColor(label.color),
                borderRadius: 6,
                padding: '6px 16px',
                fontWeight: 600,
                fontSize: 15,
                minWidth: 36,
                display: 'inline-block',
                textAlign: 'center',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              {label.name || ''}
            </span>
          ))}
      </Box>
    </>
  );
}

export default Cardlabel;
