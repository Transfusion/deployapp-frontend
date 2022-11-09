import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { BsCloudDownloadFill } from "react-icons/bs";
import { getUnwrappedAssets } from "../../../api/AppBinary";
import { AppBinary } from "../../../api/interfaces/response/app_binary";
import { InfoCell } from "../../../components/InfoCell";
import { useAuth } from "../../../contexts/AuthProvider";


export default function AssetsOverview({ binary }: {
  binary: AppBinary
}) {
  const { profile } = useAuth();

  const queryKey = ['assets_overview', binary.id, profile?.authenticated];

  const { isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData, } = useQuery(queryKey, () => getUnwrappedAssets(binary.id));

  console.log("asset data from inside here", data);

  if (isLoading || isFetching) return <p className="text-gray-500 loading">Loading</p>

  if (data?.length == 0) return <p className="text-gray-500">No downloads available.</p>

  return <>
    {data?.map(({ id, appBinaryId, type, status, fileName, description, value }) =>

      <div key={id} className="flex flex-row flex-wrap gap-3 p-2 mb-5 border border-gray-800">

        <InfoCell title={"ID"} value={id} />
        <InfoCell title={"Type"} value={type} />
        <InfoCell title={"Status"} value={status ?? 'N/A'} />
        <InfoCell title={"Filename"} value={fileName ?? 'N/A'} />
        <InfoCell title={"Desc."} value={description ?? 'N/A'} />

        {fileName !== undefined && status !== 'FAILED' && <div className={classNames("flex", "flex-row", "justify-end", "basis-full")}>


          <a href={`${process.env.REACT_APP_BASE_URL}/storage/api/v1/app/assets/${id}/getAuthorized`}

            download

            type="button" className={classNames('text-base', 'text-blue-700', 'hover:text-white', 'border-2', 'border-blue-700', 'hover:bg-blue-800', 'focus:ring-4', 'focus:outline-none', 'focus:ring-blue-300', 'font-medium', 'text-sm', 'p-2', 'text-center', 'mt-2')}>
            <BsCloudDownloadFill className="inline-block mr-2" size={'1.5em'} />
            Download
          </a>


        </div>}
      </div>
    )}
  </>
}