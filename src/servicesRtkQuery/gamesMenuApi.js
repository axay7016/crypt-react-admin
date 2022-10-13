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
export const gamesMenuApiSlice = createApi({
    reducerPath: ' gamesMenuApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Coins', 'Games', 'Range', 'ScheduleGame', 'Coupon', 'RangeFormula'],
    endpoints: builder => ({

        // Coins Api
        getCoin: builder.query({
            query: () => ({
                url: 'coin',
                method: 'GET',
            }),
            providesTags: ['Coins'],
        }),
        updateCoin: builder.mutation({
            query: (payload) => ({
                url: 'update-coin-stakes',
                method: 'PUT',
                body: payload,
            }),
            invalidatesTags: ['Coins'],
        }),
        //------------------------------------------------------

        //games api
        getGames: builder.query({
            query: (payload) => ({
                url: `game`,
                method: 'GET',
                params: payload
            }),
            providesTags: ['Games'],
        }),
        updateGameStatus: builder.mutation({
            query: (payload) => ({
                url: `manual-game`,
                method: 'PUT',
                body: payload,

            }),
            invalidatesTags: ['Games'],
        }),

        getDuration: builder.query({
            query: () => ({
                url: 'duration',
                method: 'GET',
            }),
            invalidatesTags: ['Range']

        }),
        getRange: builder.query({
            query: (payload) => ({
                url: 'get-range',
                method: 'GET',
                params: payload
            }),
            providesTags: ['Range'],
        }),
        addNewGame: builder.mutation({
            query: (payload) => ({
                url: 'game',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Games', 'ScheduleGame'],
        }),

        // declare game api
        getDeclareGame: builder.query({
            query: ({ gameId, current_price }) => ({
                url: `get-game-logic/${gameId}`,
                method: 'GET',
                params: { current_price: current_price }
            }),

        }),
        setDeclareGame: builder.query({
            query: (gameId) => ({
                url: `game-declare/${gameId}`,
                method: 'GET',
            }),
        }),
        //------------------------------------------------------

        // current prices api
        getCurrentPrices: builder.query({
            query: () => ({
                url: 'get-current-price',
                method: 'GET',
            })
        }),

        getPriceLogsOfCoin: builder.query({
            query: (payload) => ({
                url: 'get-price-log-history',
                method: 'GET',
                params: payload
            }),
        }),
        getCurrentPriceHighLow: builder.query({
            query: (durationAndId) => ({
                url: `current-price-low-high-by-duration`,
                method: 'GET',
                params: durationAndId
            })
        }),

        //------------------------------------------------------

        // schedule game api
        getScheduleGames: builder.query({
            query: () => ({
                url: 'get-schedule',
                method: 'GET',
            }),
            providesTags: ['ScheduleGame'],
        }),
        deleteScheduleGame: builder.mutation({
            query: (id) => ({
                url: `delete-schedule-game/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['ScheduleGame'],
        }),

        //--------------------------------------------------------------
        // Coupon game api
        getCoupon: builder.query({
            query: () => ({
                url: 'coupon',
                method: 'GET',
            }),
            providesTags: ['Coupon'],
        }),
        addCoupon: builder.mutation({
            query: (payload) => ({
                url: 'coupon',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Coupon'],
        }),
        updateCoupon: builder.mutation({
            query: (payload) => ({
                url: 'coupon',
                method: 'PUT',
                body: payload,
            }),
            invalidatesTags: ['Coupon'],
        }),

        // withdraw queries
        getWithdraw: builder.query({
            query: (payload) => ({
                url: 'get-withdraw-request',
                method: 'GET',
                params: payload
            }),
        }),
        approvedRejectWithdraw: builder.mutation({
            query: ({ id, status }) => ({
                url: `update-withdraw-request/${id}`,
                method: 'PUT',
                body: { status: status },

            }),
        }),
        //subcriber
        getSubcribers: builder.query({
            query: (payload) => ({
                url: 'subscribe',
                method: 'GET',
                params: payload
            }),
        }),
        //change password
        changePassword: builder.mutation({
            query: (payload) => ({
                url: 'change-password',
                method: 'POST',
                body: payload
            }),
        }),
        // partner module
        getPartners: builder.query({
            query: (payload) => ({
                url: 'partner',
                method: 'GET',
                params: payload
            }),
        }),
        addPartner: builder.mutation({
            query: (payload) => ({
                url: 'partner',
                method: 'POST',
                body: payload
            }),
        }),
        updatePartner: builder.mutation({
            query: (payload) => ({
                url: `partner/${payload.user_id}`,
                method: 'PUT',
                body: payload
            }),
        }),
        //range module
        getRangeFormula: builder.query({
            query: () => ({
                url: 'get-range-formula',
                method: 'GET',
            }),
            providesTags: ['RangeFormula'],
        }),
        addRangeFormulaData: builder.mutation({
            query: (payload) => ({
                url: 'create-range-formula',
                method: 'POST',
                body: payload
            }),
            invalidatesTags: ['RangeFormula'],
        }),
    })
})
export const {
    useGetCoinQuery, useUpdateCoinMutation,
    useLazyGetGamesQuery, useUpdateGameStatusMutation, useGetDurationQuery, useLazyGetRangeQuery, useAddNewGameMutation,
    useLazyGetDeclareGameQuery, useLazySetDeclareGameQuery,
    useGetCurrentPricesQuery, useLazyGetPriceLogsOfCoinQuery, useLazyGetCurrentPriceHighLowQuery,
    useGetScheduleGamesQuery, useDeleteScheduleGameMutation,
    useGetCouponQuery, useAddCouponMutation, useUpdateCouponMutation,
    useLazyGetWithdrawQuery, useApprovedRejectWithdrawMutation,
    useLazyGetSubcribersQuery,
    useChangePasswordMutation,
    useLazyGetPartnersQuery, useAddPartnerMutation, useUpdatePartnerMutation,
    useGetRangeFormulaQuery, useAddRangeFormulaDataMutation
} = gamesMenuApiSlice