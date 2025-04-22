// import { useEffect, useRef, useState } from 'react'
// import { useTranslation } from 'react-i18next'
// import TickSmallIcon from '../../src/assets/icons/TickIcon'
// import { error } from '../../utils/toast'
// import './select.css'

// const MultiOptionSelectNew = ({
//   defaultSelectedAll,
//   options,
//   value,
//   isMenuOpen,
//   onChange,
//   multiple,
//   isLoading,
//   placeholder,
//   selectAllLabel,
//   countLabel,
//   label,
//   zIndex,
//   menuMinWidth,
//   required,
// }) => {
//   const { t } = useTranslation()
//   const [values, setValues] = useState(defaultSelectedAll ? options || [] : value || [])
//   const [focusedValue, setFocusedValue] = useState(-1)
//   const [isFocused, setIsFocused] = useState(false)
//   const [isOpen, setIsOpen] = useState(!!isMenuOpen || false)
//   const [typed, setTyped] = useState('')
//   const [hasApplied, setHasApplied] = useState(false)
//   const [isSelectAll, setIsSelectAll] = useState()
//   const [tempValues, setTempValues] = useState([])
//   const myRef = useRef(null)
//   const timeout = useRef(null)

//   useEffect(() => {
//     if (defaultSelectedAll && options?.length && onChange && !hasApplied) {
//       onChange(options)
//     }
//   }, [defaultSelectedAll, options, onChange])

//   const onFocus = () => {
//     setIsFocused(true)
//   }

//   const onBlur = () => {
//     if (onChange) {
//       if (tempValues?.length === 0) {
//         error('toast.error.multiple_select_at_least_one')
//         return
//       } else {
//         onChange(tempValues)
//       }
//     }
//     if (multiple) {
//       setFocusedValue(-1)
//       setIsFocused(false)
//       setIsOpen(false)
//     } else {
//       setFocusedValue(-1)
//       setIsFocused(false)
//       setIsOpen(false)
//     }
//   }

//   const onKeyDown = (e) => {
//     switch (e.key) {
//       case ' ':
//         e.preventDefault()
//         if (isOpen) {
//           if (multiple) {
//             if (focusedValue !== -1) {
//               setValues((prev) => {
//                 const [...values] = prev
//                 const { value } = options[focusedValue]
//                 const index = values.indexOf(value)

//                 if (index === -1) {
//                   values.push(value)
//                 } else {
//                   values.splice(index, 1)
//                 }

//                 return values
//               })
//             }
//           }
//         } else {
//           setIsOpen(true)
//         }
//         break
//       case 'Escape':
//       case 'Tab':
//         if (isOpen) {
//           e.preventDefault()
//           setIsOpen(false)
//         }
//         break
//       case 'Enter':
//         setIsOpen((prev) => !prev)
//         break
//       case 'ArrowDown':
//         e.preventDefault()
//         if (focusedValue < options.length - 1) {
//           const value = focusedValue + 1

//           if (multiple) {
//             setFocusedValue(value)
//           }
//           setValues([options[value]])
//         }
//         break
//       case 'ArrowUp':
//         e.preventDefault()
//         if (focusedValue > 0) {
//           const value = focusedValue - 1

//           if (multiple) {
//             setFocusedValue(value)
//           }
//           setValues([options[value]])
//         }
//         break
//       default:
//         if (/^[a-z0-9]$/i.test(e.key)) {
//           const char = e.key

//           clearTimeout(timeout.current)
//           timeout.current = setTimeout(() => {
//             setTyped('')
//           }, 1000)

//           const newTyped = typed + char
//           const re = new RegExp(`^${newTyped}`, 'i')
//           const index = options.findIndex((option) => re.test(option.value))

//           if (index === -1) {
//             setTyped(newTyped)
//           } else if (multiple) {
//             setFocusedValue(index)
//             setTyped(newTyped)
//           } else {
//             setValues([options[index]])
//             setFocusedValue(index)
//             setTyped(newTyped)
//           }
//         }
//         break
//     }
//   }

//   const onHoverOption = (e) => {
//     const { value } = e.currentTarget.dataset
//     const index = options.findIndex((option) => option.value === value)

//     setFocusedValue(index)
//   }

//   const onClick = () => {
//     setIsOpen(!isOpen)
//     if (onChange) {
//       onChange(tempValues)
//     }
//   }

//   const onClickOption = (e) => {
//     setIsSelectAll(false)
//     const { value } = e.currentTarget.dataset
//     const selectedOption = options.find((el) => el.id === value)
//     setValues((prev) => {
//       let [...values] = prev
//       const index = (values || []).map((el) => el?.id).indexOf(value)
//       if (!isLoading) {
//         if (index === -1) {
//           if (multiple) {
//             values.push(selectedOption)
//           } else {
//             values = [selectedOption]
//           }
//         } else if (multiple) {
//           if (values.length > 1) {
//             values.splice(index, 1)
//           }
//         } else {
//           values = []
//         }
//       }
//       return values
//     })
//   }

//   useEffect(() => {
//     setTempValues(multiple ? values : values?.[0])
//     if (values?.length === options?.length) {
//       setIsSelectAll(true)
//     }
//   }, [multiple, values, options])

//   const renderValues = () => {
//     if (values.length === 0 && !isSelectAll) {
//       return <div className='placeholder'>{placeholder}</div>
//     }

//     if (multiple) {
//       return (
//         <span className='multiple value'>
//           {(selectAllLabel && options.length && values?.length === options.length) || isSelectAll
//             ? selectAllLabel
//             : countLabel
//             ? `${values?.length} ${countLabel}`
//             : (values || [])?.map((value, index) => `${index !== 0 ? ', ' : ''} ${value?.name}`)}
//         </span>
//       )
//     }

//     return <div className='multiple value'>{values[0]?.name}</div>
//   }

//   const renderOption = (option, index) => {
//     const { name, id } = option

//     const selected = Boolean(values.find((el) => el?.id === id))

//     let className = 'option'
//     if (selected) className += ' selected'
//     if (index === focusedValue) className += ' focused'

//     return (
//       <div key={id} data-value={id} className={className} onMouseOver={onHoverOption} onClick={onClickOption}>
//         {name}

//         {selected && <TickSmallIcon />}
//       </div>
//     )
//   }

//   const renderOptions = () => {
//     if (!isOpen) {
//       return null
//     }

//     return (
//       <div className={`options ${!options?.length ? 'no-option' : ''}`}>
//         {options?.length ? (
//           <>
//             {selectAllLabel && (
//               <div
//                 className='option all'
//                 onClick={() => {
//                   setTempValues(!isSelectAll ? (multiple ? options : options?.[0]) : [])
//                   setIsSelectAll((prev) => !prev)
//                   setValues(!isSelectAll ? (multiple ? options : options?.[0]) : [])
//                 }}
//               >
//                 {selectAllLabel}
//                 {isSelectAll ? <TickSmallIcon /> : ''}
//               </div>
//             )}
//             {options.map(renderOption)}
//           </>
//         ) : (
//           <div className='option no-option'>{t('components.no_options')}</div>
//         )}
//       </div>
//     )
//   }

//   useEffect(() => {
//     if (value && !hasApplied) {
//       setValues(defaultSelectedAll ? options : value || [])
//       onChange(defaultSelectedAll ? options : value || [])
//       setHasApplied(true)
//     }
//   }, [value, defaultSelectedAll, options])

//   return (
//     <div
//       className='select'
//       tabIndex={0}
//       onFocus={onFocus}
//       onBlur={onBlur}
//       onKeyDown={onKeyDown}
//       ref={myRef}
//       style={{
//         zIndex: zIndex || 1,
//         width: menuMinWidth || myRef?.current?.offsetWidth,
//       }}
//     >
//       {label && <label className='label'>{label}</label>}
//       <div className={required ? 'selectionError' : 'selection'} onClick={onClick}>
//         {renderValues()}
//         <span className='arrow'>{isOpen ? <faChevronUp /> : <faChevronDown />}</span>
//       </div>
//       {renderOptions()}
//     </div>
//   )
// }

// export default MultiOptionSelectNew
import { get } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
// import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { Box } from '@mui/material'
import { useInView } from 'react-intersection-observer'
import ArrowDown from '../../src/assets/icons/ArrowDown'
import ArrowUp from '../../src/assets/icons/ArrowUp'
import TickSmallIcon from '../../src/assets/icons/TickIcon'
import { error } from '../../utils/toast'
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
  allOptions = false,
  required,
  request, // API request function
  initialLimit = 20, // Default limit
}) => {
  const { t } = useTranslation()
  const [options, setOptions] = useState([])
  const [values, setValues] = useState([])
  const [focusedValue, setFocusedValue] = useState(-1)
  const [isFocused, setIsFocused] = useState(false)
  const [isOpen, setIsOpen] = useState(!!isMenuOpen || false)
  const [typed, setTyped] = useState('')
  const [hasApplied, setHasApplied] = useState(false)
  const [isSelectAll, setIsSelectAll] = useState(false)
  const [tempValues, setTempValues] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState({
    limit: initialLimit,
    offset: 0,
    hasMore: true,
  })

  const myRef = useRef(null)
  const timeout = useRef(null)

  // Add intersection observer for infinite scrolling
  const { ref: bottomRef, inView } = useInView({
    threshold: 0.5,
  })

  // Initial data fetch
  useEffect(() => {
    if (request && isOpen) {
      fetchData()
    }
  }, [isOpen, pagination.offset])

  // Fetch data with current pagination
  const fetchData = async () => {
    if (!request || !pagination.hasMore) return

    setIsLoading(true)
    try {
      const response = await request({
        limit: pagination.limit,
        offset: pagination.offset,
      })

      const newData = get(response, 'data.data.data', [])

      if (pagination.offset === 0) {
        setOptions(newData)
      } else {
        setOptions((prev) => [...prev, ...newData])
      }

      // Check if we've reached the end
      if (newData.length < pagination.limit) {
        setPagination((prev) => ({ ...prev, hasMore: false }))
      }

      // Auto-select all if that's the default behavior
      if (defaultSelectedAll && pagination.offset === 0 && newData.length > 0 && !hasApplied) {
        setValues(newData)
        onChange?.(newData)
        setHasApplied(true)
        setIsSelectAll(true)
      }
    } catch (err) {
      console.error('Error fetching options:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Load more when bottom is reached
  useEffect(() => {
    if (inView && !isLoading && pagination.hasMore) {
      setPagination((prev) => ({
        ...prev,
        offset: prev.offset + prev.limit,
      }))
    }
  }, [inView, isLoading])

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

  const onBlur = () => {
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
  }

  const onKeyDown = (e) => {
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
      return (
        <span className='multiple value'>
          {(selectAllLabel && options.length && values?.length === options.length) || values == 'all' || isSelectAll
            ? selectAllLabel
            : countLabel
            ? `${values?.length} ${countLabel}`
            : (values || [])?.map((value, index) => `${index !== 0 ? ', ' : ''} ${value?.name}`)}
        </span>
      )
    }

    return <div className='multiple value'>{values[0]?.name}</div>
  }

  const renderOption = (option, index) => {
    const { name, id } = option
    const selected = values == 'all' ? 'all' : Boolean(values.find((el) => el?.id === id))

    let className = 'option'
    if (selected) className += ' selected'
    if (index === focusedValue) className += ' focused'

    return (
      <div key={id} data-value={id} className={className} onMouseOver={onHoverOption} onClick={onClickOption}>
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
      <div className={`options ${!options?.length ? 'no-option' : ''}`}>
        {options?.length ? (
          <>
            {selectAllLabel && (
              <div
                className='option all'
                onClick={() => {
                  setTempValues(!isSelectAll ? (multiple ? 'all' : options?.[0]) : [])
                  setIsSelectAll((prev) => !prev)
                  setValues(!isSelectAll ? (multiple ? 'all' : options?.[0]) : [])
                }}
              >
                {selectAllLabel}
                {isSelectAll || values == 'all' ? (
                  <Box flexShrink={0}>
                    <TickSmallIcon />
                  </Box>
                ) : (
                  ''
                )}
              </div>
            )}
            {options.map(renderOption)}
            {/* Add a reference point for infinite scrolling */}
            <div ref={bottomRef} style={{ height: '5px' }} />
            {isLoading && <div className='loading-indicator'>Loading...</div>}
          </>
        ) : (
          <div className='option no-option'>{t('components.no_options')}</div>
        )}
      </div>
    )
  }

  return (
    <div
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
    </div>
  )
}

export default MultiOptionSelectNew
