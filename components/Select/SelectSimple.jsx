import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Controller, useFormContext } from 'react-hook-form'
import Select, { components } from 'react-select'
import { generateCustomStyles } from './SelectStyles'
import DeleteIconBig from '../../src/assets/icons/DeleteIconBig'
import DeleteSmallIcon from '../../src/assets/icons/DeleteSmallIcon'
import { memo, useEffect } from 'react'
import Label from '../Label'

const SingleValue = ({ children, selectProps, ...props }) => {
  return (
    <components.SingleValue selectProps={selectProps} {...props}>
      <Box display='flex' alignItems='center' flexWrap='wrap'>
        {selectProps?.beforeContent && <Typography style={{ color: 'grey.400', marginRight: 2 }}>{selectProps?.beforeContent}</Typography>}
        <span
          id={`select-${props?.data?.name}`}
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
}

export const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    '& > button': {
      background: 'transparent',
      border: 0,
      cursor: 'pointer',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      right: 16,
      zIndex: 99,
    },
  },

  noLabel: {
    marginBottom: 0,
  },
  required: {
    '&::after': {
      content: '" *"',
      color: theme.palette.red[500],
    },
  },
  orderedLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    marginRight: 16,
    borderRadius: '40px',
    color: theme.palette.white,
    backgroundColor: theme.palette.green[600],
  },
  lazyOption: {
    padding: '18px 16px',
    height: 'auto',
    cursor: 'pointer',
    display: 'flex',
    fontFamily: 'Gilroy',
    alignItems: 'center',
    userSelect: 'none',
    fontWeight: 600,
    color: theme.palette.grey[600],

    '&:hover': {
      backgroundColor: theme.palette.grey[101],
    },
  },
}))

const MultiValueRemove = (props) => (
  <components.MultiValueRemove {...props}>
    <DeleteIconBig />
  </components.MultiValueRemove>
)

const CustomOption = (props) => {
  const cls = useStyles()
  return (
    <div {...props.innerProps} ref={props?.selectProps?.lastElementRef} id={props?.label} className={cls.lazyOption}>
      {props?.label}
    </div>
  )
}

const SelectToUse = ({
  id,
  customStyles,
  name,
  formatOptionLabel,
  isSearchable,
  placeholder,
  value,
  onChange,
  disabled,
  isMulti,
  isClearable,
  getOptionLabel,
  options,
  defaultValue,
  beforeContent,
  removable,
  menuPlacement,
  getOptionValue,
  onBlur,
  openMenu,
  filterOption,
}) => {
  return (
    <Select
      inputId={id}
      styles={customStyles}
      name={name}
      formatOptionLabel={formatOptionLabel}
      isSearchable={isSearchable}
      placeholder={placeholder}
      noOptionsMessage={() => 'Нет вариантов'}
      formatCreateLabel={(inputValue) => 'Добавить входное значение ' + inputValue}
      value={value}
      onChange={(val) => onChange(val)}
      isDisabled={disabled}
      isMulti={isMulti}
      isClearable={isClearable}
      getOptionLabel={getOptionLabel}
      options={options || []}
      defaultValue={defaultValue || ''}
      beforeContent={beforeContent}
      menuPlacement={menuPlacement}
      components={{
        ...(removable && {
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }),
        ...(!isMulti && { SingleValue }),
        MultiValueRemove,
        Option: CustomOption,
      }}
      getOptionValue={getOptionValue}
      onBlur={onBlur}
      autoFocus={openMenu}
      openMenuOnFocus={openMenu}
      menuPortalTarget={document.body}
      {...(filterOption && { filterOption: filterOption })}
    />
  )
}

function SelectSimple({
  id,
  withAllSelect,
  name,
  options,
  getOptionLabel = (option) => option.name,
  getOptionValue,
  defaultValue,
  boxStyle,
  label,
  placeholder = 'Введите атрибут',
  uncontrolled = false,
  value = '',
  onChange,
  beforeContent,
  white,
  isMulti,
  borderRadius,
  required = false,
  maxWidth,
  maxOptionMenuHeight,
  solidBorder,
  isSearchable = true,
  disabled = false,
  removable,
  onRemove,
  borderNone,
  index,
  small,
  mini,
  minWidth,
  isClearable = true,
  placeholderWrap = true,
  formatOptionLabel,
  dashed,
  menuPlacement = 'bottom',
  onBlur,
  openMenu = false,
  fullWidth,
  filterOption = null,
}) {
  const cls = useStyles()
  const methods = useFormContext()

  const customStyles = generateCustomStyles({
    withAllSelect,
    minWidth: minWidth ?? (mini ? 150 : 256),
    beforeContent,
    white,
    error: !!methods?.formState?.errors?.[name],
    maxOptionMenuHeight,
    small,
    mini,
    borderNone,
    solidBorder,
    borderRadius,
    placeholderWrap: placeholderWrap || true,
    dashed,
  })
  return (
    <Box className={(cls.root, 'select')} width={fullWidth && '100%'} {...boxStyle} maxWidth={maxWidth}>
      {label && (
        <Label mb={1.5} required={required}>
          {label}
        </Label>
      )}
      {uncontrolled ? (
        <SelectToUse
          id={id}
          customStyles={customStyles}
          name={name}
          formatOptionLabel={formatOptionLabel}
          isSearchable={isSearchable}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          isMulti={isMulti}
          isClearable={isClearable}
          getOptionLabel={getOptionLabel}
          options={options}
          defaultValue={defaultValue}
          beforeContent={beforeContent}
          removable={removable}
          menuPlacement={menuPlacement}
          getOptionValue={getOptionValue}
          onBlur={onBlur}
          openMenu={openMenu}
          filterOption={filterOption}
        />
      ) : (
        <Controller
          control={methods.control}
          name={name}
          defaultValue={defaultValue || ''}
          rules={{ required }}
          render={({ field: { onChange: onFieldChange, value: fieldValue } }) => (
            <SelectToUse
              id={id}
              customStyles={customStyles}
              name={name}
              formatOptionLabel={formatOptionLabel}
              isSearchable={isSearchable}
              placeholder={placeholder}
              value={fieldValue}
              onChange={onFieldChange}
              disabled={disabled}
              isMulti={isMulti}
              isClearable={isClearable}
              getOptionLabel={getOptionLabel}
              options={options}
              defaultValue={defaultValue}
              beforeContent={beforeContent}
              removable={removable}
              menuPlacement={menuPlacement}
              getOptionValue={getOptionValue}
              onBlur={onBlur}
              openMenu={openMenu}
              filterOption={filterOption}
            />
          )}
        />
      )}
      {removable && (
        <button type='button' onClick={() => onRemove(index)}>
          <DeleteSmallIcon id={`${id}-deleteIcon`} />
        </button>
      )}
    </Box>
  )
}

export default memo(SelectSimple)
