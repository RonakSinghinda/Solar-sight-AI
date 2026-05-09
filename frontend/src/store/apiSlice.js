import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Inspection', 'Fault', 'Report'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: 'auth/login/',
        method: 'POST',
        body: credentials,
      }),
    }),
    getDashboardSummary: builder.query({
      query: () => 'dashboard/summary/',
      providesTags: ['Inspection', 'Fault'],
    }),
    getInspections: builder.query({
      query: () => 'inspections/',
      providesTags: ['Inspection'],
    }),
    uploadInspection: builder.mutation({
      query: (formData) => ({
        url: 'inspections/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Inspection'],
    }),
    getFaults: builder.query({
      query: () => 'faults/',
      providesTags: ['Fault'],
    }),
    generateReport: builder.mutation({
      query: (inspectionId) => ({
        url: 'reports/generate/',
        method: 'POST',
        body: { inspection_id: inspectionId },
      }),
      invalidatesTags: ['Report'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetDashboardSummaryQuery,
  useGetInspectionsQuery,
  useUploadInspectionMutation,
  useGetFaultsQuery,
  useGenerateReportMutation,
} = apiSlice;
