import useStyles from './useStyles'

export default function DashedRow({
  rowData,
  main,
  discount,
  crossed,
  id,
  italic,
}) {
  const classes = useStyles()
  const result = discount ? (
    <div className={classes.dashedRow}>
      <p className={classes.discount}>
        {main ? (
          <b style={{ fontSize: 16 }} className={classes.bold}>
            {rowData.type}
          </b>
        ) : (
          rowData.type
        )}
      </p>
      <div />
      <p className={classes.discount}>{rowData?.value}</p>
    </div>
  ) : (
    <div className={classes.dashedRow}>
      <p>
        {main ? (
          <b style={{ fontSize: 16 }} className={classes.bold}>
            {rowData.type}
          </b>
        ) : (
          <span className={italic ? classes.italic : classes.value}>
            {rowData.type}
          </span>
        )}
      </p>
      <div />
      <p id={id} className={`${crossed ? classes.crossed : ''}`}>
        <b
          style={main && { fontSize: 16 }}
          className={italic ? classes.italic : classes.bold}
        >
          {rowData.value}
        </b>
      </p>
    </div>
  )
  return result
}
