
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
export const menusApiSlice = createApi({
    reducerPath: 'menusApi',
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({
        // Team members api
        getTeamMembers: builder.query({
            query: (payload) => ({
                url: 'team-member',
                method: 'GET',
                params: payload,
            }),
        }),
        addTeamMember: builder.mutation({
            query: (payload) => ({
                url: 'team-member',
                method: 'POST',
                body: payload,
            }),
        }),
        updateTeamMember: builder.mutation({
            query: ({ id, ...payload }) => ({
                url: `team-member/${id}`,
                method: 'PUT',
                body: payload,
            }),
        }),

        // Users api
        getUsers: builder.query({
            query: (payload) => ({
                url: 'get-user',
                method: 'GET',
                params: payload,
            }),
        }),
        getExportUsers: builder.query({
            query: (payload) => ({
                url: 'get-user-export',
                method: 'GET',
                params: payload,
            }),
        }),
        updateUser: builder.mutation({
            query: (payload) => ({
                url: 'user-status',
                method: 'PUT',
                body: payload,
            }),
        }),
        // notifications api
        getNotificationsCount: builder.query({
            query: () => ({
                url: 'get-notification-count',
                method: 'GET',
            }),
        }),
        getNotifications: builder.query({
            query: (pageNo) => ({
                url: 'get-notification',
                method: 'GET',
                params: pageNo,
            }),
        }),
        getFailureBids: builder.query({
            query: (payload) => ({
                url: 'get-failure-bids-list',
                method: 'GET',
                params: payload,
            })
        }),
        getPendingBonus: builder.query({
            query: (payload) => ({
                url: 'get-pending-bonus',
                method: 'GET',
                params: payload,
            })
        }),
    })
})
export const {
    useLazyGetTeamMembersQuery, useAddTeamMemberMutation, useUpdateTeamMemberMutation,
    useLazyGetUsersQuery, useLazyGetExportUsersQuery, useUpdateUserMutation,
    useLazyGetNotificationsCountQuery, useLazyGetNotificationsQuery, useLazyGetFailureBidsQuery,
    useLazyGetPendingBonusQuery
} = menusApiSlice