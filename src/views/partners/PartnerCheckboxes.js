import { CCol, CFormCheck, CRow } from '@coreui/react'
import React, { useState } from 'react'

const PartnerCheckboxes = ({ rakeRef, stakeRef, userDetailRef, user_idRef, nameRef, emailRef, mobileRef,
    statusRef, joining_dateRef }) => {

    const [showUserDetailColumn, setShowUserDetailColumn] = useState(true)

    return (
        <div className='mt-4'>

            <span className='mt-2'>Partner should access :</span>


            <CRow className='mt-3'>
                <CCol >
                    <CFormCheck ref={rakeRef} label=" Show total rake" />
                </CCol>
                <CCol >
                    <CFormCheck ref={stakeRef} label=" Show total stake" />
                </CCol>
                <CCol >
                    <CFormCheck ref={userDetailRef} label=" Show user details" />
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
                            <CFormCheck ref={user_idRef} label="User Id" />
                        </CCol>
                        <CCol >
                            <CFormCheck ref={nameRef} label="Name" />
                        </CCol>
                        <CCol >
                            <CFormCheck ref={emailRef} label="Email" />
                        </CCol>
                        <CCol >
                            <CFormCheck ref={mobileRef} label="Mobile" />
                        </CCol>
                        <CCol >
                            <CFormCheck ref={statusRef} label="Status" />
                        </CCol>
                        <CCol >
                            <CFormCheck ref={joining_dateRef} label="Joining Date" />
                        </CCol>
                    </CRow>
                </div>
            }

        </div>
    )
}

export default PartnerCheckboxes