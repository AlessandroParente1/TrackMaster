import AuthService from "@/services/auth-service";
import axios from "axios";
import useSWR from "swr";
import useAuthStore from "./useAuth";

// Axios instance with base URL
const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT });

// Interceptor to add access token to request headers
API.interceptors.request.use((req) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken)
        req.headers["x-access-token"] = accessToken;

    return req;
});

// Custom hook to handle API requests with SWR
const useApi = (apiRequestInfo, shouldFetch = true, revalidateIfStale = true) => {
    let key = "";
    let fetcher = () => null;

    if (apiRequestInfo) {
        key = apiRequestInfo.method + "-" + apiRequestInfo.url; // Unique key for SWR cache
        fetcher = () => api(apiRequestInfo);
    } else {
        key = "api-request";
    }

    const swr = useSWR(shouldFetch ? key : null, fetcher, {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale
    });

    // API request function
    const api = async (requestInfo) => {
        const res = await API(requestInfo);
        return res.data;
    };

    // Function to mutate server-side data
    const mutateServer = async (mutationApiRequestInfo) => {
        try {
            await swr.mutate(getMutation(mutationApiRequestInfo, swr.data), getMutationOptions(mutationApiRequestInfo, swr.data));
        } catch (error) {
            console.error(error);
            throw error.response.data.message;
        }
    };

    // Function to get mutation options for SWR
    const getMutationOptions = (mutationApiRequestInfo, oldData) => {
        let optimisticData;
        const mutateData = mutationApiRequestInfo.data;
        const isArray = Array.isArray(oldData);

        switch (mutationApiRequestInfo.method) {
            case "post":
                optimisticData = isArray ? [mutateData, ...oldData] : mutateData;
                break;
            case "patch":
                optimisticData = isArray ? oldData.map(data => data._id === mutateData._id ? mutateData : data) : mutateData;
                break;
            case "delete":
                const splitUrl = mutationApiRequestInfo.url.split("/");
                const id = splitUrl.pop();
                optimisticData = isArray ? oldData.filter(data => data._id !== id) : mutateData;
                break;
            default:
                optimisticData = oldData;
        }

        return {
            optimisticData,
            populateCache: true,
            revalidate: false,
            rollbackOnError: true,
        };
    };

    // Function to handle data mutation
    const getMutation = async (mutationApiRequestInfo, oldData) => {
        const responseData = await api(mutationApiRequestInfo);
        const isArray = Array.isArray(oldData);

        switch (mutationApiRequestInfo.method) {
            case "post":
                return isArray ? [responseData, ...oldData] : responseData;
            case "patch":
                return isArray ? oldData.map(data => data._id === responseData._id ? responseData : data) : responseData;
            case "delete":
                const splitUrl = mutationApiRequestInfo.url.split("/");
                const id = splitUrl.pop();
                return isArray ? oldData.filter(data => data._id !== id) : oldData;
            default:
                return oldData;
        }
    };

    return { ...swr, mutateServer };
};

export default useApi;
