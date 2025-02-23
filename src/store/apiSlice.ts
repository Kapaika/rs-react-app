import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://swapi.dev/api/',
  }),
  endpoints: (builder) => ({
    fetchPeople: builder.query({
      query: (searchTerm) => {
        return `people?search=${searchTerm}`;
      },
      transformResponse: (response) => {
        return {
          results: response.results,
          next: response.next,
          previous: response.previous,
        };
      },
    }),
  }),
});

export const { useFetchPeopleQuery } = apiSlice;
