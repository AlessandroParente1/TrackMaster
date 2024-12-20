import axios from "axios";
import useSWR from "swr"; //data fetching on the client side
import useAuthStore from "./useAuth";

// Axios instance with base URL

const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT });

// Interceptor allows you to add the access token to each request without having to add it manually
API.interceptors.request.use((req) => {

    //by using useAuthStore.getState().accessToken, the interceptor, gets the token from the global store useAuthStore
    const accessToken = useAuthStore.getState().accessToken;

    //adds the access token to the request headers (if it exists)
    if (accessToken)
        req.headers["x-access-token"] = accessToken;

    return req;
});


const useApi = (apiRequestInfo, shouldFetch = true, revalidateIfStale = true) => {

    //executes the API requests via axios
    const api = async (requestInfo) => {
        const res = await API(requestInfo);//API is the axios instance created above
        return res.data;
    };

    let key = "";//identifier
    let fetcher = () => null;//the fetch functions for useSWR

    if (apiRequestInfo) {
        //the key is made up of the method and URL of the API
        key = apiRequestInfo.method + "-" + apiRequestInfo.url;

        //fetcher calls api(apiRequestInfo), executing the request via axios.
        fetcher = () => api(apiRequestInfo);
    }
    else {
        key = "api-request";
    }

    //useSWR uses the key to cache requests and the fetcher to fetch data only if shouldFetch is true.
    const swr = useSWR(shouldFetch ? key : null, fetcher, {

        //swr options to avoid re-fetching on errors or reconnections, unless revalidateIfStale is enabled
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale
    });

    //Note 1
    //function that implements a flow of mutations of the client data using SWR
    const mutateServer = async (mutationApiRequestInfo) => {
        try {
            //swr.mutate to update the data in useSWR without making a new request to the server.
            //It uses getMutation and getMutationOptions to define the optimistic data to show while it's waiting for the mutation
            await swr.mutate(

                //function that gets the optimistic data
                getMutation(mutationApiRequestInfo, swr.data),

                //function that defines some advanced options
                getMutationOptions(mutationApiRequestInfo, swr.data));
            //getMutation and getMutationOptions are defined below

        } catch (error) {
            console.error(error);
            throw error.response.data.message;
        }
    };

    const getMutationOptions = (mutationApiRequestInfo, oldData) => {
        let optimisticData;
        const mutateData = mutationApiRequestInfo.data;
        const isArray = Array.isArray(oldData);

        switch (mutationApiRequestInfo.method) {
            case "post"://adds the element to the beginning of the list (if oldData is an array).
                optimisticData = isArray ? [mutateData, ...oldData] : mutateData;
            case "patch"://updates the existing element in the array.
                optimisticData = isArray ? oldData.map(data => data._id === mutateData._id ? mutateData : data) : mutateData;
            case "delete"://removes the specific element from the array.
                //the array splitUrl contains the path of the url.
                // Ex: If mutationApiRequestInfo.url is "/projects/123/tickets":
                // splitUrl will be ["", "projects", "123", "tickets"]

                const splitUrl = mutationApiRequestInfo.url.split("/");
                const id = splitUrl.pop();
                //mutateData holds the data that is either being added, updated, or deleted,
                // and is used in optimistic updates to immediately reflect changes in the UI

                optimisticData = isArray ? oldData.filter(data => data._id !== id) : mutateData;
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

    //Returns the new data to display in the case of post, patch, and delete, depending on the type of mutation
    const getMutation = async (mutationApiRequestInfo, oldData) => {
        const responseData = await api(mutationApiRequestInfo);
        const isArray = Array.isArray(oldData);

        switch (mutationApiRequestInfo.method) {
            case "post"://adds the new data to the beginning of the list.
                return isArray ? [responseData, ...oldData] : responseData;
            case "patch"://update the item with the same _id.
                return isArray ? oldData.map(data => data._id === responseData._id ? responseData : data) : responseData;
            case "delete"://removes the specified element from the array.
                const splitUrl = mutationApiRequestInfo.url.split("/");
                const id = splitUrl.pop();
                return isArray ? oldData.filter(data => data._id !== id) : oldData;
            default:
                return oldData;
        }

    };
    //The hook returns both the swr object (containing the fetch status, data and re-fetch functions) and mutateServer,
    // which allows you to perform data mutations without directly invoking api
    return { ...swr, mutateServer };
};

export default useApi;