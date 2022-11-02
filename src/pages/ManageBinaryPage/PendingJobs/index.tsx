// import { BsExclamationCircle } from "react-icons/bs";
import { AppBinaryJob } from "../../../api/interfaces/response/app_binary_job";

function PendingJob({ job }: { job: AppBinaryJob }) {
  return <div className="bg-blue-100 py-5 px-6 mb-3 text-base text-blue-700  items-center w-full" role="alert">

    {/* <BsExclamationCircle size={'1.5em'} style={{ marginRight: "15px" }} /> */}

    <div>ID: {job.id}</div>
    <div>Name: {job.name}</div>
    {job.description !== undefined && <div>{job.description}</div>}
    <div>Created: {job.createdDate}</div>

  </div>
}

export default function PendingJobs({ jobs }: { jobs: AppBinaryJob[] }) {
  return <>{jobs.map(job => <PendingJob key={job.id} job={job} />)}</>
}