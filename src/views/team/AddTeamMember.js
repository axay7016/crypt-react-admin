import React, { useEffect, useState } from 'react'
import { CAlert, CButton, CCol, CContainer, CForm, CFormCheck, CFormInput, CFormLabel, CFormSelect, CRow } from '@coreui/react'
import { useAddTeamMemberMutation } from 'src/servicesRtkQuery/menusApi'
import Loader from 'src/components/Loader'
import { useNavigate } from 'react-router-dom'
import { checkPassword } from 'src/utils/Validation'
const AddTeamMember = () => {
    const navigate = useNavigate()
    const countries = ['India']
    const roles = ['User', 'Account Statement', 'Bids', 'Coin Listing',
        'Game Listing', 'Create New game', 'Current prices', 'Scheduled game']
    const [values, setValues] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        status: '',
        country: '',
        role: [],
    });

    const [addTeamMember, { isSuccess, isError, isLoading, error }] = useAddTeamMemberMutation()

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'role') {
            const roleValue =
                value === 'User' ? 'user' :
                    value === 'Account Statement' ? 'account_statement' :
                        value === 'Bids' ? 'bids' :
                            value === 'Coin Listing' ? 'coin_listing' :
                                value === 'Game Listing' ? 'game_listing' :
                                    value === 'Create New game' ? 'create_new_game' :
                                        value === 'Current prices' ? 'current_prices' :
                                            value === 'Scheduled game' ? 'scheduled_game' : ''

            const index = values.role.indexOf(roleValue);

            if (index === -1) {

                setValues({
                    ...values,
                    role: [...values.role, roleValue]
                })
            } else {

                values.role.splice(index, 1)
                setValues({
                    ...values,
                    role: [...values.role]
                })
            }
            return
        }
        setValues({
            ...values,
            [name]: value
        });
    }

    const [passwordError, setPasswordError] = useState("")
    const handleSubmit = async (event) => {
        event.preventDefault()
        const result = checkPassword(values.password)
        if (result.isPasswordValid === false) {
            setPasswordError('New Password must contains ' + result.errorMessage)
            return
        } else {
            await addTeamMember(values)
        }
    }
    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                navigate('/teams/team-members')
            }, 3000)
        }
    }, [isSuccess])

    return (
        <>
            <CContainer className="d-flex justify-content-center  ">
                <CForm
                    className="needs-validation"
                    noValidate
                    onSubmit={handleSubmit}
                >
                    {
                        isSuccess ? <CAlert color="success">New member added successfully. Redirecting to listing page</CAlert> :
                            isError && <CAlert color="danger">{error.data.message.email}</CAlert>
                    }
                    <CRow >
                        <CCol md={6}>
                            <CFormInput
                                type="text"
                                id="name"
                                label="Name *"
                                value={values.name}
                                name="name"
                                onChange={handleChange}
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput
                                type="email"
                                id="email"
                                label="Email address *"
                                value={values.email}
                                name="email"
                                onChange={handleChange}
                            />
                        </CCol>
                    </CRow>
                    <CRow className='mt-3'>
                        <CCol md={6}>
                            <CFormInput
                                type="text"
                                id="mobile"
                                label="Mobile"
                                value={values.mobile}
                                name="mobile"
                                onChange={handleChange}
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormSelect
                                id="country"
                                label="Country *"
                                value={values.country}
                                name="country"
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                {
                                    countries.map((country, index) => {
                                        return <option key={index} value={country}>{country}</option>
                                    })
                                }
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className='mt-3'>
                        <CCol md={6}>
                            <CFormInput
                                type="text"
                                id="password"
                                label="Password *"
                                value={values.password}
                                name="password"
                                onChange={handleChange}
                            />
                            {passwordError && <CAlert color="danger">{passwordError}</CAlert>}
                        </CCol>
                        <CCol md={6}>
                            <CFormSelect
                                id="status"
                                label="Status *"
                                value={values.status}
                                name="status"
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option value={1} name='status'>{'Active'} </option>
                                <option value={0} name='status'>{'Inactive'} </option>
                                <option value={2} name='status'>{'Blocked'} </option>

                            </CFormSelect>
                        </CCol>
                    </CRow>

                    <CRow className='mt-3 d-flex'>
                        <CCol md={4} >
                            <CFormLabel>Role *</CFormLabel>

                            {
                                roles.map((role, index) => {

                                    return (
                                        <CFormCheck
                                            label={role} name="role" key={index} value={role} onChange={handleChange} />
                                    )
                                })
                            }
                        </CCol>
                    </CRow>
                    <CRow className='mt-3 .game-bt'>
                        <CCol xs={12}>
                            {
                                isLoading ? <Loader /> :
                                    <CButton color="primary" type="submit"
                                        disabled={
                                            !values.name ||
                                            !values.email ||
                                            !values.password ||
                                            !values.status ||
                                            !values.country ||
                                            !values.role.length > 0 ||
                                            !((values.mobile.length == 0) || (values.mobile.length == 10))
                                        }
                                    >
                                        Add team member
                                    </CButton>
                            }

                        </CCol>
                    </CRow>
                </CForm>
            </CContainer>
        </>
    )
}

export default AddTeamMember
