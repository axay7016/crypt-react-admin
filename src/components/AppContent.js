import React, { Suspense, useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'
import { getRoleLocalSorage, getTokenFromLocalSorage } from 'src/utils/localStorage'

const AppContent = () => {

  const user_type = JSON.parse(localStorage.getItem("user_type"));
  const token = getTokenFromLocalSorage()

  const [authRoutes, setAuthRoute] = useState(routes)

  useEffect(() => {

    let role = getRoleLocalSorage()

    if (role) {
      if (role.includes('coin_listing')) {
        role = role.concat(',edit-coin')
      }
      if (role.includes('current_prices')) {
        role = role.concat(',coin-logs')
      }
      if (role.includes('game_listing')) {
        role = role.concat(',declare-game')
        role = role.concat(',games-listing')
      }
      let roles = role.split(",")
      roles = roles.map((r) => {
        return r.replaceAll("_", "-")
      })

      const array = []
      routes.forEach((route) => {
        roles.forEach((role) => {
          if (route.path.includes(role)) {
            array.push(route)
          }
        })
      })
      setAuthRoute(array)
    }

  }, [])

  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {
            token &&
            <>
              {authRoutes?.map((route, idx) => {
                return (
                  route.element && (
                    <Route
                      key={idx}
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      element={
                        <route.element />
                      }
                    />
                  )
                )
              })}

              {
                (user_type && user_type == 'team_member') ?
                  <Route path="/" element={<Navigate to="/nothing" replace />} /> :
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
              }
            </>
          }
          {
            !token &&
            <>
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          }

        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
