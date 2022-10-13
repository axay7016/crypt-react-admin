import React, { useState } from 'react'
import { CButton, CCol, CContainer, CForm, CFormCheck, CFormInput, CFormLabel, CFormSelect, CRow } from '@coreui/react'
import { useAddCouponMutation, useGetCoinQuery } from 'src/servicesRtkQuery/gamesMenuApi'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { TextField } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import format from 'date-fns/format'

const AddCoupon = () => {

    //fetching coin in dropdown of coins
    const {
        data: coinsData,
        isSuccess: isSuccessCoinData,
    } = useGetCoinQuery()
    let coins = []
    if (isSuccessCoinData) {
        coins = coinsData.results
    }
    //--------------------------------------------------------------------

    const [addCoupon, { isSuccess, isError, error }] = useAddCouponMutation()


    const statuses = [
        { "id": 1, "status": "Active" },
        { "id": 0, "status": "Inactive" }
    ]

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [values, setValues] = useState({
        name: '',
        code: '',
        coin_id: 'Select',
        amount: '',
        total_usage: '',
        partner_url: '',
        status: '',
        depositeBonus: false
    });

    const handleChange = (event) => {
        const { name, value, } = event.target;
        if (name === 'depositeBonus') {
            setValues({
                ...values,
                depositeBonus: event.target.checked
            });
            return
        }
        setValues({
            ...values,
            [name]: value
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const depositeBonus = values.depositeBonus ? '1' : '0'
        const start_time = format(startDate, 'yyyy-MM-dd HH:mm:ss')
        const end_time = format(endDate, 'yyyy-MM-dd HH:mm:ss')
        const data = {
            ...values,
            is_first_time_deposit_bonus: depositeBonus,
            start_date: start_time,
            end_date: end_time
        }
        addCoupon(data)
    }
    return (
        <>
            <CContainer className="d-flex justify-content-center  ">
                <CForm
                    className="needs-validation"
                    noValidate
                    onSubmit={handleSubmit}
                >
                    <CRow >
                        <CCol md={3}>
                            <CFormInput
                                type="text"
                                id="name"
                                label="Name *"
                                value={values.name}
                                name="name"
                                onChange={handleChange}
                            />
                        </CCol>
                        <CCol md={3}>
                            <CFormInput
                                type="text"
                                id="code"
                                label="Code *"
                                value={values.code}
                                name="code"
                                onChange={handleChange}
                            />
                        </CCol>

                        <CCol md={3} >
                            <CFormSelect
                                id="coin"
                                label="Coin *"
                                value={values.coin_id}
                                name="coin_id"
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                {
                                    coins.map((coin) => {
                                        return <option key={coin.id} value={coin.id}>{coin.coin}</option>
                                    })
                                }
                            </CFormSelect>
                        </CCol>
                        <CCol md={3}>
                            <CFormInput
                                type="number"
                                id="amount"
                                label="Amount *"
                                value={values.amount}
                                name="amount"
                                onChange={handleChange}
                            />
                        </CCol>
                    </CRow>
                    <CRow className='mt-3'>
                        <CCol md={4}>
                            <CFormInput
                                type="number"
                                id="usage"
                                label="Usage *"
                                value={values.total_usage}
                                name="total_usage"
                                onChange={handleChange}
                            />
                        </CCol>


                        <CCol md={4}>
                            <CFormInput
                                type="text"
                                id="partner_url"
                                label="Partner Url"
                                value={values.partner_url}
                                name="partner_url"
                                onChange={handleChange}
                            />
                        </CCol>
                        <CCol md={4} >
                            <CFormSelect
                                id="status"
                                label="Status *"
                                value={values.status}
                                name="status"
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                {
                                    statuses.map((status) => {
                                        return <option key={status.id} value={status.id}>{status.status}</option>
                                    })
                                }
                            </CFormSelect>
                        </CCol>
                        <CCol md={12} className="de-b">
                            <CFormLabel>Deposit Bonus</CFormLabel>
                            <CFormCheck
                                label={'Deposit Bonus'}
                                name="depositeBonus" value={values.depositeBonus}
                                onChange={handleChange}
                                checked={values.depositeBonus}
                            />
                        </CCol>

                    </CRow>

                    <CRow className='mt-3 date-coupan'>
                        <CCol md={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <CFormLabel>Start date and time</CFormLabel>
                                <DateTimePicker
                                    views={['day', 'month', 'year', 'hours', 'minutes', 'seconds']}
                                    ampm={false}
                                    renderInput={(props) => <TextField {...props} />}
                                    value={startDate}
                                    inputFormat="yyyy-MM-dd HH:mm:ss"
                                    onChange={(newValue) => {
                                        setStartDate(newValue);

                                    }}
                                />
                            </LocalizationProvider>
                        </CCol>
                        <CCol md={6}>

                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <CFormLabel>End date and time</CFormLabel>
                                <DateTimePicker
                                    views={['day', 'month', 'year', 'hours', 'minutes', 'seconds']}
                                    inputFormat="yyyy-MM-dd HH:mm:ss"
                                    ampm={false}
                                    renderInput={(props) => <TextField {...props} />}
                                    value={endDate}
                                    onChange={(newValue) => {
                                        setEndDate(newValue);

                                    }}
                                    minDateTime={startDate}
                                />
                            </LocalizationProvider>
                        </CCol>
                    </CRow>


                    <CRow className='mt-3 di-bt'>
                        <CCol xs={12}>
                            <CButton color="primary" type="submit"
                                disabled={
                                    !values.name ||
                                    !values.code ||
                                    !values.coin_id ||
                                    !values.total_usage ||
                                    !values.status ||
                                    endDate <= startDate
                                }
                            >
                                Add Coupon
                            </CButton>
                        </CCol>
                    </CRow>
                </CForm>
            </CContainer>
        </>
    )
}

export default AddCoupon
