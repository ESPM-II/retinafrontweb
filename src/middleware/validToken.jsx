import { useQuery } from "react-query";
import { axiosGet } from "../apis/calls";


const validaToken = (token) => {
    return useQuery(['token'],() => axiosGet('auth/verify-token'),{
        staleTime: 1000,
        enabled: !!token
    })
}

export default validaToken;