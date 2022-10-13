import React, { useState } from 'react'
import { CAlert, CButton, CCol, CContainer, CForm, CFormCheck, CFormInput, CFormLabel, CFormSelect, CRow } from '@coreui/react'
import { useUpdateTeamMemberMutation } from 'src/servicesRtkQuery/menusApi'
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from 'src/components/Loader';
import { checkPassword } from 'src/utils/Validation';
const UpdateTeamMember = () => {
    const navigate = useNavigate();
    const [updateTeamMember, { isLoading, isSuccess, isError, error }] = useUpdateTeamMemberMutation()
    const { state } = useLocation();
    const roles = state.role.split('"').join('')

    const [values, setValues] = useState({ ...state, role: roles.slice(1, -1).split(","), password: '' });

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'role') {
            const roleValue = value
            const index = values.role.indexOf(roleValue);

            if ((index === -1) && event.target.checked) {

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
    const [roleError, setRoleError] = useState("")

    const handleSubmit = (event) => {
        event.preventDefault()
        const result = checkPassword(values.password)
        if (result.isPasswordValid === false) {
            setPasswordError('New Password must contains ' + result.errorMessage)
            return
        } else if (!(values?.role.length > 0)) {
            setRoleError('Please select at least one role')
        }
        else {
            const data = {
                id: values.id,
                name: values.name,
                email: values.email,
                password: values.password,
                mobile_number: values.mobile_number,
                status: values.status,
                country: values.country,
                role: values.role
            }
            updateTeamMember(data)
        }
    }
    if (isSuccess) {
        setTimeout(() => {
            navigate('/teams/team-members')
        }, 3000)
    }
    return (
        <>
            <CContainer className="d-flex justify-content-center  ">
                <CForm
                    className="needs-validation"
                    noValidate
                    onSubmit={handleSubmit}
                >
                    {
                        isError ?
                            <CAlert color="danger">
                                {error.data.message.email}
                            </CAlert> :
                            isSuccess &&
                            <CAlert color="success">
                                {'Member updated successfully. Redirecting to listing page'}
                            </CAlert>
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
                                value={values.mobile_number}
                                name="mobile_number"
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
                                <option value="India">India</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className='mt-3'>
                        <CCol md={6}>
                            <CFormInput
                                type="text"
                                id="password"
                                label="Password"
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
                                {
                                    values.status == 0 ?
                                        <>
                                            <option value={0} name='status'>{'Inactive'} </option>
                                            <option value={1} name='status'>{'Active'} </option>
                                            <option value={2} name='status'>{'Blocked'} </option>
                                        </>
                                        : values.status == 1 ?
                                            <>
                                                <option value={1} name='status'>{'Active'} </option>
                                                <option value={0} name='status'>{'Inactive'} </option>
                                                <option value={2} name='status'>{'Blocked'} </option>
                                            </>
                                            :
                                            <>
                                                <option value={2} name='status'>{'Blocked'} </option>
                                                <option value={1} name='status'>{'Active'} </option>
                                                <option value={0} name='status'>{'Inactive'} </option>
                                            </>
                                }
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className='mt-3'>
                        <CCol md={12}>
                            <CFormLabel>Role *</CFormLabel>

                            {roleError && <CAlert color="danger">{roleError}</CAlert>}
                            {
                                <>
                                    <CFormCheck id='flexCheckChecked' defaultChecked={roles.includes('user')} label={'User'} name="role" value={'user'} onChange={handleChange} />
                                    <CFormCheck id='flexCheckChecked' defaultChecked={roles.includes('account_statement')} label={'Account Statement'} name="role" value={'account_statement'} onChange={handleChange} />
                                    <CFormCheck id='flexCheckChecked' defaultChecked={roles.includes('bids')} label={'Bids'} name="role" value={'bids'} onChange={handleChange} />
                                    <CFormCheck id='flexCheckChecked' defaultChecked={roles.includes('coin_listing')} label={'Coin Listing'} name="role" value={'coin_listing'} onChange={handleChange} />
                                    <CFormCheck id='flexCheckChecked' defaultChecked={roles.includes('game_listing')} label={'Game Listing'} name="role" value={'game_listing'} onChange={handleChange} />
                                    <CFormCheck id='flexCheckChecked' defaultChecked={roles.includes('create_new_game')} label={'Create New game'} name="role" value={'create_new_game'} onChange={handleChange} />
                                    <CFormCheck id='flexCheckChecked' defaultChecked={roles.includes('current_prices')} label={'Current prices'} name="role" value={'current_prices'} onChange={handleChange} />
                                    <CFormCheck id='flexCheckChecked' defaultChecked={roles.includes('scheduled_game')} label={'Scheduled game'} name="role" value={'scheduled_game'} onChange={handleChange} />
                                </>
                            }
                        </CCol>
                    </CRow>
                    <CRow className='mt-3  di-bt'>
                        <CCol xs={12}>
                            {
                                isLoading ? <Loader /> :
                                    <CButton color="primary" type="submit"
                                        disabled={
                                            !values?.name ||
                                            !values?.email ||
                                            !values?.status ||
                                            !values?.country ||
                                            !((values?.mobile_number?.length == 0) || (values?.mobile_number?.length == 10) || (values?.mobile_number?.length == undefined))
                                        }
                                    >
                                        Update team member
                                    </CButton>
                            }
                        </CCol>
                    </CRow>
                </CForm>
            </CContainer>
        </>
    )
}

export default UpdateTeamMember
