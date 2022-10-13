import React, { useEffect, useState } from 'react'
import { CAlert, CButton, CCol, CContainer, CForm, CFormInput, CFormLabel, CFormSelect, CRow } from '@coreui/react'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';
import { useAddNewGameMutation, useGetCoinQuery, useGetDurationQuery, useLazyGetRangeQuery } from 'src/servicesRtkQuery/gamesMenuApi';
import Loader from 'src/components/Loader';
import format from 'date-fns/format';
import addHours from 'date-fns/addHours';
import addMinutes from 'date-fns/addMinutes';
import setMinutes from 'date-fns/setMinutes';
import setSeconds from 'date-fns/setSeconds';


const CreateNewGame = () => {

    const [values, setValues] = useState({
        current_price: '',
        gap: '',
        high_range: '',
        mid_range: '',
        low_range: '',
    });

    //fetching coin in dropdown of coins
    const {
        data: coinsData,
        isSuccess: isSuccessCoinData,
    } = useGetCoinQuery()
    let coins = []
    if (isSuccessCoinData) {
        coins = coinsData.results
    }

    //fetching durations in dropdown of duration
    const {
        data: durationData,
        isSuccess: isSuccessDurationData,
    } = useGetDurationQuery()
    let durations = []
    if (isSuccessDurationData) {
        durations = durationData.results.original.duration
    }

    //getrange lazy query and setting data in values state
    const [trigger, result] = useLazyGetRangeQuery()
    const { isFetching: isFetchingGameRange, isError: isErrorGameRange, error: errorGameRange } = result
    useEffect(() => {
        setValues({
            current_price: '',
            gap: '',
            high_range: '',
            mid_range: '',
            low_range: '',
        })
        if (!(result?.data?.results === undefined)) {
            setValues(result?.data?.results)
        }
    }, [isFetchingGameRange])
    if (isErrorGameRange) {
    }

    //adding new game mutation
    const [addNewGame, { isSuccess: isSuccessGameAdded, isError: isErrorGameAdded, error: errorGameAdded }] = useAddNewGameMutation()


    // seting starttime and endtime .. in start time we are setting minutes and seconds to 00
    const [startTime, setStartTime] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), 0, 0));
    const [endTime, setEndTime] = useState(new Date());

    // coinAndDuration for handleChange
    const [coinAndDuration, setCoinAndDuration] = useState({
        coin_id: 'Select',
        duration: 'Select',
    })
    useEffect(() => {
        setCoinAndDuration({
            coin_id: 'Select',
            duration: 'Select',
        })
        setValues({
            current_price: '',
            gap: '',
            high_range: '',
            mid_range: '',
            low_range: '',
        })
        return () => {
            setValues({
                current_price: '',
                gap: '',
                high_range: '',
                mid_range: '',
                low_range: '',
            })
        }
    }, [])

    // for auto complete of values
    useEffect(() => {
        if (coinAndDuration.coin_id !== 'Select' && coinAndDuration.duration !== 'Select') {
            let endTime
            if (coinAndDuration.duration != 30) {
                endTime = addHours(startTime, +coinAndDuration.duration)
            } else {
                endTime = addMinutes(startTime, +coinAndDuration.duration)
            }
            setEndTime(endTime)
            trigger(coinAndDuration)
        }
    }, [coinAndDuration])

    const handleCoinDurationChange = (e) => {
        const { name, value } = e.target;
        // if user select 'Select' value in  Coin dropdown then set value to 'Select' in Duration dropdown
        if (name === 'coin_id' && value === 'Select') {
            setValues({
                ...values,
                current_price: '',
                gap: '',
                high_range: '',
                mid_range: '',
                low_range: '',
            })
            setCoinAndDuration({
                ...coinAndDuration,
                coin_id: value,
                duration: 'Select'
            })
        } else {
            setCoinAndDuration({
                ...coinAndDuration,
                [name]: value
            })
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues({
            ...values,
            [name]: value
        });
    };
    // 

    // 
    const handleSubmit = async (event) => {
        event.preventDefault();
        const start_time = format(startTime, 'yyyy-MM-dd HH:mm:ss')
        const end_time = format(endTime, 'yyyy-MM-dd HH:mm:ss')
        const data = {
            ...coinAndDuration,
            price_at_time_of_game_start: values.current_price,
            yesterday_gap: values.gap,
            high_range: values.high_range,
            mid_range: values.mid_range_avg,
            low_range: values.low_range,
            start_time: start_time,
            end_time: end_time,
        }
        await addNewGame(data)
        setCoinAndDuration({
            coin_id: 'Select',
            duration: 'Select',
        })
        setValues({
            current_price: '',
            gap: '',
            high_range: '',
            mid_range: '',
            low_range: '',
        })
        setStartTime(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), 0, 0))
        setEndTime(new Date())
    }
    return (
        <>
            <CContainer className="d-flex justify-content-center  ">
                <CForm
                    className=" needs-validation"
                    noValidate
                    onSubmit={handleSubmit}
                >
                    {
                        (isSuccessGameAdded && coinAndDuration.coin_id === 'Select') ?
                            <CAlert color="success ">
                                Game created successfully!
                            </CAlert>
                            :
                            (isErrorGameAdded && coinAndDuration.coin_id === 'Select') ?
                                <CAlert color="danger">
                                    {errorGameAdded.data.message}
                                </CAlert>
                                :
                                (isErrorGameRange && !(coinAndDuration.duration === 'Select')) &&
                                <CAlert color="danger">
                                    {errorGameRange?.data?.message}
                                </CAlert>
                    }
                    {
                        isFetchingGameRange && <Loader />
                    }

                    <CRow >
                        <CCol md={3} className="creat-name">
                            <CFormSelect
                                feedbackInvalid="Please select a coin."
                                label="Coin"
                                required
                                name="coin_id"
                                value={coinAndDuration.coin_id}
                                onChange={handleCoinDurationChange}
                            >
                                <option value="Select">Select</option>
                                {
                                    coins.map((coin) => {
                                        return <option key={coin.id} value={coin.id}>{coin.coin}</option>
                                    })
                                }
                            </CFormSelect>
                        </CCol>
                        <CCol md={3} className="creat-name" >
                            <CFormSelect
                                feedbackInvalid="Please select a duration."
                                label="Duration (hrs)"
                                required
                                name="duration"
                                value={coinAndDuration.duration}
                                onChange={handleCoinDurationChange}
                                disabled={coinAndDuration.coin_id === 'Select'}
                            >
                                <option value="Select">Select</option>
                                {
                                    durations?.map((duration, index) => {
                                        return duration == 30 ?
                                            <option key={index} value={duration}>{duration} mins</option> :
                                            <option key={index} value={duration}>{duration} hrs</option>
                                    })
                                }
                            </CFormSelect>
                        </CCol>

                        <CCol md={3} className="creat-name">
                            <CFormInput
                                value={values.current_price}
                                name="current_price"
                                onChange={handleChange}
                                type="text"
                                id="current_price"
                                label="Current Price"
                                required
                            />
                        </CCol>
                        <CCol md={3} className="creat-name">
                            <CFormInput
                                value={values.gap}
                                name="gap"
                                onChange={handleChange}
                                type="text"
                                label="Gap"
                                required
                            />
                        </CCol>
                    </CRow>
                    <CRow className='mt-3'>
                        <CCol md={4}>
                            <CFormInput
                                value={values.high_range}
                                name="high_range"
                                onChange={handleChange}
                                type="text"
                                id="highrange"
                                label="High Range"
                                required
                            />
                        </CCol>
                        <CCol md={4} >
                            <CFormInput
                                value={values.mid_range}
                                name="mid_range"
                                onChange={handleChange}
                                type="text"
                                id="midrange"
                                label="Mid Range"
                                required
                            />
                        </CCol>
                        <CCol md={3} >
                            <CFormInput
                                value={values.low_range}
                                name="low_range"
                                onChange={handleChange}
                                type="text"
                                id="lowrange"
                                label="Low Range"
                                required
                            />
                        </CCol>
                    </CRow>
                    <CRow className='mt-3'>
                        <CCol md={6} className="creat-date">

                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <CFormLabel>Start date and time</CFormLabel>
                                <DateTimePicker
                                    disabled={coinAndDuration.duration === 'Select'}
                                    views={['day', 'month', 'year', 'hours', 'minutes']}
                                    ampm={false}
                                    renderInput={(props) => <TextField {...props} />}
                                    value={startTime}
                                    inputFormat="yyyy-MM-dd HH:mm"

                                    onChange={(dateAndTime) => {
                                        let zeroMinutes
                                        if (!(isNaN(String(dateAndTime.getMinutes())))) {
                                            if (String(dateAndTime.getMinutes()).length === 2) {
                                                if (String(dateAndTime.getMinutes()).slice(0, 2) > 29) {
                                                    zeroMinutes = setMinutes(dateAndTime.getTime(), 30)
                                                } else {
                                                    zeroMinutes = setMinutes(dateAndTime.getTime(), 0)
                                                }
                                            } else if (String(dateAndTime.getMinutes()).length === 1) {
                                                if (String(dateAndTime.getMinutes()).slice(0) > 2) {
                                                    zeroMinutes = setMinutes(dateAndTime.getTime(), 30)
                                                } else {
                                                    zeroMinutes = setMinutes(dateAndTime.getTime(), 0)
                                                }
                                            }
                                            let newValue = setSeconds(zeroMinutes.getTime(), 0)
                                            setStartTime(newValue);
                                            let endTime
                                            if (coinAndDuration.duration != 30) {
                                                endTime = addHours(newValue.getTime(), +coinAndDuration.duration)
                                            } else {
                                                endTime = addMinutes(newValue.getTime(), +coinAndDuration.duration)
                                            }
                                            setEndTime(endTime)
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        </CCol>
                        <CCol md={6} className="creat-date date">

                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <CFormLabel>End date and time</CFormLabel>
                                <DateTimePicker
                                    views={['day', 'month', 'year', 'hours', 'minutes', 'seconds']}
                                    inputFormat="yyyy-MM-dd HH:mm:ss"
                                    ampm={false}
                                    renderInput={(props) => <TextField {...props} />}
                                    value={endTime}
                                    readOnly
                                />
                            </LocalizationProvider>
                        </CCol>
                    </CRow>
                    <CRow className='mt-3' >
                        <CCol md={3} className="game-bt">
                            <CButton className='btn-create-newgame' type="submit"
                                disabled={coinAndDuration.duration === 'Select'
                                    || values.current_price === ''
                                    || values.gap === ''
                                    || values.high_range === ''
                                    || values.mid_range === ''
                                    || values.low_range === ''
                                    || isFetchingGameRange
                                }
                            >Add new game
                            </CButton>
                        </CCol>
                    </CRow>
                </CForm>
            </CContainer>
        </>
    )
}

export default CreateNewGame

