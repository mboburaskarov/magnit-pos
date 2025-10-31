import thousandDivider from '@utils/thousandDivider'
import Tab from './Tab'
import { Fragment } from 'react'
import { Box } from '@mui/material'
import StyledTooltip from '../StyledTooltip'

const TabContainer = ({ countOnTop, tabs = [], setSelected, selected, counts, thousandDividable = true, countFormatter, primary, countsCompare = false }) => {
  return (
    <Box sx={{ display: 'flex', rowGap: 3, flexWrap: 'wrap' }}>
      {tabs.map((tab, index) => {
        return (
          <Box display='inline-flex' key={index}>
            {tab ? (
              <Fragment>
                {tab.tooltip ? (
                  <StyledTooltip title={tab?.tooltip} placement={`${tab?.placement || 'bottom'}`}>
                    <Tab
                      countOnTop={countOnTop}
                      primary={primary}
                      id={tab?.id}
                      key={tab?.id}
                      tabIndex={index}
                      name={`${tab?.label || ''} ${
                        counts && !tab?.noCount && !countOnTop ? `(${thousandDividable ? thousandDivider(counts?.[index] || 0) : counts?.[index] || 0})` : ''
                      }`}
                      selected={selected === tab?.id}
                      setTab={setSelected}
                      icon={tab?.icon}
                      checkSlug={tab?.checkSlug}
                      count={thousandDivider(counts?.[index] || 0)}
                    />
                  </StyledTooltip>
                ) : (
                  <Tab
                    countOnTop={countOnTop}
                    primary={primary}
                    id={tab?.id}
                    key={tab?.id}
                    tabIndex={index}
                    name={`${tab?.label || ''} ${
                      !countOnTop && counts && !tab?.noCount
                        ? `(${countsCompare ? countsCompare?.[index] || 0 + '/' : ''}${
                            countFormatter
                              ? countFormatter(counts?.[index] || 0)
                              : thousandDividable
                              ? thousandDivider(counts?.[index] || 0)
                              : counts?.[index] || 0
                          })`
                        : ''
                    }`}
                    count={thousandDivider(counts?.[index] || 0)}
                    selected={selected === tab?.id}
                    setTab={setSelected}
                    checkSlug={tab?.checkSlug}
                  />
                )}
              </Fragment>
            ) : null}
          </Box>
        )
      })}
    </Box>
  )
}

export default TabContainer
