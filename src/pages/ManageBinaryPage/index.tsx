import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import classNames from "classnames";
import { BsArrowRepeat, BsFillTrashFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteBinary, getUnwrappedBinary, getUnwrappedJobs, updateAppBinaryAvailable } from "../../api/AppBinary";
import { AppBinary, instanceOfApk, instanceOfIpa } from "../../api/interfaces/response/app_binary";
import { AppBinaryJob } from "../../api/interfaces/response/app_binary_job";
import { useAuth } from "../../contexts/AuthProvider";
import AboutAPK from "./AboutAPK";
import AboutIPA from "./AboutIPA";
import AssetsOverview from "./AssetsOverview";
import DeleteUnsuccessfulAlert from "./components/DeleteUnsuccessfulAlert";
import ToggleSuccessfulAlert from "./components/ToggleSuccessfulAlert";
import ToggleUnsuccessfulAlert from "./components/ToggleUnsuccessfulAlert";
import EditDescription from "./EditDescription";
// import Description from "./Description";
import APKAssets from "./APKAssets";
import IPAAssets from "./IPAAssets";
import PendingJobs from "./PendingJobs";
import DownloadStats from "./DownloadStats";



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

  /* mutations begin here */

  const { isLoading: toggleAvailableLoading, isSuccess: toggleAvailableSuccess, error: toggleAvailableError, mutate: toggleAvailable } = useMutation<AxiosResponse<AppBinary, any>, AxiosError, { id: string, req: boolean }>(({ id, req }: {
    id: string, req: boolean
  }) => {
    return updateAppBinaryAvailable(id, req);
  }, {
    // this object is a MutateOptions
    // onSuccess
  });

  const toggleLoading = toggleAvailableLoading;
  const toggleSuccess = toggleAvailableSuccess;
  /**
   * when adding more toggles, perhaps use null coalescing
   * null ||  null || "foo"
   * > 'foo'
   */
  const toggleError = toggleAvailableError;

  const navigate = useNavigate();
  /* delete mutation */
  const { isLoading: deleteLoading, isSuccess: deleteSuccess, error: deleteError, mutate: deleteAppBinary } = useMutation<AxiosResponse<void, any>, AxiosError, string>((id: string) => {
    return deleteBinary(id);
  }, {
    // this object is a MutateOptions
    onSuccess: async () => { navigate('/binaries'); }
  });


  if (isError) return <div className="min-h-full flex justify-center items-center">
    <div className="text-center">
      <h3 className="font-semibold text-4xl">An error occurred</h3>
      <p>{error?.message}</p>
    </div>
  </div>;

  if (data === undefined) {
    if (isLoading || isFetching) return <div className="mx-auto md:px-10 px-5">
      <h1 className={classNames("py-10", "subpixel-antialiased", "font-semibold", "text-5xl", "loading")}  >Editing</h1>
    </div>

    return <div className="min-h-full flex justify-center items-center">
      <div className="text-center">
        <h3 className="font-semibold text-4xl">An error occurred</h3>
        <p>No data was returned from the server.</p>
      </div>
    </div>;
  }

  const iconURL = `${process.env.REACT_APP_BASE_URL}storage/api/v1/app/binary/${data?.id}/icon`;

  return <div className="mx-auto md:px-10 px-5 mb-10" data-color-mode="light">
    <h1 className={classNames("pt-10", "subpixel-antialiased", "font-semibold", "text-5xl")}  >Editing {data?.name}</h1>

    <Link target={"_blank"} className="inline-block hover:underline text-blue-700" to={`/i/${data?.id}`}>Click here for the public link</Link>

    <div>
      <a target={"_blank"} href={iconURL}>
        {instanceOfIpa(data) ? <img className="inline-block max-w-[114px] rounded-3xl shadow-md my-5" src={iconURL} />
          : <img className="inline-block max-w-[150px] my-5" src={iconURL} />}
      </a>
    </div>

    {instanceOfIpa(data) && <AboutIPA binary={data} />}
    {instanceOfApk(data) && <AboutAPK binary={data} />}

    {/* Description */}

    <h3 className="font-semibold text-4xl">Assets</h3>
    {/* notably, public/primary app icon, plist and icons download in a zip */}

    {/* list of downloadable files */}
    <AssetsOverview binary={data} />
    {instanceOfIpa(data) && <IPAAssets binary={data} />}
    {instanceOfApk(data) && <APKAssets binary={data} />}


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

    <h3 className="font-semibold text-4xl">Download Stats</h3>
    <DownloadStats className='py-3' appBinaryId={data?.id} />

    <h3 className="font-semibold text-4xl pb-2">Settings</h3>
    {/* available, timeframe, password, assets public? */}

    <div>
      <label className="inline-flex items-center">
        <input
          disabled={toggleLoading}
          defaultChecked={data.available}
          onChange={(e) => {
            toggleAvailable({ id: binaryId!!, req: e.target.checked });
          }}
          // {...register('skipTestPublicAccess')} 

          className="form-checkbox w-7 h-7 mr-2 focus:ring-indigo-400 focus:ring-opacity-25 border border-gray-300 rounded" type="checkbox" />
        <p className="text-base font-semibold">Available to public</p>
      </label>
    </div>

    {/* success methods here */}
    {toggleSuccess && <ToggleSuccessfulAlert />}
    {toggleError && <ToggleUnsuccessfulAlert error={toggleError} />}

    <div>
      {/* delete button */}
      <button
        disabled={deleteLoading}
        onClick={() => {
          deleteAppBinary(binaryId!!)
        }}
        className={classNames('text-base', 'text-red-700', 'hover:text-white', 'border-2', 'border-red-700', 'hover:bg-red-800', 'focus:ring-4', 'focus:outline-none', 'focus:ring-red-300', 'font-medium', 'text-sm', 'p-2', 'text-center', 'mt-2',
          // 'mr-2', 'mb-2',
          // 'dark:border-blue-500', 'dark:hover:text-white', 'dark:hover:bg-blue-600', 'dark:focus:ring-blue-800'

        )}>
        <BsFillTrashFill className="inline-block mr-2" size={'1.5em'} />
        Delete {data?.name} PERMANENTLY
      </button>
    </div>


    {deleteError && <DeleteUnsuccessfulAlert error={deleteError} />}

  </div>
}