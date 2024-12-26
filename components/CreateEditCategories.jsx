import { Box, Tooltip, Typography, Button } from '@mui/material'
import InputSimple from '../components/Inputs/InputSimple'
import LoadingContainer from '../components/LoadingContainer'
import SectionDrawer from '../components/SectionDrawer'
import useDeepCompareEffect from '../src/hooks/useDeepCompareEffect'
import { useQueryParams } from '../src/hooks/useQueryParams'
import useWebsocketMutation from '../src/hooks/useDebounce'
import PlusIconBlue from '../src/assets/icons/PlusIcon'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { error, success } from '../utils/toast'
import ConfirmDialog from '../components/ConfirmDialog'
import BigWarningCircleIcon from '../src/assets/icons/BigWarningCircleIcon'
import { makeStyles } from '@mui/styles'
import { requests } from '../utils/requests'

const DeleteIcon = (
  <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M8 0.25C3.71875 0.25 0.25 3.71875 0.25 8C0.25 12.2812 3.71875 15.75 8 15.75C12.2812 15.75 15.75 12.2812 15.75 8C15.75 3.71875 12.2812 0.25 8 0.25ZM11.7812 10.0625C11.9375 10.1875 11.9375 10.4375 11.7812 10.5938L10.5625 11.8125C10.4062 11.9688 10.1562 11.9688 10.0312 11.8125L8 9.75L5.9375 11.8125C5.8125 11.9688 5.5625 11.9688 5.40625 11.8125L4.1875 10.5625C4.03125 10.4375 4.03125 10.1875 4.1875 10.0312L6.25 8L4.1875 5.96875C4.03125 5.84375 4.03125 5.59375 4.1875 5.4375L5.4375 4.21875C5.5625 4.0625 5.8125 4.0625 5.96875 4.21875L8 6.25L10.0312 4.21875C10.1562 4.0625 10.4062 4.0625 10.5625 4.21875L11.7812 5.4375C11.9375 5.59375 11.9375 5.84375 11.7812 5.96875L9.75 8L11.7812 10.0625Z'
      fill='#EB5757'
    />
  </svg>
)

const useStyles = makeStyles((theme) => ({
  topBox: {
    width: '100%',
    height: 72,
    borderTop: `2px solid ${theme.palette.gray[200]}`,
    borderBottom: `2px solid ${theme.palette.gray[200]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  box: {
    width: '48.5%',
    display: 'inline-flex',
    alignItems: 'center',
    '& > span': {
      marginRight: 16,
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: theme.palette.blue[600],
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '& > p': {
        color: '#fff',
      },
    },
    '& > p': {
      fontFamily: 'Gilroy-Bold',
    },
  },
  line: {
    marginLeft: 16,
    marginTop: 13,
    height: 'calc(100% - 46px)',
    width: 1,
    borderLeft: `1px dashed ${theme.palette.gray[300]}`,
  },
  lineThird: {
    marginLeft: 59,
    marginTop: 13,
    height: 'calc(100% - 40px)',
    width: 1,
    borderLeft: `1px dashed ${theme.palette.gray[300]}`,
  },
  lineSecond: {
    marginRight: 13,
    marginTop: 22,
    height: 1,
    width: 32,
    borderTop: `1px dashed ${theme.palette.gray[300]}`,
  },

  customTooltip: {
    backgroundColor: '#EB5757',
  },
  customArrow: {
    color: '#EB5757',
  },
  customPopper: {
    maxWidth: '35vw !important',
    width: '35vw !important',
    '& > div': {
      maxWidth: '35vw !important',
      width: '35vw !important',
    },
  },
}))

const InputCustom = ({
  deleteFunction,
  width,
  required,
  topInput,
  noMarginTop,
  defaultValue,
  methods,
  inputTree,
  addValue,
  value,
  error,
  onBlur,
  id,
  focusId,
}) => {
  const [confirmToDelete, setConfirmToDelete] = useState(false)
  const { t } = useTranslation()
  return (
    <>
      {!topInput && <Box className={useStyles().lineSecond} />}
      <InputSimple
        adornment={
          topInput ? (
            inputTree?.name && (
              <Box style={{ cursor: 'pointer', display: 'flex' }} onClick={() => setConfirmToDelete(true)}>
                {DeleteIcon}
              </Box>
            )
          ) : (
            <Box style={{ cursor: 'pointer', display: 'flex' }} onClick={() => setConfirmToDelete(true)}>
              {DeleteIcon}
            </Box>
          )
        }
        adornmentPosition='end'
        width={width || '96%'}
        defaultValue={defaultValue}
        noMarginTop={noMarginTop}
        placeholder={topInput ? t('placeholders.enter_category_name') : t('placeholders.enter_subcategory_name')}
        uncontrolled
        error={error || (topInput && methods?.errors?.uniqeNameCategory)}
        onChange={(e) => addValue(e)}
        required={required}
        value={value}
        onBlur={onBlur}
        autoFocus={id === focusId}
      />
      <ConfirmDialog
        open={!!confirmToDelete}
        setOpen={setConfirmToDelete}
        icon={<BigWarningCircleIcon />}
        title={t('menu.finance.categories.delete_subcattegory.title')}
        desc={t('menu.finance.categories.delete_subcattegory.desc')}
        actions={
          <>
            <Button variant='contained' id='stop' onClick={() => setConfirmToDelete(false)}>
              {t('buttons.cancel')}
            </Button>
            <Button
              onClick={() => {
                setConfirmToDelete(false)
                deleteFunction()
              }}
              size='medium'
              variant='contained'
            >
              {t('buttons.delete')}
            </Button>
          </>
        }
      />
    </>
  )
}

const AddCustomButtom = ({ customStyle, addFunction }) => {
  const { t } = useTranslation()
  return (
    <Box width='100%' height='100%' display='flex' alignItems='center' justifyContent='space-between' flexDirection='row'>
      <Box style={customStyle} className={useStyles().lineSecond} />
      <Button sx={{ width: '96%', color: '#fff', marginTop: 2 }} onClick={() => addFunction()} secondary>
        <PlusIconBlue color='#fff' />
        <Typography sx={{ color: '#fff', ml: 2 }}>{t('buttons.add_subcategory')}</Typography>
      </Button>
    </Box>
  )
}

export default function CreateEditCategories({ open, closeDrawer, isLoading = false, refetch, editId, withoutNavigate, focusId, ...rest }) {
  console.log(editId)

  const { values } = useQueryParams()
  const subRowObj = {
    name: '',
    subRows: [],
  }
  const [inputTree, setInputTree] = useState(subRowObj)

  const [duplicateName, setDuplicateName] = useState(false)
  const { t } = useTranslation()
  const cls = useStyles()
  const navigate = useNavigate()

  useDeepCompareEffect(() => {
    if (inputTree.name === '') {
      setInputTree(subRowObj)
    }
  }, [inputTree])

  const onClose = () => {
    closeDrawer()
    setInputTree(subRowObj)
    setDuplicateName(false)
    if (!withoutNavigate) {
      navigate(`/products/catalog/management?limit=${values?.limit}&page=1`)
    }
  }
  const { mutate: createCategory, isLoading: iscreateCategory } = useMutation(requests.createCategory, {
    onSuccess: () => {
      closeDrawer()
      refetch()
      success('Создать категорию!')
    },
    onError: (err) => {
      error('Ошибка при Создать категорию!')
      console.log('err', err)
    },
  })
  const { mutate: updateCategory, isLoading: isupdateCategory } = useMutation(requests.updateCategory, {
    onSuccess: () => {
      closeDrawer()
      refetch()
      success('Изменить категорию!')
    },
    onError: (err) => {
      error('Ошибка при Изменить категорию!')
      console.log('err', err)
    },
  })

  // const { data: editData, isLoading: editLoading } = useQuery('financeCategoriySingle', () => requests.category.getSingle(editId), {
  //   enabled: !!editId && open,
  // })

  const { data: editData, refetch: editDataFetch, editLoading } = useQuery('editData', () => editId && requests.getCategory(editId))
  // const[ editData, setEditData] = useState([])
  useEffect(() => {
    if (editId) editDataFetch()
  }, [editId])
  function renameSubRows(obj) {
    console.log('jiww')

    if (obj.subRows) {
      obj.sub_category = obj.subRows
      delete obj.subRows

      obj.sub_category.forEach(renameSubRows) // Recurse through sub_category if exists
    }
    return obj
  }
  function renameSubCats(obj) {
    console.log('jiww', obj)

    if (obj.sub_category) {
      obj.subRows = obj.sub_category
      delete obj.sub_category

      obj.subRows.forEach(renameSubCats) // Recurse through sub_category if exists
    }
    return obj
  }
  useEffect(() => {
    if (editData?.data?.data) {
      setInputTree(renameSubCats(editData?.data?.data))
    }
  }, [editData])
  console.log(inputTree)

  const onSubmit = () => {
    const data = { ...renameSubRows(inputTree) }

    if (editId) {
      console.log(data)

      updateCategory({ id: editId, data })
    } else {
      createCategory(data)
    }
  }

  return (
    <>
      <SectionDrawer
        open={open}
        closeDrawer={() => onClose()}
        fullWidth
        anchor='bottom'
        topOffset='64px'
        nextButtonLabel={editId ? t('buttons.apply') : t('create')}
        onNextButtonClick={onSubmit}
        title={editId ? t('menu.finance.categories.edit') : t('menu.finance.categories.new')}
        isLoading={isLoading}
        disabled={!inputTree.name}
        {...rest}
      >
        <LoadingContainer style={{ minHeight: 'calc(80vh - 112px)' }} readyState={editId ? !editLoading : true}>
          <Box>
            <Box className={cls.topBox}>
              <Box className={cls.box}>
                <Typography>{t('alerts.enter_category_data')}</Typography>
              </Box>
            </Box>
            <Box display='inline-flex' justifyContent='space-between' mt={2} width='100%'>
              <Box display='flex' flexDirection='column' justifyContent='flex-end' alignItems='flex-end' width='100%'>
                <Tooltip
                  classes={{
                    tooltip: cls.customTooltip,
                    arrow: cls.customArrow,
                    popper: cls.customPopper,
                  }}
                  title={t('menu.finance.categories.already_exists')}
                  placement='bottom'
                  open={duplicateName}
                  arrow
                >
                  <Box width='100%'>
                    <InputCustom
                      topInput
                      deleteFunction={() => setInputTree(subRowObj)}
                      width='100%'
                      required
                      inputTree={inputTree}
                      noMarginTop
                      uncontrolled
                      addValue={(e) =>
                        setInputTree({
                          ...inputTree,
                          name: e.target.value,
                        })
                      }
                      error={duplicateName}
                      defaultValue={inputTree.name}
                      value={inputTree.name}
                      onBlur={() => setDuplicateName(false)}
                      id={inputTree?.id}
                      focusId={focusId}
                    />
                  </Box>
                </Tooltip>
                <Box width='100%' height='100%' display='flex' justifyContent='space-between' flexDirection='row'>
                  <Box className={cls.line} />
                  <Box width='100%' display='flex' alignItems='flex-end' flexDirection='column'>
                    {inputTree.subRows?.map((FirstLvlEl, FirstLvlInd) => (
                      <>
                        <Box width='100%' justifyContent='center' alignItems='center' display='flex' key={'levelOne' + FirstLvlInd}>
                          <InputCustom
                            deleteFunction={() => {
                              const filtered = { ...inputTree }
                              filtered.subRows.splice(FirstLvlInd, 1)
                              setInputTree(filtered)
                            }}
                            defaultValue={FirstLvlEl?.name}
                            value={FirstLvlEl?.name}
                            addValue={(e) => {
                              const filtered = { ...inputTree }
                              filtered.subRows[FirstLvlInd].name = e.target.value
                              setInputTree(filtered)
                            }}
                            id={FirstLvlEl?.id}
                            focusId={focusId}
                          />
                        </Box>
                        <Box width='100%' height='100%' display='flex' justifyContent='space-between' flexDirection='row'>
                          <Box className={cls.lineThird} />
                          <Box width='100%' display='flex' alignItems='flex-end' flexDirection='column'>
                            {FirstLvlEl?.subRows?.map((SecondLvlEl, SecondLvlInd) => (
                              <>
                                <Box width='100%' justifyContent='center' alignItems='center' display='flex' key={`subRows${FirstLvlInd}${SecondLvlInd}`}>
                                  <InputCustom
                                    deleteFunction={() => {
                                      const filtered = { ...inputTree }
                                      filtered.subRows[FirstLvlInd].subRows.splice(SecondLvlInd, 1)
                                      setInputTree(filtered)
                                    }}
                                    value={SecondLvlEl?.name}
                                    defaultValue={SecondLvlEl?.name}
                                    addValue={(e) => {
                                      const filtered = { ...inputTree }
                                      filtered.subRows[FirstLvlInd].subRows[SecondLvlInd].name = e.target.value
                                      setInputTree(filtered)
                                    }}
                                    id={SecondLvlEl?.id}
                                    focusId={focusId}
                                  />
                                </Box>
                                <Box width='100%' height='100%' display='flex' justifyContent='space-between' flexDirection='row'>
                                  <Box className={cls.lineThird} />
                                  <Box width='100%' display='flex' alignItems='flex-end' flexDirection='column'>
                                    {SecondLvlEl?.subRows?.map((ThirdLvlEl, ThirdLvlInd) => (
                                      <>
                                        <Box
                                          width='100%'
                                          justifyContent='center'
                                          alignItems='center'
                                          display='flex'
                                          key={`subRows${FirstLvlInd}${SecondLvlInd}${ThirdLvlInd}`}
                                        >
                                          <InputCustom
                                            deleteFunction={() => {
                                              const filtered = {
                                                ...inputTree,
                                              }
                                              filtered.subRows[FirstLvlInd].subRows[SecondLvlInd].subRows.splice(ThirdLvlInd, 1)
                                              setInputTree(filtered)
                                            }}
                                            value={ThirdLvlEl?.name}
                                            defaultValue={ThirdLvlEl?.name}
                                            addValue={(e) => {
                                              const filtered = {
                                                ...inputTree,
                                              }
                                              filtered.subRows[FirstLvlInd].subRows[SecondLvlInd].subRows[ThirdLvlInd].name = e.target.value
                                              setInputTree(filtered)
                                            }}
                                            id={ThirdLvlEl?.id}
                                            focusId={focusId}
                                          />
                                        </Box>
                                        <Box width='100%' height='100%' display='flex' justifyContent='space-between' flexDirection='row'>
                                          <Box className={cls.lineThird} />
                                          <Box width='100%' display='flex' alignItems='flex-end' flexDirection='column'>
                                            {ThirdLvlEl?.subRows?.map((FourthLvlEl, FourthLvlInd) => (
                                              <>
                                                <Box
                                                  width='100%'
                                                  justifyContent='center'
                                                  alignItems='center'
                                                  display='flex'
                                                  key={`subRows${FirstLvlInd}${SecondLvlInd}${ThirdLvlInd}${FourthLvlInd}`}
                                                >
                                                  <InputCustom
                                                    id={FourthLvlEl?.id}
                                                    focusId={focusId}
                                                    deleteFunction={() => {
                                                      const filtered = {
                                                        ...inputTree,
                                                      }
                                                      filtered.subRows[FirstLvlInd].subRows[SecondLvlInd].subRows[ThirdLvlInd].subRows.splice(FourthLvlInd, 1)
                                                      setInputTree(filtered)
                                                    }}
                                                    value={FourthLvlEl?.name}
                                                    defaultValue={FourthLvlEl?.name}
                                                    addValue={(e) => {
                                                      const filtered = {
                                                        ...inputTree,
                                                      }
                                                      filtered.subRows[FirstLvlInd].subRows[SecondLvlInd].subRows[ThirdLvlInd].subRows[FourthLvlInd].name =
                                                        e.target.value
                                                      setInputTree(filtered)
                                                    }}
                                                  />
                                                </Box>
                                                <Box width='100%' height='100%' display='flex' justifyContent='space-between' flexDirection='row'>
                                                  <Box className={cls.lineThird} />
                                                  <Box width='100%' display='flex' alignItems='flex-end' flexDirection='column'>
                                                    {FourthLvlEl?.subRows?.map((FifthLvlEl, FifthLvlInd) => (
                                                      <>
                                                        <Box
                                                          width='100%'
                                                          justifyContent='center'
                                                          alignItems='center'
                                                          display='flex'
                                                          key={`subRows${FirstLvlInd}${SecondLvlInd}${ThirdLvlInd}${FourthLvlInd}${FifthLvlInd}`}
                                                        >
                                                          <InputCustom
                                                            id={FifthLvlEl?.id}
                                                            focusId={focusId}
                                                            deleteFunction={() => {
                                                              const filtered = {
                                                                ...inputTree,
                                                              }
                                                              filtered.subRows[FirstLvlInd].subRows[SecondLvlInd].subRows[ThirdLvlInd].subRows[
                                                                FifthLvlInd
                                                              ].subRows.splice(FifthLvlInd, 1)
                                                              setInputTree(filtered)
                                                            }}
                                                            value={FifthLvlEl?.name}
                                                            defaultValue={FifthLvlEl?.name}
                                                            addValue={(e) => {
                                                              const filtered = {
                                                                ...inputTree,
                                                              }
                                                              filtered.subRows[FirstLvlInd].subRows[SecondLvlInd].subRows[ThirdLvlInd].subRows[
                                                                FourthLvlInd
                                                              ].subRows[FifthLvlInd].name = e.target.value
                                                              setInputTree(filtered)
                                                            }}
                                                          />
                                                        </Box>
                                                        <Box width='100%' height='100%' display='flex' justifyContent='space-between' flexDirection='row'>
                                                          <Box className={cls.lineThird} />
                                                          <Box width='100%' display='flex' alignItems='flex-end' flexDirection='column'>
                                                            {FifthLvlEl?.subRows?.map((SixthLvlEl, SixthLvlInd) => (
                                                              <>
                                                                <Box
                                                                  width='100%'
                                                                  justifyContent='center'
                                                                  alignItems='center'
                                                                  display='flex'
                                                                  key={`subRows${FirstLvlInd}${SecondLvlInd}${ThirdLvlInd}${FourthLvlInd}${FifthLvlInd}${SixthLvlInd}`}
                                                                >
                                                                  <InputCustom
                                                                    id={SixthLvlEl?.id}
                                                                    focusId={focusId}
                                                                    deleteFunction={() => {
                                                                      const filtered = {
                                                                        ...inputTree,
                                                                      }
                                                                      filtered.subRows[FirstLvlInd].subRows[SecondLvlInd].subRows[ThirdLvlInd].subRows[
                                                                        FifthLvlInd
                                                                      ].subRows[SixthLvlInd].subRows.splice(SixthLvlInd, 1)
                                                                      setInputTree(filtered)
                                                                    }}
                                                                    value={SixthLvlEl?.name}
                                                                    defaultValue={SixthLvlEl?.name}
                                                                    addValue={(e) => {
                                                                      const filtered = {
                                                                        ...inputTree,
                                                                      }
                                                                      filtered.subRows[FirstLvlInd].subRows[SecondLvlInd].subRows[ThirdLvlInd].subRows[
                                                                        FourthLvlInd
                                                                      ].subRows[FifthLvlInd].subRows[SixthLvlInd].name = e.target.value
                                                                      setInputTree(filtered)
                                                                    }}
                                                                  />
                                                                </Box>
                                                                <Box
                                                                  width='100%'
                                                                  height='100%'
                                                                  display='flex'
                                                                  justifyContent='space-between'
                                                                  flexDirection='row'
                                                                >
                                                                  <Box className={cls.lineThird} />
                                                                  <Box width='100%' display='flex' alignItems='flex-end' flexDirection='column'>
                                                                    {SixthLvlEl?.subRows?.map((SeventhLvlEl, SeventhLvlInd) => (
                                                                      <>
                                                                        <Box
                                                                          width='100%'
                                                                          justifyContent='center'
                                                                          alignItems='center'
                                                                          display='flex'
                                                                          key={`subRows${FirstLvlInd}${SecondLvlInd}${ThirdLvlInd}${FourthLvlInd}${FifthLvlInd}${SixthLvlInd}${SeventhLvlInd}`}
                                                                        >
                                                                          <InputCustom
                                                                            id={SeventhLvlEl?.id}
                                                                            focusId={focusId}
                                                                            deleteFunction={() => {
                                                                              const filtered = {
                                                                                ...inputTree,
                                                                              }
                                                                              filtered.subRows[FirstLvlInd].subRows[SecondLvlInd].subRows[ThirdLvlInd].subRows[
                                                                                FifthLvlInd
                                                                              ].subRows[SixthLvlInd].subRows[SeventhLvlInd].subRows.splice(SeventhLvlInd, 1)
                                                                              setInputTree(filtered)
                                                                            }}
                                                                            value={SeventhLvlEl?.name}
                                                                            defaultValue={SeventhLvlEl?.name}
                                                                            addValue={(e) => {
                                                                              const filtered = {
                                                                                ...inputTree,
                                                                              }
                                                                              filtered.subRows[FirstLvlInd].subRows[SecondLvlInd].subRows[ThirdLvlInd].subRows[
                                                                                FourthLvlInd
                                                                              ].subRows[FifthLvlInd].subRows[SixthLvlInd].subRows[SeventhLvlInd].name =
                                                                                e.target.value
                                                                              setInputTree(filtered)
                                                                            }}
                                                                          />
                                                                        </Box>
                                                                        <Box
                                                                          width='100%'
                                                                          height='100%'
                                                                          display='flex'
                                                                          justifyContent='space-between'
                                                                          flexDirection='row'
                                                                        >
                                                                          <Box className={cls.lineThird} />
                                                                          <Box width='100%' display='flex' alignItems='flex-end' flexDirection='column'>
                                                                            {SeventhLvlEl?.subRows?.map((EigthLvlEl, EigthLvlInd) => (
                                                                              <>
                                                                                {' '}
                                                                                <Box
                                                                                  width='100%'
                                                                                  justifyContent='center'
                                                                                  alignItems='center'
                                                                                  display='flex'
                                                                                  key={`subRows${FirstLvlInd}${SecondLvlInd}${ThirdLvlInd}${FourthLvlInd}${FifthLvlInd}${SixthLvlInd}${SeventhLvlInd}${EigthLvlInd}`}
                                                                                >
                                                                                  <InputCustom
                                                                                    id={EigthLvlEl?.id}
                                                                                    focusId={focusId}
                                                                                    deleteFunction={() => {
                                                                                      const filtered = {
                                                                                        ...inputTree,
                                                                                      }
                                                                                      filtered.subRows[FirstLvlInd].subRows[SecondLvlInd].subRows[
                                                                                        ThirdLvlInd
                                                                                      ].subRows[FifthLvlInd].subRows[SixthLvlInd].subRows[
                                                                                        SeventhLvlInd
                                                                                      ].subRows[EigthLvlInd].subRows.splice(EigthLvlInd, 1)
                                                                                      setInputTree(filtered)
                                                                                    }}
                                                                                    value={EigthLvlEl?.name}
                                                                                    defaultValue={EigthLvlEl?.name}
                                                                                    addValue={(e) => {
                                                                                      const filtered = {
                                                                                        ...inputTree,
                                                                                      }
                                                                                      filtered.subRows[FirstLvlInd].subRows[SecondLvlInd].subRows[
                                                                                        ThirdLvlInd
                                                                                      ].subRows[FourthLvlInd].subRows[FifthLvlInd].subRows[SixthLvlInd].subRows[
                                                                                        SeventhLvlInd
                                                                                      ].subRows[EigthLvlInd].name = e.target.value
                                                                                      setInputTree(filtered)
                                                                                    }}
                                                                                  />
                                                                                </Box>
                                                                                <Box
                                                                                  width='100%'
                                                                                  height='100%'
                                                                                  display='flex'
                                                                                  justifyContent='space-between'
                                                                                  flexDirection='row'
                                                                                >
                                                                                  <Box className={cls.lineThird} />
                                                                                  <Box width='100%' display='flex' alignItems='flex-end' flexDirection='column'>
                                                                                    {EigthLvlEl?.subRows?.map((NinthLvlEl, NinthLvlInd) => (
                                                                                      <Box
                                                                                        width='100%'
                                                                                        justifyContent='center'
                                                                                        alignItems='center'
                                                                                        display='flex'
                                                                                        key={`subRows${FirstLvlInd}${SecondLvlInd}${ThirdLvlInd}${FourthLvlInd}${FifthLvlInd}${SixthLvlInd}${SeventhLvlInd}${EigthLvlInd}${NinthLvlInd}`}
                                                                                      >
                                                                                        <InputCustom
                                                                                          id={NinthLvlEl?.id}
                                                                                          focusId={focusId}
                                                                                          deleteFunction={() => {
                                                                                            const filtered = {
                                                                                              ...inputTree,
                                                                                            }
                                                                                            filtered.subRows[FirstLvlInd].subRows[SecondLvlInd].subRows[
                                                                                              ThirdLvlInd
                                                                                            ].subRows[FifthLvlInd].subRows[SixthLvlInd].subRows[
                                                                                              SeventhLvlInd
                                                                                            ].subRows[EigthLvlInd].subRows[NinthLvlInd].subRows.splice(
                                                                                              NinthLvlInd,
                                                                                              1
                                                                                            )
                                                                                            setInputTree(filtered)
                                                                                          }}
                                                                                          value={NinthLvlEl?.name}
                                                                                          defaultValue={NinthLvlEl?.name}
                                                                                          addValue={(e) => {
                                                                                            const filtered = {
                                                                                              ...inputTree,
                                                                                            }
                                                                                            filtered.subRows[FirstLvlInd].subRows[SecondLvlInd].subRows[
                                                                                              ThirdLvlInd
                                                                                            ].subRows[FourthLvlInd].subRows[FifthLvlInd].subRows[
                                                                                              SixthLvlInd
                                                                                            ].subRows[SeventhLvlInd].subRows[EigthLvlInd].subRows[
                                                                                              NinthLvlInd
                                                                                            ].name = e.target.value
                                                                                            setInputTree(filtered)
                                                                                          }}
                                                                                        />
                                                                                      </Box>
                                                                                    ))}
                                                                                    <AddCustomButtom
                                                                                      addFunction={() => {
                                                                                        const filtered = {
                                                                                          ...inputTree,
                                                                                        }
                                                                                        filtered.subRows[FirstLvlInd].subRows[SecondLvlInd].subRows[
                                                                                          ThirdLvlInd
                                                                                        ].subRows[FourthLvlInd].subRows[FifthLvlInd].subRows[
                                                                                          SixthLvlInd
                                                                                        ].subRows[SeventhLvlInd].subRows[EigthLvlInd].subRows.push(subRowObj)
                                                                                        setInputTree(filtered)
                                                                                      }}
                                                                                    />
                                                                                  </Box>
                                                                                </Box>
                                                                              </>
                                                                            ))}
                                                                            <AddCustomButtom
                                                                              addFunction={() => {
                                                                                const filtered = {
                                                                                  ...inputTree,
                                                                                }
                                                                                filtered.subRows[FirstLvlInd].subRows[SecondLvlInd].subRows[
                                                                                  ThirdLvlInd
                                                                                ].subRows[FourthLvlInd].subRows[FifthLvlInd].subRows[SixthLvlInd].subRows[
                                                                                  SeventhLvlInd
                                                                                ].subRows.push(subRowObj)
                                                                                setInputTree(filtered)
                                                                              }}
                                                                            />
                                                                          </Box>
                                                                        </Box>
                                                                      </>
                                                                    ))}
                                                                    <AddCustomButtom
                                                                      addFunction={() => {
                                                                        const filtered = {
                                                                          ...inputTree,
                                                                        }
                                                                        filtered.subRows[FirstLvlInd].subRows[SecondLvlInd].subRows[ThirdLvlInd].subRows[
                                                                          FourthLvlInd
                                                                        ].subRows[FifthLvlInd].subRows[SixthLvlInd].subRows.push(subRowObj)
                                                                        setInputTree(filtered)
                                                                      }}
                                                                    />
                                                                  </Box>
                                                                </Box>
                                                              </>
                                                            ))}
                                                            <AddCustomButtom
                                                              addFunction={() => {
                                                                const filtered = {
                                                                  ...inputTree,
                                                                }
                                                                filtered.subRows[FirstLvlInd].subRows[SecondLvlInd].subRows[ThirdLvlInd].subRows[
                                                                  FourthLvlInd
                                                                ].subRows[FifthLvlInd].subRows.push(subRowObj)
                                                                setInputTree(filtered)
                                                              }}
                                                            />
                                                          </Box>
                                                        </Box>
                                                      </>
                                                    ))}
                                                    <AddCustomButtom
                                                      addFunction={() => {
                                                        const filtered = {
                                                          ...inputTree,
                                                        }
                                                        filtered.subRows[FirstLvlInd].subRows[SecondLvlInd].subRows[ThirdLvlInd].subRows[
                                                          FourthLvlInd
                                                        ].subRows.push(subRowObj)
                                                        setInputTree(filtered)
                                                      }}
                                                    />
                                                  </Box>
                                                </Box>
                                              </>
                                            ))}
                                            <AddCustomButtom
                                              addFunction={() => {
                                                const filtered = {
                                                  ...inputTree,
                                                }
                                                filtered.subRows[FirstLvlInd].subRows[SecondLvlInd].subRows[ThirdLvlInd].subRows.push(subRowObj)
                                                setInputTree(filtered)
                                              }}
                                            />
                                          </Box>
                                        </Box>
                                      </>
                                    ))}
                                    <AddCustomButtom
                                      addFunction={() => {
                                        const filtered = { ...inputTree }
                                        filtered.subRows[FirstLvlInd].subRows[SecondLvlInd].subRows.push(subRowObj)
                                        setInputTree(filtered)
                                      }}
                                    />
                                  </Box>
                                </Box>
                              </>
                            ))}
                            <AddCustomButtom
                              addFunction={() => {
                                const filtered = { ...inputTree }
                                filtered.subRows[FirstLvlInd].subRows.push(subRowObj)
                                setInputTree(filtered)
                              }}
                            />
                          </Box>
                        </Box>
                      </>
                    ))}
                    {inputTree.name && (
                      <AddCustomButtom
                        noMarginTop
                        customStyle={{ marginTop: 5 }}
                        addFunction={() => {
                          const filtered = { ...inputTree }
                          if (filtered.subRows === null) {
                            filtered.subRows = [subRowObj]
                          } else {
                            filtered.subRows.push(subRowObj)
                          }
                          setInputTree(filtered)
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </LoadingContainer>
      </SectionDrawer>
    </>
  )
}
