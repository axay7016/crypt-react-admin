import { CAlert, CButton, CCol, CContainer, CForm, CFormInput, CFormLabel, CFormSelect, CRow } from '@coreui/react';
import React, { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from 'src/components/Loader';
import { useUpdatePartnerMutation } from 'src/servicesRtkQuery/gamesMenuApi';
import { checkPassword } from 'src/utils/Validation';
import UpdatePartnerCheckboxes from './UpdatePartnerCheckboxes';

const UpdatePartner = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [values, setValues] = useState({ ...state, password: '' });

    //checkboxes ref
    const rakeRef = useRef(values?.is_show_total_rake)
    const stakeRef = useRef(values?.is_show_total_stake)
    const userDetailRef = useRef(values?.is_show_user_details)

    const user_idRef = useRef(values?.user_column_details?.user_id)
    const nameRef = useRef(values?.user_column_details?.name)
    const emailRef = useRef(values?.user_column_details?.email)
    const mobileRef = useRef(values?.user_column_details?.mobile)
    const statusRef = useRef(values?.user_column_details?.status)
    const joining_dateRef = useRef(values?.user_column_details?.joining_date)



    const [updatePartner, { isLoading, isSuccess, isError, error }] = useUpdatePartnerMutation()

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues({
            ...values,
            [name]: value
        });
    }
    const [passwordError, setPasswordError] = useState("")

    const handleSubmit = (event) => {
        event.preventDefault()
        const result = checkPassword(values.password)
        if (result.isPasswordValid === false) {
            setPasswordError('New Password must contains ' + result.errorMessage)
            return
        } else {
            let coin_comission = [];
            values?.rake_comissions.map((item) => {
                return coin_comission.push({
                    coin_id: item.coin_id,
                    comission: values[item.coin] ? values[item.coin] : 0,
                });
            });
            const data = {
                ...values,
                name: values.name,
                email: values.email,
                password: values.password,
                mobile_number: values.mobile_number,
                status: values.status,
                country: values.country,
                rake_comissions: coin_comission,
                is_show_total_rake: rakeRef.current.checked ? '1' : '0',
                is_show_total_stake: stakeRef.current.checked ? '1' : '0',
                is_show_user_details: userDetailRef.current.checked ? '1' : '0',
                user_column_details: {
                    user_id: user_idRef.current.checked ? '1' : '0',
                    name: nameRef.current.checked ? '1' : '0',
                    email: emailRef.current.checked ? '1' : '0',
                    mobile: mobileRef.current.checked ? '1' : '0',
                    status: statusRef.current.checked ? '1' : '0',
                    joining_date: joining_dateRef.current.checked ? '1' : '0',
                },
                user_id: values.id,
            }
            updatePartner(data)
        }

    }
    if (isSuccess) {
        setTimeout(() => {
            navigate('/partners/partners-listing')
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
                                {'Partner updated successfully. redirecting to listing page'}
                            </CAlert>
                    }
                    <CRow >
                        <CCol md={4}>
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
                        <CCol md={4}>
                            <CFormInput
                                type="text"
                                id="mobile"
                                label="Mobile *"
                                value={values.mobile_number}
                                name="mobile_number"
                                onChange={handleChange}
                                invalid={values.mobile_number.length !== 10}
                            />
                        </CCol>
                        <CCol md={4}>
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
                        <CCol md={4}>
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
                        <CCol md={4}>
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
                    <CRow className="mt-3">
                        <CFormLabel htmlFor="exampleFormControlInput1">
                            Comissions :
                        </CFormLabel>
                    </CRow>
                    <CRow className="">
                        {values?.rake_comissions?.map((coin, key) => {
                            return (
                                <CCol md={2} key={key}>
                                    <CFormInput
                                        type="number"
                                        id="comission"
                                        label={coin.name}
                                        min="0"
                                        defaultValue={coin.comission}
                                        name={coin.coin}
                                        onChange={handleChange}
                                    />
                                </CCol>
                            );
                        })}
                    </CRow>

                    <UpdatePartnerCheckboxes
                        rakeRef={rakeRef}
                        stakeRef={stakeRef}
                        userDetailRef={userDetailRef}
                        user_idRef={user_idRef}
                        nameRef={nameRef}
                        emailRef={emailRef}
                        mobileRef={mobileRef}
                        statusRef={statusRef}
                        joining_dateRef={joining_dateRef}
                    />
                    <CRow className='mt-3'>
                        <CCol xs={12}>
                            {
                                isLoading ? <Loader /> :
                                    <CButton color="primary" type="submit"
                                        disabled={
                                            !values.name ||
                                            !values.email ||

                                            !values.status ||
                                            !values.country ||
                                            !(values.mobile_number.length === 10)
                                        }
                                    >
                                        Update Partner
                                    </CButton>
                            }
                        </CCol>
                    </CRow>
                </CForm>
            </CContainer>
        </>
    )
}

export default UpdatePartner