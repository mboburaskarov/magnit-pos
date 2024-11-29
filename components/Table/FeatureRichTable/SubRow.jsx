import { Box, CircularProgress, Typography } from '@mui/material'
import colors from 'theme/mui.config'
import useStyles from './useStyles'

export default function SubRow({
  row,
  rowProps,
  visibleColumns,
  data,
  loading,
  noDataText,
}) {
  const classes = useStyles()
  if (loading) {
    return (
      <tr>
        <td colSpan={visibleColumns.length - 1}>
          <Box px={2}>
            <CircularProgress size={20} />
          </Box>
        </td>
      </tr>
    )
  }

  return (
    <>
      {data?.length ? (
        data?.map((x, i) => (
          <tr
            {...rowProps}
            key={`${rowProps.key}-expanded-${i}`}
            className={classes.tr}
          >
            {row.cells.map((cell) => (
              <td
                {...cell.getCellProps()}
                style={{
                  ...(cell.column.borderRight && {
                    borderRight: `2px solid ${colors.gray[200]}`,
                  }),
                  ...(cell.column.borderLeft && {
                    borderLeft: `2px solid ${colors.gray[200]}`,
                  }),
                  ...(cell.getCellProps()?.style
                    ? cell.getCellProps()?.style
                    : {}),
                }}
                className={classes.td}
              >
                <Box>
                  {cell.render(cell.column.SubCell ? 'SubCell' : 'Cell', {
                    value: cell.column.accessor && cell.column.accessor(x, i),
                    row: { ...row, original: x },
                  })}
                </Box>
              </td>
            ))}
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={visibleColumns.length - 1}>
            <Typography style={{ color: colors.gray[400], padding: 16 }}>
              {noDataText}
            </Typography>
          </td>
        </tr>
      )}
    </>
  )
}
