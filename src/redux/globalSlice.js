
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    errorMessages: {},
    successMessages: {},
    sidebarShow: true,
    apiError: {
        isShowError: "",
        statusCode: ""
    }
}
const reducers = {
    setErrorMessage: (state, action) => {
        state.errorMessages = action.payload
    },
    setSuccessMessage: (state, action) => {
        state.successMessages = action.payload
    },
    setSidebarShow: (state, action) => {
        state.sidebarShow = action.payload
    },
    setApiError: (state, action) => {
        state.apiError = action.payload
    },
}
export const globalSlice = createSlice({
    name: 'globalSlice',
    initialState,
    reducers: reducers,
})

export const { setErrorMessage, setSuccessMessage, setSidebarShow, setApiError } = globalSlice.actions
export default globalSlice.reducer