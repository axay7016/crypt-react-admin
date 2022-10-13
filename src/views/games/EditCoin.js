import { CAlert, CButton, CCol, CContainer, CForm, CFormCheck, CFormInput, CFormLabel, CFormSelect, CRow } from '@coreui/react';
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useUpdateCoinMutation } from 'src/servicesRtkQuery/gamesMenuApi';

const EditCoin = () => {
    const { state } = useLocation();
    const navigate = useNavigate();


    const [values, setValues] = useState(state)

    const [updateCoin, { isSuccess, isError }] = useUpdateCoinMutation()

    const handleChange = (event) => {
        const { name, value } = event.target
        if (name === 'sign_up_bonus_allow') {
            setValues({
                ...values,
                sign_up_bonus_allow: event.target.checked
            });
            return
        }
        setValues({ ...values, [name]: value })
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        let status;
        if (values.status === 'Active' || values.status == 1) {
            status = 1
        } else {
            status = 0
        }
        const data = {
            coin_id: values.id,
            status: status,
            min_stake: values.min_stake.replace(/,/g, ''),
            max_stake: values.max_stake.replace(/,/g, ''),
            min_range: values.min_range.replace(/,/g, ''),
            max_range: values.max_range.replace(/,/g, ''),
            min_deposit: values.min_deposit,
            min_withdraw: values.min_withdraw,
            sign_up_bonus_amount: values.sign_up_bonus_amount,
            sign_up_bonus_allow: values.sign_up_bonus_allow,
            charge_on_withdraw: values.charge_on_withdraw
        }
        updateCoin(data)
    }
    if (isSuccess) {
        setTimeout(() => {
            navigate('/games/coin-listing');
        }, 3000)
    }
    return (
        <>
            {
                isSuccess ?
                    <CAlert color='success'>
                        Coin is updated successfully.Navigating to coin listing page.
                    </CAlert> :
                    isError &&
                    <CAlert color='danger'>
                        Something went wrong.
                    </CAlert>
            }
            <CContainer className="d-flex justify-content-center   ">
                {
                    values &&
                    <CForm
                        className=" needs-validation"
                        noValidate
                        onSubmit={handleSubmit}
                    >
                        <CRow >

                            <CCol md={3}>


                                <CFormInput
                                    value={values.id}
                                    type="text"
                                    label="Coin id"
                                    disabled
                                />
                            </CCol>
                            <CCol md={2}>
                                <CFormInput
                                    value={values.coin}
                                    type="text"
                                    label="Coin Name"
                                    disabled
                                />
                            </CCol>
                            <CCol md={2}>

                                <CFormInput
                                    value={values.min_stake}
                                    name="min_stake"
                                    onChange={handleChange}
                                    type="text"
                                    label="Min stake in USD"
                                />
                            </CCol>
                            <CCol md={2}>
                                <CFormInput
                                    value={values.max_stake}
                                    name="max_stake"
                                    onChange={handleChange}
                                    type="text"
                                    label="Max stake in USD"
                                />
                            </CCol>
                        </CRow>
                        <CRow className='mt-3'>
                            <CCol md={2}>
                                <CFormInput
                                    value={values.min_range}
                                    name="min_range"
                                    onChange={handleChange}
                                    type="text"
                                    label="Minimum Range"
                                />
                            </CCol>
                            <CCol md={2}>
                                <CFormInput
                                    value={values.max_range}
                                    name="max_range"
                                    onChange={handleChange}
                                    type="text"
                                    label="Maximum Range"
                                />
                            </CCol>
                            <CCol md={2} >
                                <CFormSelect
                                    label="Status"
                                    name="status"
                                    value={values.status}
                                    onChange={handleChange}
                                >
                                    {
                                        <>
                                            <option name='status'>{values.status === 1 ? 'Active' : 'Inactive'}</option>
                                            <option name='status'>{values.status === 1 ? 'Inactive' : 'Active'}</option>
                                        </>
                                    }
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className='mt-3'>
                            <CCol md={2}>
                                <CFormInput
                                    value={values.min_deposit}
                                    name="min_deposit"
                                    onChange={handleChange}
                                    type="text"
                                    label="Minimum Deposit"
                                />
                            </CCol>
                            <CCol md={2}>
                                <CFormInput
                                    value={values.min_withdraw}
                                    name="min_withdraw"
                                    onChange={handleChange}
                                    type="text"
                                    label="Minimum Withdraw"
                                />
                            </CCol>
                        </CRow>
                        <CRow className='mt-3'>
                            <CCol md={2}>
                                <CFormInput
                                    value={values.sign_up_bonus_amount}
                                    name="sign_up_bonus_amount"
                                    onChange={handleChange}
                                    type="text"
                                    label="Signup Bonus Amount"
                                />
                            </CCol>
                            <CCol md={2}>
                                <CFormLabel>Signup Bonus Allow</CFormLabel>
                                <CFormCheck
                                    id='flexCheckChecked' label={'Signup Bonus Allow'}
                                    name="sign_up_bonus_allow" value={values.sign_up_bonus_allow}
                                    onChange={handleChange}
                                    checked={values.sign_up_bonus_allow}
                                />
                            </CCol>
                            <CCol md={2}>
                                <CFormInput
                                    value={values.charge_on_withdraw}
                                    name="charge_on_withdraw"
                                    onChange={handleChange}
                                    type="text"
                                    label="Charge on withdraw"
                                />
                            </CCol>


                        </CRow>
                        <CRow className='mt-3' >
                            <CCol md={3}>
                                <CButton color="primary" type="submit"
                                    disabled={!values.min_stake || !values.max_stake ||
                                        !values.min_range || !values.max_range
                                    }
                                >
                                    Update coin
                                </CButton>
                            </CCol>
                        </CRow>
                    </CForm>
                }
            </CContainer >
        </>
    )
}

export default EditCoin