import useStyles from './useStyles'

export default function DashedRow({ rowData, main, discount, crossed, id, italic }) {
  const classes = useStyles()
  const result = discount ? (
    <div key={id} className={classes.dashedRow}>
      <p className={classes.discount}>
        {main ? (
          <b style={{ fontSize: 20 }} className={classes.bold}>
            {rowData.type}
          </b>
        ) : (
          <b style={{ fontSize: 20 }} className={classes.bold}>
            {rowData.type}
          </b>
        )}
      </p>
      <div />
      <p className={classes.discount}>{rowData?.value}</p>
    </div>
  ) : (
    <div key={id} className={classes.dashedRow}>
      <p>
        {main ? (
          <b style={{ fontSize: 20, fontWeight: 900 }} className={classes.bold}>
            {rowData.type}
          </b>
        ) : (
          <b style={{ fontSize: 17, fontWeight: 700 }}>{rowData.type}</b>
        )}
      </p>
      <div />
      <p id={id} className={`${crossed ? classes.crossed : ''}`}>
        <b style={main ? { fontSize: 20 } : { fontSize: 17, textAlign: 'end' }} className={italic ? classes.italic : classes.bold}>
          {rowData.value.split(',').map((e) => (
            <b
              key={e}
              style={main ? { fontSize: 20 } : { fontSize: 17, textAlign: 'end', display: 'block' }}
              className={italic ? classes.italic : classes.bold}
            >
              {e}
            </b>
          ))}
        </b>
      </p>
    </div>
  )
  return result
}
