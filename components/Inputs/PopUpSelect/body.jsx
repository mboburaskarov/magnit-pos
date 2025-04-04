import { Box, Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { get, size } from 'lodash'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import useDebouncedValue from '../../../src/hooks/useDebouncedValue'
import { useQueryParams } from '../../../src/hooks/useQueryParams'
import { requests } from '../../../utils/requests'
import InputSearch from '../InputSearch'
const useStyles = makeStyles((theme) => ({
  wrapper: {
    backgroundColor: '#fff',
    width: '400px',
    padding: '16px 24px',
    marginTop: '10px',
    borderRadius: '12px',
  },
}))
function SelectBody({ setselectedStore, selectedStore: defaultData, close }) {
  const [selectedStore, setSelectedStore] = useState([...defaultData])
  const [searchTerm, setSearchTerm, debouncedSearchTerm] = useDebouncedValue('', 200)
  const methods = useForm()
  const classes = useStyles()
  const { values } = useQueryParams()

  const onSubmit = (data) => {
    setselectedStore(selectedStore)
    close()
  }
  const { t } = useTranslation()
  const onError = (err) => {
    console.error(err)
  }
  const {
    data: allStoresList,
    isLoading: isGetallStoresList,
    refetch,
  } = useQuery(['allStoresList', searchTerm], () => requests.getAllStores({ search: searchTerm }))

  return (
    <Box className={classes.wrapper}>
      <InputSearch
        fullWidth
        id='prodducrs-searchp'
        value={searchTerm}
        setSearchTerm={setSearchTerm}
        onChange={({ target }) => setSearchTerm(target.value)}
        name='searchs'
        placeholder={'Филиалы'}
      />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit, onError)}>
          <Box
            sx={{
              display: 'flex',
              height: '30px',
              margin: '10px 0px',
              alignItems: 'center',
              // justifyContent: 'center',
            }}
          >
            <input
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedStore((prev) => [...get(allStoresList, 'data.data.ids', [])])
                } else {
                  setSelectedStore([])
                }
              }}
              name='checkbox_zero'
              className='customCheckbox'
              type='checkbox'
              checked={size(selectedStore) == size(get(allStoresList, 'data.data.ids', []))}
            />
            <Typography mt={'2px'} ml={'10px'}>
              Все филиалы
            </Typography>
          </Box>
          {get(allStoresList, 'data.data.data', []).map((el, ind) => (
            <Box
              sx={{
                display: 'flex',
                height: '30px',
                margin: '10px 0px',
                alignItems: 'center',
                // justifyContent: 'center',
              }}
            >
              <input
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedStore((prev) => [...prev, el.id])
                  } else {
                    setSelectedStore((prev) => prev.filter((a) => a != el.id))
                  }
                }}
                checked={selectedStore.includes(el.id) || selectedStore[0] == 'all'}
                name='checkbox_zero'
                className='customCheckbox'
                type='checkbox'
              />
              <Typography mt={'2px'} ml={'10px'}>
                {el.name}
              </Typography>
            </Box>
          ))}
          <Button
            type='submit'
            disabled={selectedStore.length <= 0 || (selectedStore.length >= 10 && selectedStore.length != size(get(allStoresList, 'data.data.ids', [])))}
            sx={{ height: '40px' }}
            fullWidth
          >
            Применить
          </Button>
        </form>
      </FormProvider>
    </Box>
  )
}

export default SelectBody
