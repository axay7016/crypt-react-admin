import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setApiError } from 'src/redux/globalSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders: (headers) => {
        const adminToken = JSON.parse(localStorage.getItem('tokenAdmin'));
        headers.set('Authorization', `Bearer ${adminToken}`)
        return headers
    },
});
const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        alert('You are unathorized. please login again')
        localStorage.clear();
        window.location.reload();
        return
    }

    if (result.error && result.error.originalStatus > 499) {
        api.dispatch(setApiError({
            isShowError: Math.random(),
            statusCode: result?.error?.originalStatus
        }))
        return
    }
    return result;
};
export const authApiSlice = createApi({
    reducerPath: 'authApi',
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({
        login: builder.query({
            query: (payload) => ({
                url: 'login',
                method: 'POST',
                body: payload
            }),
        }),
        logout: builder.query({
            query: () => ({
                url: 'logout',
                method: 'POST',
            }),
        }),
    })
})
export const {
    useLazyLoginQuery, useLazyLogoutQuery,
} = authApiSlice