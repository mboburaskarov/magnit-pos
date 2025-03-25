import useStyles from './useStyles'

export default function DashedRow({ rowData, main, discount, crossed, id, italic }) {
  const classes = useStyles()
  const result = discount ? (
    <div className={classes.dashedRow}>
      <p className={classes.discount}>
        {main ? (
          <b style={{ fontSize: 18 }} className={classes.bold}>
            {rowData.type}
          </b>
        ) : (
          <b style={{ fontSize: 18 }} className={classes.bold}>
            {rowData.type}
          </b>
        )}
      </p>
      <div />
      <p className={classes.discount}>{rowData?.value}</p>
    </div>
  ) : (
    <div className={classes.dashedRow}>
      <p>
        {main ? (
          <b style={{ fontSize: 18, fontWeight: 900 }} className={classes.bold}>
            {rowData.type}
          </b>
        ) : (
          <b style={{ fontSize: 16, fontWeight: 700 }}>{rowData.type}</b>
        )}
      </p>
      <div />
      <p id={id} className={`${crossed ? classes.crossed : ''}`}>
        <b style={main ? { fontSize: 18 } : { fontSize: 16, textAlign: 'end' }} className={italic ? classes.italic : classes.bold}>
          {rowData.value.split(',').map((e) => (
            <b style={main ? { fontSize: 18 } : { fontSize: 16, textAlign: 'end', display: 'block' }} className={italic ? classes.italic : classes.bold}>
              {e}
            </b>
          ))}
        </b>
      </p>
    </div>
  )
  return result
}
