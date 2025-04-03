import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import StyledSwitch from '../../../../components/Switch/StyledSwitch'
import TreeSelectCategory from '../../../../components/TreeSelectCategory/index'

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
        })) || [],
    })) || []
  return section?.permissions?.length ? (
    <Box ref={sectionRef} id={id} className={classes.root}>
      <Box display='flex' alignItems='center' justifyContent='space-between' mb={4}>
        <Typography variant='h3' className={classes.title}>
          {t(`navbar.${section?.key}`)}
        </Typography>
        <StyledSwitch
          checked={!disabled?.includes(section.key)}
          onChange={() => {
            if (setDisabled) {
              if (disabled?.includes(section.key)) {
                setDisabled(disabled?.filter((el) => el !== section.key))
              } else {
                setDisabled((old) => [...old, section.key])
              }
            }
          }}
          name={section?.key}
        />
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
