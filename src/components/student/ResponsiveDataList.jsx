import { Box, Card, CardContent, Typography, Chip, useMediaQuery, useTheme } from '@mui/material';
import { colors } from '../../theme/theme';

export default function ResponsiveDataList({ columns, rows, renderMobileCard }) {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!rows?.length) {
    return (
      <Typography color="text.secondary" textAlign="center" py={3}>
        No records found
      </Typography>
    );
  }

  if (mobile) {
    return (
      <Box display="flex" flexDirection="column" gap={1.5}>
        {rows.map((row) => (
          <Card key={row.id || row._id} variant="outlined" sx={{ borderRadius: 2, borderColor: colors.border, bgcolor: colors.background }}>
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              {renderMobileCard ? renderMobileCard(row) : (
                columns.map((col) => (
                  <Box key={col.field} display="flex" justifyContent="space-between" py={0.5}>
                    <Typography variant="caption" color="text.secondary">{col.label}</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {col.render ? col.render(row) : row[col.field]}
                    </Typography>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
        <Box component="thead">
          <Box component="tr" sx={{ bgcolor: colors.surfaceAlt }}>
            {columns.map((col) => (
              <Box component="th" key={col.field} sx={{ textAlign: 'left', p: 1.5, fontSize: '0.8rem', fontWeight: 700 }}>
                {col.label}
              </Box>
            ))}
          </Box>
        </Box>
        <Box component="tbody">
          {rows.map((row) => (
            <Box component="tr" key={row.id || row._id} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
              {columns.map((col) => (
                <Box component="td" key={col.field} sx={{ p: 1.5, fontSize: '0.875rem' }}>
                  {col.render ? col.render(row) : row[col.field]}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export function StatusChip({ status }) {
  const color = { pending: 'warning', approved: 'success', rejected: 'error' }[status] || 'default';
  return <Chip size="small" label={status} color={color} sx={{ textTransform: 'capitalize' }} />;
}
