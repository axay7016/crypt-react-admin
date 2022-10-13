import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav } from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'


import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigation from '../_nav'
import { useNavigate } from 'react-router-dom'

const AppSidebar = () => {
  const sidebarShow = useSelector((state) => state.globalReducer.sidebarShow)
  const { isShowError, statusCode } = useSelector(
    (state) => state.globalReducer.apiError
  );
  const navigate = useNavigate();
  useEffect(() => {
    if ((statusCode > 499) || statusCode == 404) {
      navigate("/page500");
    }
  }, [isShowError]);

  return (

    <CSidebar
      position="fixed"
      visible={sidebarShow}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <img src="/logo.png" className=" w-25 h-50" alt="imageOfLogo" />
      </CSidebarBrand>

      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>

    </CSidebar>
  )
}

export default React.memo(AppSidebar)
