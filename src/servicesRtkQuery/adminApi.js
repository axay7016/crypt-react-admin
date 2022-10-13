// this file includes the admin api functions but not included games menu api functions

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setApiError } from 'src/redux/globalSlice';



const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL_NOADMIN,
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
export const adminApiSlice = createApi({
    reducerPath: 'adminApi',
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({
        getAccountStatement: builder.query({
            query: (payload) => ({
                url: 'get-account-statement',
                method: 'GET',
                params: payload,
            })
        }),
        getAccountStatementExport: builder.query({
            query: (payload) => ({
                url: 'get-account-statement-export',
                method: 'GET',
                params: payload,
            })
        }),
        getBids: builder.query({
            query: (payload) => ({
                url: 'get-bid',
                method: 'GET',
                params: payload,
            })
        }),
        getExportBids: builder.query({
            query: (payload) => ({
                url: 'get-bid-export',
                method: 'GET',
                params: payload,
            })
        }),

        getDashaboardData: builder.query({
            query: () => ({
                url: 'get-dashboard-balances-data',
                method: 'GET',
            }),
        }),

    })
})
export const { useLazyGetAccountStatementQuery, useLazyGetAccountStatementExportQuery,
    useLazyGetBidsQuery, useLazyGetExportBidsQuery, useGetDashaboardDataQuery } = adminApiSlice