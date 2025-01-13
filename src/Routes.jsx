// eslint-disable-next-line no-unused-vars
import React, { Suspense, useEffect, useState } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import LoadingContainer from '../components/LoadingContainer'
import routes from './routes/index'
import MainLayout from './layouts/MainLayout'
import NotFoundPage from './pages/404'
import Redirect from './pages/redirect'
import { useSelector } from 'react-redux'

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDc0NmMzMDM1ZTQ1ODFkNzQ0MGNiOTIiLCJmdWxsTmFtZSI6Ik11aGFtbWFkcW9kaXIgUGFycGl5ZXYiLCJwaG9uZSI6OTk4OTM0ODIwMDExLCJkYklkIjoiNjQ2ZmM0NTM5NDA5YWY0ZGZhYjk3YWJkIiwidHlwZSI6IkJPU1MiLCJzdGF0dXMiOiJBQ1RJVkUiLCJpc0RlbGV0ZWQiOmZhbHNlLCJjcmVhdGVkQXQiOiIyMDIzLTA1LTI5VDA5OjExOjEyLjk4OVoiLCJ1cGRhdGVkQXQiOiIyMDIzLTA2LTE5VDExOjM4OjU1LjAzNloiLCJfX3YiOjAsIlR5cGUiOiJWRU5ET1IiLCJzZXNzaW9uSWQiOiI2NTAwM2UwNWEzMzVkYTE3Y2MyMDRmOTAiLCJpYXQiOjE2OTU3OTM2NDR9.D5ZSoryUnTczQh5HUY3eBHWO6Ws_hRN2Xw0AJTvRvpk'

export const filterNavData = (routes, urls, user_data) => {
  if (user_data?.type === 'SUPER_ADMIN') {
    return routes
  }

  return routes.reduce((acc, route) => {
    const parentMatches = urls.includes(route.href)
    const matchingChildren =
      route.children?.filter((child) => {
        const childHref = child.href.replace(route.href, '')
        return urls.includes(childHref) || urls.some((url) => url.startsWith(childHref + '/'))
      }) || []

    if (parentMatches || matchingChildren.length > 0) {
      acc.push({
        ...route,
        children: matchingChildren.length > 0 ? matchingChildren : parentMatches ? route.children : [],
      })
    }
    return acc
  }, [])
}
export default function Routes() {
  const user_data = useSelector((state) => state.user)

  const { role_actions } = user_data
  const [routeString, setRouteString] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem('noorToken')) {
      localStorage.setItem(
        'noorToken',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDc0NmMzMDM1ZTQ1ODFkNzQ0MGNiOTIiLCJmdWxsTmFtZSI6Ik11aGFtbWFkcW9kaXIgUGFycGl5ZXYiLCJwaG9uZSI6OTk4OTM0ODIwMDExLCJkYklkIjoiNjQ2ZmM0NTM5NDA5YWY0ZGZhYjk3YWJkIiwidHlwZSI6IkJPU1MiLCJzdGF0dXMiOiJBQ1RJVkUiLCJpc0RlbGV0ZWQiOmZhbHNlLCJjcmVhdGVkQXQiOiIyMDIzLTA1LTI5VDA5OjExOjEyLjk4OVoiLCJ1cGRhdGVkQXQiOiIyMDIzLTA2LTE5VDExOjM4OjU1LjAzNloiLCJfX3YiOjAsIlR5cGUiOiJWRU5ET1IiLCJzZXNzaW9uSWQiOiI2NTAwM2UwNWEzMzVkYTE3Y2MyMDRmOTAiLCJpYXQiOjE2OTU3OTM2NDR9.D5ZSoryUnTczQh5HUY3eBHWO6Ws_hRN2Xw0AJTvRvpk'
      )
    }
    if (role_actions) {
      setRouteString(
        role_actions
          .filter((item) => item.route)
          .map((item) => {
            if (item.parentId) {
              const findParent = role_actions?.find((roleAction) => roleAction._id === item.parentId)
              if (findParent) {
                return `${findParent.route}${item.route}`
              }
              return item.route
            }
            return item.route
          })
      )
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [user_data, role_actions])

  if (isLoading) {
    return <LoadingContainer />
  }
  const filterRoutes = (routes, urls, isChild = null) => {
    // console.log(urls)

    if (user_data?.type === 'SUPER_ADMIN') {
      return routes
    }

    return routes.reduce((acc, route) => {
      let parentMatches = urls.includes(`/${route.path}`)

      if (route.path === 'login' || route.path === 'dashboard') {
        parentMatches = true
      }

      if (isChild !== null && isChild.length) {
        if (route.path === '' || route.path === 'all') {
          parentMatches = true
        }
        if (urls.includes(`${isChild}/${route.path}`)) {
          parentMatches = true
        }
      }

      let childrenMatches = []
      if (route.children && parentMatches) {
        childrenMatches = filterRoutes(route.children, urls, `/${route.path}`)
      }

      if (parentMatches) {
        if (childrenMatches.length) {
          acc.push({
            ...route,
            children: childrenMatches,
          })
        } else {
          acc.push({
            ...route,
          })
        }
      }

      return acc
    }, [])
  }

  const filteredRoutes = filterRoutes(routes, routeString)

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const formattedRoutes = useRoutes([
    ...filteredRoutes,
    {
      path: '',
      element: <MainLayout />,
      children: [
        {
          path: '',
          element: <Navigate to={'/dashboard'} />,
        },
        {
          path: '404',
          element: <NotFoundPage full />,
        },
        {
          path: 'redirect',
          element: <Redirect />,
        },
        {
          path: '*',
          element: <Navigate to='redirect' />,
        },
      ],
    },
  ])
  return <Suspense fallback={<LoadingContainer />}>{formattedRoutes}</Suspense>
}
