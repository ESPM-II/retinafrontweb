import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from "react-hot-toast";
import useTableFilters from "../common/store/tableFiltersStore";
import { gqlPaginateGet } from "../apis/calls";
import { omit } from "lodash";
import { GET_ALL_USERS } from '../graphql/Queries/users';

const KEY = "users";
const URL = import.meta.env.VITE_TOKEN;

export const useGetUsers = () => {
    const { tableFilters, setTotal } = useTableFilters();
    return useQuery({
        queryKey: [KEY, omit(tableFilters, ['pagination.total'])],
        queryFn: async () => await gqlPaginateGet(GET_ALL_USERS),
        // placeholderData: keepPreviousData,
})}