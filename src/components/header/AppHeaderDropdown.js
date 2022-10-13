import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilLockLocked,
  cilAccountLogout,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar from './../../assets/images/avatars/avatar.jpg'
import { removeTokenInLocalSorage } from 'src/utils/localStorage'
import { Link, useNavigate } from 'react-router-dom'
import { useLazyLogoutQuery } from 'src/servicesRtkQuery/authApi'

const AppHeaderDropdown = () => {
  let navigate = useNavigate();
  const [trigger, result] = useLazyLogoutQuery()
  const { isSuccess, isFetching, isError } = result
  const handleSignout = () => {
    trigger()
  }
  if (isSuccess) {
    removeTokenInLocalSorage()
    navigate(`/login`);
  }
  if (isError) {
    removeTokenInLocalSorage()
    navigate(`/login`);
  }
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={avatar} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" role={'button'} placement="bottom-end">
        <CDropdownItem >
          <Link to={'/changePassword'} style={{ textDecoration: 'none', color: '#4f5d73' }}>
            <CIcon icon={cilLockLocked} className="me-2" />
            Change Password
          </Link>
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem role={'button'} disabled={isFetching} onClick={handleSignout}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Sign out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
