import { CAlert, CButton, CCol, CContainer, CFormInput, CRow } from '@coreui/react'
import React, { useEffect, useRef, useState } from 'react'
import Loader from 'src/components/Loader'

import { useChangePasswordMutation } from 'src/servicesRtkQuery/gamesMenuApi'
import { checkPassword } from 'src/utils/Validation'

const ChangePassword = () => {
    const oldPasswordRef = useRef("")
    const newPasswordRef = useRef("")
    const confirmNewPasswordRef = useRef("")
    const [passwordError, setPasswordError] = useState("")
    const [passwordSuccess, setPasswordSuccess] = useState("")


    const [changePassword, { isSuccess, isLoading, isError, error }] = useChangePasswordMutation()
    useEffect(() => {
        if (isSuccess) {
            setPasswordSuccess("Password changed successfully")
        }
        if (isError) {
            setPasswordError(error.data.message.password)

        }
    }, [isSuccess, isError])


    const handleFocus = () => {
        setPasswordError("")
        setPasswordSuccess("")
    }
    const handleSubmit = () => {
        const result = checkPassword(newPasswordRef.current.value)
        if (result.isPasswordValid === false) {
            setPasswordError('New Password must contains ' + result.errorMessage)
        } else if (!oldPasswordRef.current.value || !newPasswordRef.current.value || !confirmNewPasswordRef.current.value) {
            setPasswordError("All three fields are required")
        } else if (newPasswordRef.current.value !== confirmNewPasswordRef.current.value) {
            setPasswordError("New password and confirm new password must be same")
        } else {
            changePassword({
                "old_password": oldPasswordRef.current.value,
                "password": newPasswordRef.current.value,
                "password_confirmation": confirmNewPasswordRef.current.value
            })
        }
    }
    return (
        <>
            {
                passwordError ? <CAlert className='w-50 m-auto' color="danger">{passwordError}</CAlert> :
                    passwordSuccess && <CAlert className='w-50 m-auto' color="success">{passwordSuccess}</CAlert>

            }
            <CContainer className=" d-flex justify-content-center gap-3">
                <div>
                    <CRow className='mt-3'>
                        <CCol >
                            <CFormInput
                                type="password"
                                label="Old Password"
                                ref={oldPasswordRef}
                                onFocus={handleFocus}
                            />
                        </CCol>
                    </CRow>
                    <CRow className='mt-3'>
                        <CCol >
                            <CFormInput
                                type="password"
                                label="New Password"
                                ref={newPasswordRef}
                                onFocus={handleFocus}
                            />
                        </CCol>
                    </CRow>
                    <CRow className='mt-3'>
                        <CCol >
                            <CFormInput
                                type="password"
                                label="Confirm New Password"
                                ref={confirmNewPasswordRef}
                                onFocus={handleFocus}
                            />
                        </CCol>
                    </CRow>
                    <CRow className='mt-3'>
                        <CCol >
                            {
                                isLoading ? <Loader /> :
                                    <CButton color="primary" onClick={handleSubmit}>Submit</CButton>
                            }
                        </CCol>
                    </CRow>
                </div>
            </CContainer>
        </>

    )
}

export default ChangePassword