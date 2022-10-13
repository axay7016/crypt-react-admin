import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilMenu } from '@coreui/icons'
import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { useLazyGetNotificationsCountQuery } from 'src/servicesRtkQuery/menusApi'
import { Link } from 'react-router-dom'
import { notificationWebSocket } from "src/utils/webSocket";
import { setSidebarShow } from 'src/redux/globalSlice'
import { getTokenFromLocalSorage } from 'src/utils/localStorage'
const AppHeader = () => {
  const dispatch = useDispatch()
  const notification_count = useSelector((state) => state.webSocketGameReducer.notificationSocket)
  const sidebarShow = useSelector((state) => state.globalReducer.sidebarShow)
  const user_type = JSON.parse(localStorage.getItem("user_type"));

  const [trigger, result] = useLazyGetNotificationsCountQuery()
  const { isSuccess } = result
  const token = getTokenFromLocalSorage()

  useEffect(() => {
    if (token) {
      trigger()
    }
    notificationWebSocket()
  }, []);
  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className=""
          onClick={() => dispatch(setSidebarShow(!sidebarShow))}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        <CHeaderNav className="d-none d-md-flex me-auto">
        </CHeaderNav>
        <CHeaderNav>
          {
            (!(user_type && user_type == 'team_member')) &&
            <Link to={'/notification'}>
              <CIcon icon={cilBell} size="xl" />&nbsp;&nbsp;
              <span className="  translate-middle badge rounded-pill bg-primary">
                {notification_count.data > 0 ? notification_count.data : isSuccess && result?.data?.results?.notification_count}
              </span>
            </Link>
          }


        </CHeaderNav>
        <CHeaderNav className="">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
