import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import classNames from "classnames";
import { BsCheckCircleFill, BsFillTrashFill, BsXCircleFill } from "react-icons/bs";
import { deleteBinary } from "../../../api/AppBinary";
import { cancelInitialStoreJob, deleteInitialStoreJob, getUnwrappedInitialStorageJobs } from "../../../api/AppBinaryInitialStore";
import { AppBinaryStoreJob } from "../../../api/interfaces/response/app_binary_store_job";
import { InfoCell } from "../../../components/InfoCell";
import { useAuth } from "../../../contexts/AuthProvider";
import { humanReadableDate } from "../../../utils/utils";

function ProcessingJob({ disabled, job }: { disabled: boolean, job: AppBinaryStoreJob }) {
  const { id, name, status, createdDate, appBinaryId } = job;

  const colorVariants = new Map([
    ['CANCELLING', `bg-yellow-100 text-yellow-700`],
    ['ABORTED', `bg-red-100 text-red-700`],
    ['DEFAULT', `bg-blue-100 text-blue-700`]
  ])

  const getColorVariant = (id: string) => colorVariants.get(id) ?? colorVariants.get('DEFAULT');

  const colorVariant = getColorVariant(status);

  const DeleteButton = () => {
    const queryClient = useQueryClient();
    const { isLoading: deleteLoading, isSuccess: deleteSuccess, error: deleteError, mutate } = useMutation<AxiosResponse<void, any>, AxiosError, string>((id: string) => {
      return deleteBinary(id);
    }, {
      // this object is a MutateOptions
      onSuccess: async () => {
        queryClient.invalidateQueries(['processing']);
        queryClient.invalidateQueries(['binaries']);
      }
    });

    return <button
      disabled={disabled || deleteLoading}
      onClick={() => {
        mutate(id);
      }}
      className={classNames('text-base', 'text-red-700', 'hover:text-white', 'border-2', 'border-red-700', 'hover:bg-red-800', 'focus:ring-4', 'focus:outline-none', 'focus:ring-red-300', 'font-medium', 'text-sm', 'p-2', 'text-center', 'mt-2', 'self-end'
        // 'mr-2', 'mb-2',
        // 'dark:border-blue-500', 'dark:hover:text-white', 'dark:hover:bg-blue-600', 'dark:focus:ring-blue-800'

      )}>
      <BsFillTrashFill className="inline-block mr-2" size={'1.5em'} />
      Delete
    </button>
  }

  const DismissButton = () => {
    const queryClient = useQueryClient();
    const { isLoading: dismissLoading, isSuccess: dismissSuccess, error: dismissError, mutate } = useMutation<AxiosResponse<void, any>, AxiosError, string>((id: string) => {
      return deleteInitialStoreJob(id);
    }, {
      // this object is a MutateOptions
      onSuccess: async () => {
        queryClient.invalidateQueries(['processing']);
      }
    });


    return <button
      disabled={disabled || dismissLoading}
      onClick={() => {
        mutate(id);
      }}
      className={classNames('text-base', 'text-blue-700', 'hover:text-white', 'border-2', 'border-blue-700', 'hover:bg-blue-800', 'focus:ring-4', 'focus:outline-none', 'focus:ring-blue-300', 'font-medium', 'text-sm', 'p-2', 'text-center', 'mt-2', 'self-end'
        // 'mr-2', 'mb-2',
        // 'dark:border-blue-500', 'dark:hover:text-white', 'dark:hover:bg-blue-600', 'dark:focus:ring-blue-800'

      )}>
      <BsCheckCircleFill className="inline-block mr-2" size={'1.5em'} />
      Dismiss
    </button>
  }

  const CancelButton = () => {
    const queryClient = useQueryClient();
    const { isLoading: cancelLoading, isSuccess: cancelSuccess, error: cancelError, mutate } = useMutation<AxiosResponse<void, any>, AxiosError, string>((id: string) => {
      return cancelInitialStoreJob(id);
    }, {
      // this object is a MutateOptions
      onSuccess: async () => {
        queryClient.invalidateQueries(['processing']);
      }
    });

    return <button
      disabled={disabled || cancelLoading}
      onClick={() => {
        mutate(id);
      }}
      className={classNames('text-base', 'text-red-700', 'hover:text-white', 'border-2', 'border-red-700', 'hover:bg-red-800', 'focus:ring-4', 'focus:outline-none', 'focus:ring-red-300', 'font-medium', 'text-sm', 'p-2', 'text-center', 'mt-2', 'self-end'
        // 'mr-2', 'mb-2',
        // 'dark:border-blue-500', 'dark:hover:text-white', 'dark:hover:bg-blue-600', 'dark:focus:ring-blue-800'

      )}>
      <BsXCircleFill className="inline-block mr-2" size={'1.5em'} />
      Cancel
    </button>
  }

  return <div className={`flex flex-row ${colorVariant} py-5 px-6 mb-3 text-base items-center w-full`}>

    <div className={`flex flex-row flex-wrap gap-3`} role="alert">
      {/* <InfoCell title={"ID"} value={id} /> */}
      <InfoCell title={"Name"} value={name} />
      <InfoCell title={"Status"} value={status} />
      <InfoCell title={"Started"} value={humanReadableDate(createdDate)} />
    </div>

    <div className="grow" />

    {status === "ABORTED" && <DeleteButton />}
    {status === "PROCESSING" && <CancelButton />}
    {(status === "SUCCESSFUL" ||
      // has been stuck in CANCELLING status for more than 1 hour
      (status === "CANCELLING" && ((new Date()).getTime() - createdDate.getTime() >= 3600000))
    ) && <DismissButton />}

  </div>

}

export default function Processing() {

  const { profile } = useAuth();
  const queryKey = ['processing', {
    authenticated: profile?.authenticated
  }];

  const { isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData, } = useQuery(queryKey, () => getUnwrappedInitialStorageJobs());

  return <>
    {data?.map(job => <ProcessingJob disabled={isLoading || isFetching} job={job} />)}
  </>
}