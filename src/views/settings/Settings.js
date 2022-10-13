import React, { useState } from 'react'
import { CButton, CCol, CContainer, CForm, CFormInput, CRow, } from '@coreui/react'
import { TextField } from '@mui/material'
const Settings = () => {

    const [validated, setValidated] = useState(false)
    const handleSubmit = (event) => {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        }
        setValidated(true)
    }
    return (
        <>
            <CContainer className="d-flex justify-content-center   ">
                <CForm
                    className="needs-validation"
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                >
                    <div className=''>
                        <strong>Rake</strong>

                        <CRow >
                            <CCol md={4}>
                                <TextField id="standard-basic" label="Silver rake %" variant="standard"
                                />
                            </CCol>

                            <CCol md={5}>
                                <TextField id="standard-basic" label="Duration Days" variant="standard" />
                            </CCol>

                        </CRow>
                        <CRow className='mt-3 '>
                            <CCol md={4}>
                                <TextField id="standard-basic" label="Gdld rake %" variant="standard" />
                            </CCol>

                            <CCol md={5}>
                                <TextField id="standard-basic" label="Duration Days" variant="standard" />
                            </CCol>

                        </CRow>
                        <CRow className='mt-3'>
                            <CCol md={4}>
                                <TextField id="standard-basic" label="Diamond rake %" variant="standard" />
                            </CCol>

                            <CCol md={5}>
                                <TextField id="standard-basic" label="Duration Days" variant="standard" />
                            </CCol>

                        </CRow>
                    </div>
                    <CRow className='mt-5'>
                        <CCol md={4}>
                            <CFormInput
                                type="text"
                                id="minDeposite"
                                label="Minimum deposit"
                                required
                            />
                        </CCol>
                        <CCol md={4}>
                            <CFormInput
                                type="text"
                                id="maxDeposite"
                                label="Maximum deposit"
                                required
                            />
                        </CCol>
                    </CRow>
                    <CRow className='mt-3'>
                        <CCol md={4}>
                            <CFormInput
                                type="text"
                                id="minWithdraw"
                                label="Minimum withdraw"
                                required
                            />
                        </CCol>
                        <CCol md={4}>
                            <CFormInput
                                type="text"
                                id="maxWithdraw"
                                label="Maximum withdraw"
                                required
                            />
                        </CCol>
                    </CRow>
                    <CCol xs={12} className="mt-3">
                        <CButton color="primary" type="submit">
                            Save setting
                        </CButton>
                    </CCol>
                </CForm>
            </CContainer>
        </>
    )
}

export default Settings
