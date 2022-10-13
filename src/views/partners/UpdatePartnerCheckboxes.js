import { CCol, CFormCheck, CRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'

const UpdatePartnerCheckboxes = ({ rakeRef, stakeRef, userDetailRef, user_idRef, nameRef, emailRef, mobileRef,
    statusRef, joining_dateRef }) => {
    const [showUserDetailColumn, setShowUserDetailColumn] = useState(true)
    return (
        <div className='mt-4'>

            <span className='mt-2'>Partner should access :</span>
            {

            }

            <CRow className='mt-3'>
                <CCol >
                    <CFormCheck ref={rakeRef} defaultChecked={rakeRef?.current != '0'} label=" Show total rake" />
                </CCol>
                <CCol >
                    <CFormCheck ref={stakeRef} defaultChecked={stakeRef?.current != '0'} label=" Show total stake" />
                </CCol>
                <CCol >
                    <CFormCheck ref={userDetailRef} defaultChecked={userDetailRef?.current != '0'} label=" Show user details" />
                </CCol>
            </CRow>
            <CRow className='mt-3'>
                <CCol >
                    <CFormCheck value={showUserDetailColumn} defaultChecked={true} label="Show user column details" onChange={(e) => {
                        setShowUserDetailColumn(e.target.checked)
                    }} />
                </CCol>
            </CRow>

            {

                <div className={` ${showUserDetailColumn ? "" : "d-none"}`}>
                    <CRow className='mt-3'>
                        <CCol >
                            <CFormCheck ref={user_idRef} defaultChecked={user_idRef?.current != '0'} label="User Id" />
                        </CCol>
                        <CCol >
                            <CFormCheck ref={nameRef} defaultChecked={nameRef?.current != '0'} label="Name" />
                        </CCol>
                        <CCol >
                            <CFormCheck ref={emailRef} defaultChecked={emailRef?.current != '0'} label="Email" />
                        </CCol>
                        <CCol >
                            <CFormCheck ref={mobileRef} defaultChecked={mobileRef?.current != '0'} label="Mobile" />
                        </CCol>
                        <CCol >
                            <CFormCheck ref={statusRef} defaultChecked={statusRef?.current != '0'} label="Status" />
                        </CCol>
                        <CCol >
                            <CFormCheck ref={joining_dateRef} defaultChecked={joining_dateRef?.current != '0'} label="Joining Date" />
                        </CCol>
                    </CRow>
                </div>
            }

        </div>
    )
}

export default UpdatePartnerCheckboxes