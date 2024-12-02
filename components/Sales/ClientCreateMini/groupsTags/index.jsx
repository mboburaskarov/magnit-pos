import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useQuery } from 'react-query'
import requests from './item'
import QuestionIcon from '../../../../src/assets/icons/QrScanIcon'
import StyledTooltip from '../../../StyledTooltip'
import Item from './item'
import { useTranslation } from 'react-i18next'

export default function SocialNetworks() {
  const { t } = useTranslation()
  const [groupsList, setGroupsList] = useState([])
  const [tagsList, setTagsList] = useState([])

  const { data: groups } = useQuery('customer-group', () =>
    requests.customer.getAllGroups({
      type: 'group',
      limit: 1000,
    })
  )

  const { data: tags } = useQuery('customer-tag', () =>
    requests.customer.getAllGroups({
      type: 'tag',
      limit: 1000,
    })
  )

  return (
    <Box mt={4}>
      <Box mb={2}>
        <Typography>
          <Box display='flex' alignItems='center'>
            {t('menu.clients.groups')}
            <Box ml={1}>
              <StyledTooltip title='some tips' placement='right'>
                <QuestionIcon />
              </StyledTooltip>
            </Box>
          </Box>
        </Typography>
      </Box>
      <Box display='flex' flexWrap='wrap'>
        {groups?.data?.groups?.map((group) => (
          <Item key={group.id} id={group.id} data={group} list={groupsList} setList={setGroupsList} type='groups' />
        ))}
      </Box>
      <Box my={2}>
        <Typography>
          <Box display='flex' alignItems='center'>
            {t('menu.clients.tags')}
            <Box ml={1}>
              <StyledTooltip title='some tips' placement='right'>
                <QuestionIcon />
              </StyledTooltip>
            </Box>
          </Box>
        </Typography>
      </Box>
      <Box display='flex' flexWrap='wrap'>
        {tags?.data?.groups?.map((tag) => (
          <Item id={tag.id} key={tag.id} data={tag} list={tagsList} setList={setTagsList} type='tags' />
        ))}
      </Box>
    </Box>
  )
}
