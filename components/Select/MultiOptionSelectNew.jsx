import { Box, TextField, Typography } from '@mui/material'
import { get } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useInView } from 'react-intersection-observer'
import ArrowDown from '../../src/assets/icons/ArrowDown'
import ArrowUp from '../../src/assets/icons/ArrowUp'
import TickSmallIcon from '../../src/assets/icons/TickIcon'
import { useQueryParams } from '../../src/hooks/useQueryParams'
import { error } from '../../utils/toast'
import StyledTooltip from '../StyledTooltip'
import './select.css'

const MultiOptionSelectNew = ({
  defaultSelectedAll,
  value,
  isMenuOpen,
  onChange,
  multiple,
  placeholder,
  selectAllLabel,
  countLabel,
  label,
  zIndex,
  menuMinWidth,
  customFilter,
  required,
  request, // API request function
  initialLimit = 20, // Default limit
}) => {
  const { t } = useTranslation()
  const [options, setOptions] = useState([])
  const { values: serachParams } = useQueryParams()

  const [values, setValues] = useState([])
  const [focusedValue, setFocusedValue] = useState(-1)
  const [isFocused, setIsFocused] = useState(false)
  const [isOpen, setIsOpen] = useState(!!isMenuOpen || false)
  const [typed, setTyped] = useState('')
  const [hasApplied, setHasApplied] = useState(false)
  const [isSelectAll, setIsSelectAll] = useState(false)
  const [tempValues, setTempValues] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false) // Separate loading state for search
  const [searchTerm, setSearchTerm] = useState('') // New state for search
  const [pagination, setPagination] = useState({
    limit: initialLimit,
    offset: 0,
    hasMore: true,
  })

  const myRef = useRef(null)
  const timeout = useRef(null)
  const searchInputRef = useRef(null) // Ref for search input

  // Add intersection observer for infinite scrolling
  const { ref: bottomRef, inView } = useInView({
    threshold: 0.1, // Reduced threshold for earlier trigger
    rootMargin: '100px', // Trigger 100px before reaching the element
  })

  // Handle search term changes with debouncing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (request && isOpen) {
        setIsSearching(true) // Set searching state instead of clearing options immediately
        // Reset pagination when search changes
        setPagination({
          limit: initialLimit,
          offset: 0,
          hasMore: true,
        })
        // Trigger data fetch by updating a separate trigger state
        setSearchTrigger(Date.now())
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, isOpen])

  // State to trigger search
  const [searchTrigger, setSearchTrigger] = useState(0)

  // Data fetching effect
  useEffect(() => {
    if (request && isOpen) {
      fetchData()
    }
  }, [isOpen, pagination.offset, searchTrigger])

  // Fetch data with current pagination and search
  const fetchData = async () => {
    if (!request || (!pagination.hasMore && pagination.offset > 0)) return

    const isNewSearch = pagination.offset === 0 && isSearching

    if (isNewSearch) {
      setIsSearching(true)
    } else {
      setIsLoading(true)
    }

    try {
      const response = await request({
        limit: pagination.limit,
        offset: pagination.offset,
        search: searchTerm || serachParams?.search,
        ...customFilter,
      })

      const newData = get(response, 'data.data.data', []).filter((item) => item?.name != 'Pharma Cosmos ')

      if (pagination.offset === 0) {
        setOptions(newData) // Replace options for new search
      } else {
        setOptions((prev) => [...prev, ...newData]) // Append for pagination
      }

      // Update hasMore status
      const hasMoreData = newData.length === pagination.limit
      setPagination((prev) => ({
        ...prev,
        hasMore: hasMoreData,
      }))

      // Auto-select all if that's the default behavior
      if (defaultSelectedAll && pagination.offset === 0 && newData.length > 0 && !hasApplied) {
        setValues(newData)
        onChange?.(newData)
        setHasApplied(true)
        setIsSelectAll(true)
      }
    } catch (err) {
      console.error('Error fetching options:', err)
      setPagination((prev) => ({ ...prev, hasMore: false }))
    } finally {
      setIsLoading(false)
      setIsSearching(false)
    }
  }

  // Load more when bottom is reached
  useEffect(() => {
    if (inView && !isLoading && pagination.hasMore && isOpen) {
      setPagination((prev) => ({
        ...prev,
        offset: prev.offset + prev.limit,
      }))
    }
  }, [inView, isLoading, pagination.hasMore, isOpen])

  // Initialize with provided value
  useEffect(() => {
    if (value && !hasApplied) {
      setValues(value || [])
      setHasApplied(true)
    }
  }, [value])

  const onFocus = () => {
    setIsFocused(true)
  }

  const onBlur = (e) => {
    // Check if the blur event is moving focus to the search input or any element within the dropdown
    if (e.relatedTarget && myRef.current?.contains(e.relatedTarget)) {
      return // Don't close if focus is moving within the component
    }

    if (onChange && tempValues) {
      if (tempValues?.length === 0) {
        error(t('toast.error.multiple_select_at_least_one'))
        return
      } else {
        onChange(tempValues)
      }
    }

    setFocusedValue(-1)
    setIsFocused(false)
    setIsOpen(false)
    setSearchTerm('') // Clear search when closing
  }

  const onKeyDown = (e) => {
    // Don't handle keyboard navigation when search input is focused
    if (document.activeElement === searchInputRef.current) {
      return
    }

    switch (e.key) {
      case ' ':
        e.preventDefault()
        if (isOpen) {
          if (multiple) {
            if (focusedValue !== -1) {
              setValues((prev) => {
                const [...values] = prev
                const { value } = options[focusedValue]
                const index = values.indexOf(value)

                if (index === -1) {
                  values.push(value)
                } else {
                  values.splice(index, 1)
                }

                return values
              })
            }
          }
        } else {
          setIsOpen(true)
        }
        break
      case 'Escape':
      case 'Tab':
        if (isOpen) {
          e.preventDefault()
          setIsOpen(false)
          setSearchTerm('')
        }
        break
      case 'Enter':
        setIsOpen((prev) => !prev)
        break
      case 'ArrowDown':
        e.preventDefault()
        if (focusedValue < options.length - 1) {
          const value = focusedValue + 1

          if (multiple) {
            setFocusedValue(value)
          }
          setValues([options[value]])
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (focusedValue > 0) {
          const value = focusedValue - 1

          if (multiple) {
            setFocusedValue(value)
          }
          setValues([options[value]])
        }
        break
      default:
        if (/^[a-z0-9]$/i.test(e.key)) {
          const char = e.key

          clearTimeout(timeout.current)
          timeout.current = setTimeout(() => {
            setTyped('')
          }, 1000)

          const newTyped = typed + char
          const re = new RegExp(`^${newTyped}`, 'i')
          const index = options.findIndex((option) => re.test(option.value))

          if (index === -1) {
            setTyped(newTyped)
          } else if (multiple) {
            setFocusedValue(index)
            setTyped(newTyped)
          } else {
            setValues([options[index]])
            setFocusedValue(index)
            setTyped(newTyped)
          }
        }
        break
    }
  }

  const onHoverOption = (e) => {
    const { value } = e.currentTarget.dataset
    const index = options.findIndex((option) => option.id === value)
    setFocusedValue(index)
  }

  const onClick = () => {
    setIsOpen(!isOpen)
    if (onChange) {
      onChange(tempValues)
    }
    // Focus search input when opening
    if (!isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }

  const onClickOption = (e) => {
    setIsSelectAll(false)
    const { value } = e.currentTarget.dataset
    const selectedOption = options == 'all' ? [] : options.find((el) => el.id === value)
    setValues((prev) => {
      let [...values] = prev == 'all' ? [] : prev
      const index = (values || []).map((el) => el?.id).indexOf(value)
      if (!isLoading) {
        if (index === -1) {
          if (multiple) {
            values.push(selectedOption)
          } else {
            values = [selectedOption]
          }
        } else if (multiple) {
          if (values.length > 1) {
            values.splice(index, 1)
          }
        } else {
          values = []
        }
      }
      return values
    })
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
  }

  // Prevent dropdown from closing when clicking on search input
  const handleSearchMouseDown = (e) => {
    // e.preventDefault()
    // e.stopPropagation()
  }

  useEffect(() => {
    setTempValues(multiple ? values : values?.[0])
    if (values?.length === options?.length && options.length > 0) {
      setIsSelectAll(true)
    }
  }, [multiple, values, options])

  const renderValues = () => {
    if (values.length === 0 && !isSelectAll) {
      return <div className='placeholder'>{placeholder}</div>
    }

    if (multiple) {
      let val =
        (selectAllLabel && options.length && values?.length === options.length && values.length != 1) ||
        ((values == 'all' || isSelectAll) && values.length != 1)
          ? selectAllLabel
          : countLabel
          ? `${values?.length} ${countLabel}`
          : (values || [])?.map((value, index) => `${index !== 0 ? ', ' : ''} ${value?.name}`)
      console.log(val)

      return (
        <StyledTooltip hide={val == selectAllLabel} title={<Box sx={{ display: 'flex', flexDirection: 'column' }}>{val}</Box>} placement='top'>
          <span className='multiple value'>{val}</span>
        </StyledTooltip>
      )
    }

    return <div className='multiple value'>{values[0]?.name || t('placeholders.select_shops')}</div>
  }

  const renderOption = (option, index) => {
    const { name, id } = option

    const selected = values == 'all' ? 'all' : multiple ? Boolean(values?.find((el) => el?.id === id)) : Boolean(values?.id === id)

    let className = 'option'
    if (selected) className += ' selected'
    if (index === focusedValue) className += ' focused'

    return (
      <div
        key={id}
        onMouseDown={(e) => e.preventDefault()} // prevent blur before click
        data-value={id}
        className={className}
        onMouseOver={onHoverOption}
        onClick={onClickOption}
      >
        {name}
        {(selected || selected == 'all') && (
          <Box flexShrink={0}>
            <TickSmallIcon />
          </Box>
        )}
      </div>
    )
  }

  const renderOptions = () => {
    if (!isOpen) {
      return null
    }

    return (
      <Box
        sx={{
          minWidth: 300,
          '& .options': {
            transition: 'opacity 0.2s ease-in-out',
          },
          '& .option': {
            transition: 'all 0.15s ease-in-out',
          },
        }}
        className={`options ${!options?.length ? 'no-option' : ''}`}
      >
        {/* Search Input */}
        <Box sx={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>
          <TextField
            ref={searchInputRef}
            size='small'
            placeholder='Search options...'
            value={searchTerm}
            onChange={handleSearchChange}
            onMouseDown={handleSearchMouseDown}
            onFocus={(e) => e.stopPropagation()}
            fullWidth
            variant='outlined'
            sx={{
              '& .MuiOutlinedInput-root': {
                height: '17px',
                fontWeight: '500',
                fontSize: '18px',
                height: '48px',
              },
            }}
          />
        </Box>

        <>
          {options?.length ? (
            <>
              {selectAllLabel && (
                <div
                  className='option all'
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setTempValues(!isSelectAll ? (multiple ? 'all' : options?.[0]) : [])
                    setIsSelectAll((prev) => !prev)
                    setValues(!isSelectAll ? (multiple ? 'all' : options?.[0]) : [])
                  }}
                >
                  {selectAllLabel}
                  {(isSelectAll || values == 'all') && values?.length != 1 ? (
                    <Box flexShrink={0}>
                      <TickSmallIcon />
                    </Box>
                  ) : (
                    ''
                  )}
                </div>
              )}

              {options.map(renderOption)}
              {pagination.hasMore && <div ref={bottomRef} style={{ height: '20px', width: '100%' }} />}
              {isLoading && (
                <div className='loading-indicator' style={{ padding: '10px', textAlign: 'center' }}>
                  Loading more options...
                </div>
              )}
            </>
          ) : (
            <div className='option no-option'>{t('components.no_options')}</div>
          )}
        </>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minWidth: 300,
        '& .options': {
          height: '450px !important',
        },
      }}
      className='select'
      tabIndex={0}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      ref={myRef}
      style={{
        zIndex: zIndex || 1,
        width: menuMinWidth || myRef?.current?.offsetWidth,
      }}
    >
      {label && <label className='label'>{label}</label>}
      <div className={required ? 'selectionError' : 'selection'} onClick={onClick}>
        {renderValues()}
        <span className='arrow'>{!isOpen ? <ArrowDown /> : <ArrowUp color='#000' />}</span>
      </div>
      {renderOptions()}
    </Box>
  )
}

export default MultiOptionSelectNew
