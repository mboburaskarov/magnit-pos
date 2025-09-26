import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Typography } from '@mui/material'
import { t } from 'i18next'
import { get } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Controller } from 'react-hook-form'
import Select, { components } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { useDebounce } from 'use-debounce'
import DeleteIconBig from '../../src/assets/icons/DeleteIconBig'
import DeleteSmallIcon from '../../src/assets/icons/DeleteSmallIcon'
import useVirtualizedData from '../../src/hooks/useVirtualizedData'
import Label from '../Label'
import LoadingBlock from '../LoadingBlock'
import { useStyles } from './SelectSimple'
import { generateCustomStyles } from './SelectStyles'

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
  customLabel = 'name',
  boxStyle,
  label,
  placeholder = 'components.enterAttribute',
  uncontrolled,
  value = '',
  onChange,
  beforeContent,
  white,
  minHeight,
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
    minHeight,
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

  const handleCreate = async (inputValue, onChange) => {
    if (!!createOptionRequest) {
      const response = await createOptionRequest({ name: inputValue })

      const newOption = response?.data?.data // Adjust this based on your API response structure
      onChange({
        value: get(newOption, 'id'),
        label: get(newOption, 'name'),
      })
    } else {
      control.setValue(name, { label: inputValue })
    }
  }
  const LoadingMessage = () => <LoadingBlock mini />

  return (
    <Box className={cls.root} {...boxStyle} maxWidth={maxWidth}>
      {label && (
        <Label mb={1.5} required={required}>
          {label}
        </Label>
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
          formatCreateLabel={(inputValue) => t('components.add_inputValue', { inputValue })}
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
                    <span style={{ marginLeft: 8 }}>{t('components.add_inputValue', { inputValue })}</span>
                  </>
                )}
                noOptionsMessage={() => 'no_options'}
                components={{
                  MultiValueRemove,
                  Option: CustomOption,
                  ClearIndicator,
                }}
                onCreateOption={(a) => handleCreate(a, onChange)}
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
                formatCreateLabel={(inputValue) => t('components.add_inputValue', { inputValue })}
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
                    name: typeof customLabel === 'function' ? customLabel(option) : option?.[customLabel],
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
