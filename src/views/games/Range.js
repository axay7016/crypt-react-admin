import { CAlert, CButton, CCol, CFormInput, CFormText, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/Loader'
import ColumnHeader from 'src/components/table/ColumnHeader'
import { useAddRangeFormulaDataMutation, useGetRangeFormulaQuery } from 'src/servicesRtkQuery/gamesMenuApi'

const Range = () => {
    const headerCells = ['Coin', '30 minutes', '2 hours', '6 hours', '24 hours']
    const {
        data,
        isLoading,
        isSuccess,
    } = useGetRangeFormulaQuery()

    let rangeData = []
    if (isSuccess) {
        rangeData = data.results.data
    }
    useEffect(() => {
        setValues(rangeData)
    }, [isSuccess])

    const [values, setValues] = useState([])
    const [error, setError] = useState("")
    const onChangeValue = (e, coinId) => {
        setError('')
        let { name, value } = e.target
        if (value.length < 2) {
            value = 0.01
        } else if (value.length > 4) {
            value = 0.99
        } else if ((value < 0.1)) {
            setError('Value should be between 0.01 to 0.99')
        }
        const data = values.map(function (item) {
            return item.coin_id === coinId ? { ...item, [name]: value } : item;
        });
        setValues(data)
    }
    const [addRangeFormulaData, { isLoading: isLoadingAddPartner }] = useAddRangeFormulaDataMutation();
    const handleSubmit = () => {
        addRangeFormulaData(values)
    }
    return (
        <>
            {

            }

            <CTable className='text-center' >
                <CTableHead className='tb'>

                    <CTableRow>
                        <ColumnHeader headerCells={headerCells} />

                    </CTableRow>
                </CTableHead>

                <CTableBody >

                    {
                        isLoading ? <Loader /> :
                            values?.map((range) => {
                                return (
                                    <CTableRow key={range.coin_id}  >
                                        <CTableDataCell >{range.name}</CTableDataCell>
                                        <CTableDataCell > <CFormInput name={'min_30'} value={range.min_30} onChange={(e) => onChangeValue(e, range.coin_id)} /></CTableDataCell>

                                        <CTableDataCell > <CFormInput name={'hours_2'} value={range.hours_2} onChange={(e) => onChangeValue(e, range.coin_id)} /></CTableDataCell>
                                        <CTableDataCell > <CFormInput name={'hours_6'} value={range.hours_6} onChange={(e) => onChangeValue(e, range.coin_id)} /></CTableDataCell>
                                        <CTableDataCell > <CFormInput name={'hours_24'} value={range.hours_24} onChange={(e) => onChangeValue(e, range.coin_id)} /></CTableDataCell>
                                    </CTableRow>
                                )
                            })
                    }
                </CTableBody>
            </CTable >
            <CRow className='mt-3 mb-2' >
                <CCol className="game-bt">
                    {
                        error && <><CAlert color='danger'>{error}</CAlert></>
                    }
                    <CButton disabled={error != ""} type="submit" onClick={handleSubmit}>
                        {isLoadingAddPartner ? <Loader /> : 'Update data'}
                    </CButton>
                </CCol>
            </CRow>
        </>
    )
}

export default Range