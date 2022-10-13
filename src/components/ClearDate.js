import { CFormLabel } from '@coreui/react'
import React from 'react'

const ClearDate = ({ onClick }) => {
    return (
        <CFormLabel type="text" onClick={onClick} >clear date</CFormLabel>
    )
}

export default ClearDate