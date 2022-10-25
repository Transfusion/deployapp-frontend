import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import classNames from "classnames";
import { BsArrowRepeat } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { getUnwrappedBinary, getUnwrappedJobs } from "../../api/AppBinary";
import { AppBinary, instanceOfIpa } from "../../api/interfaces/response/app_binary";
import { AppBinaryJob } from "../../api/interfaces/response/app_binary_job";
import { useAuth } from "../../contexts/AuthProvider";
import AboutIPA from "./AboutIPA";
import AssetsOverview from "./AssetsOverview";
import EditDescription from "./EditDescription";
// import Description from "./Description";
import IPAAssets from "./IPAAssets";
import PendingJobs from "./PendingJobs";



export default function EditBinaryPage() {
  // the API checks whether the user is authorized to access this page
  const { profile } = useAuth();

  const { binaryId } = useParams();

  const queryClient = useQueryClient();

  const queryKey = ['binary', binaryId, {
    authenticated: profile?.authenticated
  }];

  const jobsQueryKey = ['jobs', binaryId, {
    authenticated: profile?.authenticated
  }]

  // binaryId will never be undefined because it's part of the path
  const { isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData, } = useQuery<AppBinary, AxiosError>(queryKey, () => getUnwrappedBinary(binaryId!!), {
      retry: false
    });


  // pending jobs
  // pull the list of currently running jobs at /binary/{id}/jobs
  const { isLoading: jobsIsLoading,
    isError: jobsIsError,
    error: jobsErrors,
    data: jobsData,
    isFetching: jobsIsFetching, isPreviousData: jobIsPreviousData } = useQuery<AppBinaryJob[], AxiosError>(jobsQueryKey, () => getUnwrappedJobs(binaryId!!));

  if (isError) return <div className="min-h-full flex justify-center items-center">
    <div className="text-center">
      <h3 className="font-semibold text-4xl">An error occurred</h3>
      <p>{error?.message}</p>
    </div>
  </div>;

  if (data === undefined) {
    if (isLoading || isFetching) return <div className="mx-auto px-10">
      <h1 className={classNames("py-10", "subpixel-antialiased", "font-semibold", "text-5xl", "loading")}  >Editing</h1>
    </div>

    return <div className="min-h-full flex justify-center items-center">
      <div className="text-center">
        <h3 className="font-semibold text-4xl">An error occurred</h3>
        <p>No data was returned from the server.</p>
      </div>
    </div>;
  }

  return <div className="mx-auto px-10" data-color-mode="light">
    <h1 className={classNames("py-10", "subpixel-antialiased", "font-semibold", "text-5xl")}  >Editing {data?.name}</h1>

    {instanceOfIpa(data) && <AboutIPA binary={data} />}

    {/* Description */}

    <h3 className="font-semibold text-4xl">Assets</h3>
    {/* notably, public/primary app icon, plist and icons download in a zip */}

    {/* list of downloadable files */}
    <AssetsOverview binary={data} />
    {instanceOfIpa(data) && <IPAAssets binary={data} />}

    {/* <h3 className="font-semibold text-4xl">Info</h3> */}

    {/* core info */}
    {/* expanding panel to show two column */}

    <h3 className="font-semibold text-4xl">About</h3>


    <div className="flex flex-row items-center gap-3">
      <h3 className="font-semibold text-4xl pb-2">Pending Jobs</h3>
      <button disabled={jobsIsLoading || jobsIsFetching}
        onClick={() => {
          // refresh pending jobs
          queryClient.invalidateQueries(['jobs']);
        }}>
        <BsArrowRepeat className={classNames({ "animate-spin": jobsIsLoading || jobsIsFetching })} size={'1.5em'} />
      </button>
    </div>


    {jobsData?.length == 0 && <p className="text-gray-500">All clear!</p>}
    {jobsData !== undefined && <PendingJobs jobs={jobsData} />}


    <h3 className="font-semibold text-4xl">Description</h3>
    <EditDescription binary={data} />

    <h3 className="font-semibold text-4xl">Settings</h3>
    {/* visible, timeframe, assets public? */}

    {/* delete button */}
  </div>
}