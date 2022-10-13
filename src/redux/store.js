import { configureStore } from '@reduxjs/toolkit'
import globalReducer from './globalSlice'
import webSocketGameReducer from './webSocketGameSlice'
import { adminApiSlice } from '../servicesRtkQuery/adminApi'
import { gamesMenuApiSlice } from '../servicesRtkQuery/gamesMenuApi'
import { menusApiSlice } from '../servicesRtkQuery/menusApi'
import { authApiSlice } from '../servicesRtkQuery/authApi'

export const store = configureStore({
    reducer: {
        globalReducer,
        webSocketGameReducer,
        [adminApiSlice.reducerPath]: adminApiSlice.reducer,
        [gamesMenuApiSlice.reducerPath]: gamesMenuApiSlice.reducer,
        [menusApiSlice.reducerPath]: menusApiSlice.reducer,
        [authApiSlice.reducerPath]: authApiSlice.reducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(
            adminApiSlice.middleware,
            gamesMenuApiSlice.middleware,
            menusApiSlice.middleware,
            authApiSlice.middleware,
        ),
})
