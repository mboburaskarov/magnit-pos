import { ContentCopy } from '@mui/icons-material'
import { Box, Chip, Drawer, IconButton, Paper, Typography } from '@mui/material'
import dayjs from 'dayjs'

const ActivityDrawer = ({ open, onClose }) => {
  let data = open
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }
  const type = data?.provider_type

  const normalizeJson = (value) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value)
      } catch {
        return value
      }
    }
    return value
  }

  const JsonViewer = ({ data, level = 0 }) => {
    const value = normalizeJson(data)
    const indent = level * 2

    if (value === null) {
      return <span className='json-null'>null</span>
    }

    if (typeof value === 'string') {
      return <span className='json-string'>"{value}"</span>
    }

    if (typeof value === 'number') {
      return <span className='json-number'>{value}</span>
    }

    if (typeof value === 'boolean') {
      return <span className='json-boolean'>{String(value)}</span>
    }

    if (Array.isArray(value)) {
      return (
        <>
          <span className='json-bracket'>[</span>
          {value.map((item, index) => (
            <div key={index} style={{ paddingLeft: indent + 2 }}>
              <JsonViewer data={item} level={level + 2} />
              {index < value.length - 1 && <span className='json-comma'>,</span>}
            </div>
          ))}
          <div style={{ paddingLeft: indent }}>
            <span className='json-bracket'>]</span>
          </div>
        </>
      )
    }

    if (typeof value === 'object') {
      const entries = Object.entries(value)

      return (
        <>
          <span className='json-bracket'>{'{'}</span>
          {entries.map(([key, val], index) => (
            <div key={key} style={{ paddingLeft: indent + 16 }}>
              <span className='json-key'>"{key}"</span>
              <span className='json-colon'>: </span>
              <JsonViewer data={val} level={level + 1} />
              {index < entries.length - 1 && <span className='json-comma'>,</span>}
            </div>
          ))}
          <div style={{ paddingLeft: indent }}>
            <span className='json-bracket'>{'}'}</span>
          </div>
        </>
      )
    }

    return null
  }

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 600 },
          bgcolor: '#f5f5f5',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
              Действие:
            </Typography>
            <Chip
              label={data?.provider_type}
              sx={{
                backgroundColor: type == 'payme' ? 'green.400' : type == 'epos' ? 'orange.400' : type == 'click' ? 'purple.500' : 'red.500',

                color: 'white',
                fontWeight: 500,
                borderRadius: 1,
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
              Дата:
            </Typography>
            <Typography variant='body2' sx={{ color: '#666' }}>
              {dayjs(data?.created_at).format('DD.MM.YYYY HH:mm:ss')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
                Запрос:
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: '#1e293b',
                  borderRadius: 2,
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    zIndex: 1,
                  }}
                >
                  <IconButton
                    size='small'
                    onClick={() => copyToClipboard(formatJSON(data?.payload))}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                      width: 32,
                      height: 32,
                      '& svg': {
                        fill: '#aaaaaa',
                      },
                    }}
                  >
                    <ContentCopy />
                  </IconButton>
                </Box>
                <Box
                  component='pre'
                  sx={{
                    p: 2,
                    m: 0,
                    maxHeight: '40vh',
                    overflow: 'auto',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    fontFamily: 'monospace',
                    bgcolor: '#1e293b',
                    borderRadius: 2,
                    whiteSpace: 'pre-wrap',
                    '& .json-key': {
                      color: '#38bdf8',
                    },
                    '& .json-string': {
                      color: '#4ade80',
                    },
                    '& .json-number': {
                      color: '#facc15',
                    },
                    '& .json-boolean': {
                      color: '#fb7185',
                    },
                    '& .json-null': {
                      color: '#a1a1aa',
                    },
                    '& .json-bracket': {
                      color: '#e5e7eb',
                    },
                    '& .json-comma': {
                      color: '#e5e7eb',
                    },
                    '& .json-colon': {
                      color: '#94a3b8',
                    },
                  }}
                >
                  <JsonViewer data={data?.payload} />
                </Box>
              </Paper>
            </Box>

            <Box>
              <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
                Ответ:
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: '#1e293b',
                  borderRadius: 2,
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    zIndex: 1,
                  }}
                >
                  <IconButton
                    size='small'
                    onClick={() => copyToClipboard(formatJSON(data?.response))}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                      width: 32,
                      height: 32,
                      '& svg': {
                        fill: '#aaaaaa',
                      },
                    }}
                  >
                    <ContentCopy />
                  </IconButton>
                </Box>
                <Box
                  component='pre'
                  sx={{
                    p: 2,
                    m: 0,
                    overflow: 'auto',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    fontFamily: 'monospace',
                    bgcolor: '#1e293b',
                    borderRadius: 2,
                    whiteSpace: 'pre-wrap',
                    maxHeight: '40vh',
                    '& .json-key': {
                      color: '#38bdf8',
                    },
                    '& .json-string': {
                      color: '#4ade80',
                    },
                    '& .json-number': {
                      color: '#facc15',
                    },
                    '& .json-boolean': {
                      color: '#fb7185',
                    },
                    '& .json-null': {
                      color: '#a1a1aa',
                    },
                    '& .json-bracket': {
                      color: '#e5e7eb',
                    },
                    '& .json-comma': {
                      color: '#e5e7eb',
                    },
                    '& .json-colon': {
                      color: '#94a3b8',
                    },
                  }}
                >
                  <JsonViewer data={data?.response} />
                </Box>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  )
}
export default ActivityDrawer
