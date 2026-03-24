import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import TreeSelectCategory from '@components/TreeSelectCategory/index'
const getSectionTitle = (section) => {
  let title

  title =
    section?.id == '1f25d79d-eee4-415a-a54b-2dea332c4b32'
      ? 'Продажи'
      : section?.id == 'fe8302ba-c1c0-4f9d-8da7-2fad3c445a27'
        ? 'Все продажи'
        : section?.id == 'befb3a17-4c4a-420a-8447-cc86eda26c15'
          ? 'Дашбоард'
          : section?.id == '31f043d7-adef-4d35-bff6-a1a5daa28d64'
            ? 'Отчеты'
            : section?.id == 'd2be20e0-d95c-4809-acf6-0cae27530dae'
              ? 'Товары'
              : section?.id == 'aa578470-e40c-4246-a5c8-49c265e0dfbe'
                ? 'Настройки'
                : section?.id == 'e6e5ce44-9102-4edf-9df0-d730e9c9e78d'
                  ? 'Клиенты'
                  : 'Неизвестный'

  return title
}
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: '32px 0 32px 0',
  },
  title: {
    color: theme.palette.gray[600],
    fontFamily: theme.fontFamily.gilroyBold,
  },
  line: {
    width: '100%',
    marginLeft: 16,
    border: `2px dashed ${theme.palette.gray[200]}`,
    borderStyle: 'none none dashed',
    color: '#fff',
    backgroundColor: theme.palette.background.default,
  },
  desc: {
    fontWeight: '600',
    fontSize: 16,
    lineHeight: '19px',
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.gray[400],
  },
  required: {
    '&::after': {
      content: '" *"',
      color: theme.palette.red[500],
    },
  },
}))

export default function Section({ section, sectionRef, setDisabled, disabled, selected, setSelected, searchTerm, id }) {
  const classes = useStyles()
  const { t } = useTranslation()
  const sectionArrays =
    section?.permissions?.map((permission) => ({
      id: permission?.id,
      name: permission?.name,
      description: permission?.description,
      is_active: permission?.is_active,
      children:
        permission?.children?.map((child) => ({
          id: child?.id,
          name: child?.name,
          description: child?.description,

          is_active: child?.is_active,
          children:
            child?.children?.map((child) => ({
              id: child?.id,
              name: child?.name,
              description: child?.description,

              is_active: child?.is_active,
            })) || [],
        })) || [],
    })) || []
  return section?.permissions?.length ? (
    <Box ref={sectionRef} id={id} className={classes.root}>
      <Box display='flex' alignItems='center' justifyContent='space-between' mb={4}>
        <Typography variant='h3' className={classes.title}>
          {getSectionTitle(section)}
        </Typography>
      </Box>
      <Box>
        {!!sectionArrays?.length && (
          <TreeSelectCategory
            selected={selected}
            setSelected={setSelected}
            categories={sectionArrays || []}
            disabled={disabled?.includes(section.key)}
            highlight
            searchTerm={searchTerm}
            roles
          />
        )}
      </Box>
    </Box>
  ) : null
}
