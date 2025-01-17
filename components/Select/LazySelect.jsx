import { useCallback, useState, useRef, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { Controller } from 'react-hook-form'
import Select, { components } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { useStyles } from './SelectSimple'
import { useDebounce } from 'use-debounce'
import { generateCustomStyles } from './SelectStyles'
import useVirtualizedData from '../../src/hooks/useVirtualizedData'
import DeleteSmallIcon from '../../src/assets/icons/DeleteSmallIcon'
import DeleteIconBig from '../../src/assets/icons/DeleteIconBig'
import LoadingBlock from '../LoadingBlock'

const SingleValue = ({ children, selectProps, ...props }) => (
  <components.SingleValue selectProps={selectProps} {...props}>
    <Box display='flex' alignItems='center' flexWrap='wrap'>
      {selectProps?.beforeContent && <Typography sx={{ color: 'gray.400', marginRight: 2 }}>{selectProps?.beforeContent}</Typography>}
      <span
        style={{
          lineHeight: 1.2,
          display: `-webkit-box`,
          maxHeight: `calc(16px * 1.2 * 1)`,
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
          overflow: `hidden`,
          textOverflow: `ellipsis`,
        }}
      >
        {children}
      </span>
    </Box>
  </components.SingleValue>
)

const MultiValueRemove = (props) => (
  <components.MultiValueRemove {...props}>
    <DeleteIconBig />
  </components.MultiValueRemove>
)

const ClearIndicator = (props) => (
  <components.ClearIndicator {...props}>
    <Box
      sx={{
        paddingRight: '12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <DeleteSmallIcon />
    </Box>
  </components.ClearIndicator>
)

const CustomOption = (props) => {
  const cls = useStyles()
  return (
    <div {...props.innerProps} ref={props?.selectProps?.lastElementRef} className={cls.lazyOption}>
      {props?.label}
    </div>
  )
}

function LazySelect({
  id,
  withAllSelect,
  control,
  name,
  getOptionLabel = (option) => option.name,
  getOptionValue,
  defaultValue,
  boxStyle,
  label,
  placeholder = 'components.enterAttribute',
  uncontrolled,
  value = '',
  onChange,
  beforeContent,
  white,
  isMulti,
  required,
  maxWidth,
  error,
  asteriks,
  maxOptionMenuHeight,
  solidBorder,
  isSearchable = true,
  isCreatable = false,
  disabled = false,
  removable,
  onRemove,
  index,
  small,
  mini,
  labelOrder,
  minWidth,
  isClearable = true,
  customValue,
  placeholderWrap = true,
  formatOptionLabel,
  dashed,
  menuPlacement = 'bottom',
  request,
  filters,
  filterOption,
  slug,
  createOptionRequest,
  getData,
}) {
  const customStyles = generateCustomStyles({
    withAllSelect,
    minWidth: minWidth ?? (mini ? 150 : 256),
    beforeContent,
    white,
    error,
    maxOptionMenuHeight,
    small,
    mini,
    solidBorder,
    placeholderWrap: placeholderWrap || true,
    dashed,
  })
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 300)
  const { data, hasMore, loading, setData, response } = useVirtualizedData(request, debouncedSearch, page, slug || id, filters)

  useEffect(() => {
    if (typeof getData === 'function') {
      getData(data)
    }
  }, [data])
  const cls = useStyles()
  const observer = useRef()
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore]
  )

  const handleInputChange = (inputValue) => {
    setPage(1)
    setSearch(inputValue)
  }

  const handleCreate = (inputValue) => {
    if (!!createOptionRequest) {
      create({ name: inputValue })
    } else {
      control.setValue(name, { label: inputValue })
    }
  }
  const LoadingMessage = () => <LoadingBlock mini />
  console.log(response)

  return (
    <Box className={cls.root} {...boxStyle} maxWidth={maxWidth}>
      {label && (
        <Typography className={`${!label && cls.noLabel} ${label && required && asteriks ? cls.required : ''}`} mb={2} variant='h5'>
          {labelOrder && <span className={cls.orderedLabel}>{labelOrder}</span>}
          {label}
        </Typography>
      )}
      {uncontrolled ? (
        <Select
          inputId={id}
          styles={customStyles}
          onInputChange={handleInputChange}
          name={name}
          formatOptionLabel={formatOptionLabel}
          isSearchable={isSearchable}
          placeholder={placeholder}
          noOptionsMessage={() => 'no options'}
          formatCreateLabel={(inputValue) => 'components.add_inputValue ' + inputValue}
          onChange={(val) => onChange(val)}
          value={value}
          isDisabled={disabled}
          isMulti={isMulti}
          isClearable={isClearable}
          getOptionLabel={getOptionLabel}
          filterOption={filterOption}
          options={
            response?.data?.data?.data?.map((el) => ({ ...el })) || [
              {
                _id: '64960ad8fb82b59680236ffa',
                fullName: 'Nosirzoda Khasanjon',
                phone: 998970009229,
                status: 'ACTIVE',
                isDeleted: false,
                createdAt: '2023-06-23T21:12:56.376Z',
                updatedAt: '2023-06-23T21:12:56.376Z',
                avatar: '2023/06/01/1685621823743-avatar (17).svg',
                phoneNumber: '998970009229',
              },
            ]
          }
          defaultValue={defaultValue || ''}
          beforeContent={beforeContent}
          menuPlacement={menuPlacement}
          lastElementRef={lastElementRef}
          isLoading={loading}
          components={{
            ...(removable && {
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }),
            ...(!isMulti && { SingleValue }),
            Option: CustomOption,
            LoadingMessage,
          }}
          getOptionValue={getOptionValue}
        />
      ) : (
        <Controller
          control={control}
          name={name}
          defaultValue={defaultValue || ''}
          rules={{
            required,
          }}
          render={({ field: { onChange, value } }) =>
            isCreatable ? (
              <CreatableSelect
                inputId={id}
                styles={customStyles}
                createOptionPosition='first'
                isDisabled={disabled}
                onInputChange={handleInputChange}
                isLoading={loading}
                isMulti={isMulti}
                formatCreateLabel={(inputValue) => (
                  <>
                    <FontAwesomeIcon icon={faPlusCircle} color={'#119676'} />
                    <span style={{ marginLeft: 8 }}>{'components.add_inputValue ' + inputValue}</span>
                  </>
                )}
                noOptionsMessage={() => 'no_options'}
                components={{
                  MultiValueRemove,
                  Option: CustomOption,
                  ClearIndicator,
                }}
                onCreateOption={handleCreate}
                onChange={(val) => {
                  if (isMulti) {
                    onChange(val.map((el) => el))
                  } else {
                    const formattedValue = customValue ? customValue(val) : val
                    onChange(formattedValue)
                  }
                }}
                value={value}
                options={response?.data?.data?.data?.map((option) => ({
                  label: option?.name,
                  value: option?.id,
                }))}
                placeholder={placeholder}
                isClearable={isClearable}
                lastElementRef={lastElementRef}
              />
            ) : (
              <Select
                inputId={id}
                isDisabled={disabled}
                styles={customStyles}
                onInputChange={handleInputChange}
                isSearchable={isSearchable}
                placeholder={placeholder}
                menuPlacement={menuPlacement}
                filterOption={filterOption}
                noOptionsMessage={() => 'no_options'}
                isMulti={isMulti}
                formatCreateLabel={(inputValue) => 'components.add_inputValue ' + inputValue}
                onChange={(val) => {
                  if (isMulti) {
                    onChange(val.map((el) => ({ id: el?.id, ...el })))
                  } else {
                    const formattedValue = customValue ? customValue(val) : val
                    onChange(formattedValue)
                  }
                }}
                getOptionLabel={getOptionLabel}
                getOptionValue={(option) => option.id}
                options={
                  response?.data?.data?.data?.map((option) => ({
                    name: option?.name,
                    value: option?.id,
                    id: option?.id,
                  })) || []
                }
                defaultValue={defaultValue || ''}
                value={value}
                beforeContent={beforeContent}
                isClearable={isClearable}
                lastElementRef={lastElementRef}
                isLoading={loading}
                components={{
                  ...(removable && {
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                  }),
                  ...(!isMulti && { SingleValue }),
                  MultiValueRemove,
                  Option: CustomOption,
                  ClearIndicator,
                }}
              />
            )
          }
        />
      )}
      {removable && (
        <button type='button' onClick={() => onRemove(index)}>
          <DeleteSmallIcon />
        </button>
      )}
    </Box>
  )
}

export default LazySelect
