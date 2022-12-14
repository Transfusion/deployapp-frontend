// import { BsExclamationCircle } from "react-icons/bs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import classNames from "classnames";
import { AppBinaryJob } from "../../../api/interfaces/response/app_binary_job";
import { cancelJob } from "../../../api/Job";
import CancelUnsuccessfulAlert from "./components/CancelUnsuccessfulAlert";

function PendingJob({ job }: { job: AppBinaryJob }) {

  const queryClient = useQueryClient();

  const { isLoading: cancelLoading, isSuccess: cancelSuccess, error: cancelError, mutate: cancelExistingJob } = useMutation<AxiosResponse<void, any>, AxiosError, string>((id: string) => {
    return cancelJob(id);
  }, {
    // this object is a MutateOptions
    // onSuccess: onDeleteSuccess
    onSuccess: async (resp) => {
      queryClient.invalidateQueries(['jobs', job.appBinaryId]);
    }
  });

  const disableOperations = cancelLoading;

  return <>
    <div className="bg-blue-100 py-5 px-6 mb-3 text-base text-blue-700  items-center w-full" role="alert">

      {/* <BsExclamationCircle size={'1.5em'} style={{ marginRight: "15px" }} /> */}

      <div>ID: {job.id}</div>
      <div>Name: {job.name}</div>
      {job.description !== undefined && <div>{job.description}</div>}
      <div>Created: {job.createdDate}</div>

      <div className={classNames('flex', 'flex-row', 'justify-end', 'gap-5')}>
        <button
          disabled={disableOperations}
          onClick={() => { cancelExistingJob(job.id) }}
          className={classNames('text-base', 'text-red-700', 'hover:text-white', 'border-2', 'border-red-700', 'hover:bg-red-800', 'focus:ring-4', 'focus:outline-none', 'focus:ring-red-300', 'font-medium', 'text-sm', 'p-2', 'text-center', 'mt-2',
            // 'mr-2', 'mb-2',
            // 'dark:border-blue-500', 'dark:hover:text-white', 'dark:hover:bg-blue-600', 'dark:focus:ring-blue-800'

          )}>Cancel</button>
      </div>
    </div>
    {cancelError && <CancelUnsuccessfulAlert error={cancelError} />}
  </>
}

export default function PendingJobs({ jobs }: { jobs: AppBinaryJob[] }) {
  return <>{jobs.map(job => <PendingJob key={job.id} job={job} />)}</>
}