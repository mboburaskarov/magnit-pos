/* eslint-disable react-refresh/only-export-components */
import { Box, Button, keyframes, Typography } from '@mui/material'
import { memo } from 'react'
import RowFilterButton from './RowFilterButton'
import DownloadButton from './DownloadButton'
import Pagination from './Pagination'
import { useTranslation } from 'react-i18next'
import ButtonWithPopup from '../Buttons/ButtonWithPopup'
import FinanceAndPaymentIcon from '../../src/assets/icons/FinanceAndPaymentIcon'
import UnlockIcon from '../../src/assets/icons/UnlockIcon'
import DownloadIcon from '../../src/assets/icons/DownloadIcon'
import { borderColor, fontSize, fontWeight, minWidth } from '@mui/system'

const rotateAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const RefreshButton = ({ loading, onClick }) => {
  return (
    <Box minWidth={48} mr={2} position='relative'>
      <Button
        sx={(theme) => ({
          background: theme.palette.background.default,
          minWidth: '48px',
          height: '48px',
          padding: 0,
          borderRadius: '50%',
          position: 'relative',
          '& svg': {
            animation: loading ? `${rotateAnimation} 1s linear infinite` : 'none',
          },
        })}
        variant='outlined'
        size='small'
        onClick={onClick}
        disabled={loading}
      >
        <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM6.6 11.23C6.77 10.04 7.3 8.97 8.13 8.13C10.13 6.14 13.28 6.03 15.42 7.77V6.82C15.42 6.41 15.76 6.07 16.17 6.07C16.58 6.07 16.92 6.41 16.92 6.82V9.49C16.92 9.9 16.58 10.24 16.17 10.24H13.5C13.09 10.24 12.75 9.9 12.75 9.49C12.75 9.08 13.09 8.74 13.5 8.74H14.25C12.7 7.66 10.56 7.81 9.18 9.19C8.58 9.79 8.2 10.57 8.07 11.44C8.02 11.81 7.7 12.08 7.33 12.08C7.29 12.08 7.26 12.08 7.22 12.07C6.83 12.02 6.54 11.64 6.6 11.23ZM15.87 15.87C14.8 16.94 13.4 17.47 12 17.47C10.78 17.47 9.57 17.04 8.57 16.23V17.17C8.57 17.58 8.23 17.92 7.82 17.92C7.41 17.92 7.07 17.58 7.07 17.17V14.5C7.07 14.09 7.41 13.75 7.82 13.75H10.49C10.9 13.75 11.24 14.09 11.24 14.5C11.24 14.91 10.9 15.25 10.49 15.25H9.74C11.29 16.33 13.43 16.18 14.81 14.8C15.41 14.2 15.79 13.42 15.92 12.55C15.98 12.14 16.35 11.85 16.77 11.91C17.18 11.97 17.46 12.35 17.41 12.76C17.23 13.97 16.7 15.04 15.87 15.87Z'
            fill='#119676'
          />
        </svg>
      </Button>
    </Box>
  )
}

function AgGridBottom({
  controlledOffsetCount,
  changeOffset,
  offsetIndex,
  offsetQuery,
  isDownloading,
  fullDownload,
  downloadByFilter,
  offsetSize,
  totalCount,
  setOffsetSize,
  eventMessages,
  fullInfoAboutCurrentPage,
  resetTable,
  isRefreshing,
}) {
  const { t } = useTranslation()

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        // justifyContent: 'space-between',
        // alignItems: 'center',
        width: '100%',
        paddingTop: 2,
      })}
    >
      <Box width={'100%'} display='flex' justifyContent={'space-between'} alignItems='center'>
        <Box display={'flex'}>
          <RowFilterButton
            totalCount={totalCount}
            offsetIndex={offsetIndex}
            offsetQuery={offsetQuery}
            eventMessage={eventMessages?.[1]}
            offsetSize={offsetSize}
            setOffsetSize={setOffsetSize}
          />
          {fullDownload && downloadByFilter && (
            <ButtonWithPopup
              id={'ff'}
              noArrow
              ml={'16px'}
              disabled={isDownloading}
              borderRadius={'20px'}
              popperStyle={{
                '& div': {
                  minWidth: '100px',
                },
                '& span': {
                  marginLeft: '0px !important',
                },
                '& button': {
                  padding: '5px 10px !important',
                },
                '& b': {
                  fontSize: '17px',
                  fontWeight: '600',
                },
              }}
              sx={{
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'transparent !important',
                borderColor: '#cfcfcf',
                '.optionTitle': {
                  fontWeight: '400',
                  fontSize: '17px',
                },
              }}
              noMarginSvg
              placement='bottom-end'
              buttonLabel={
                <Box display={'flex'} alignItems={'center'}>
                  <DownloadIcon />
                  <Typography fontSize={'17px'} mt={'3px'} ml={'10px'}>
                    Скачать
                  </Typography>
                </Box>
              }
              popperData={[
                {
                  title: 'Полная скачать',
                  clickHandler: () => fullDownload(),
                },
                { title: 'Скачать по фильтру', clickHandler: () => downloadByFilter() },
              ]}
            />
          )}
          {/* {download && <DownloadButton isDownloading={isDownloading} download={download} />} */}
        </Box>
        {fullInfoAboutCurrentPage && (
          <Typography fontSize={'16px'} lineHeight={'24px'} color={'bunker.400'} fontWeight={'500'}>
            {t('ag_grid.bottom.info', { from: totalCount, start: offsetIndex * offsetSize - offsetSize + 1, end: offsetIndex * offsetSize })}
          </Typography>
        )}
        <Pagination count={controlledOffsetCount} handleChangeOffset={changeOffset} offset={offsetIndex} offsetQuery={offsetQuery} />
      </Box>
    </Box>
  )
}

export default memo(AgGridBottom)
