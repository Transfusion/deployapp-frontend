import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { FaFileImport } from "react-icons/fa";
import { generateAssetUnwrapped } from "../../../api/AppBinary"
import { Ipa } from "../../../api/interfaces/response/app_binary"
import { GenerateAssetResult } from "../../../api/interfaces/response/generate_asset"
import AsyncJobSuccessfulAlert from "../components/AsyncJobSuccessfulAlert"
import AsyncJobUnsuccessfulAlert from "../components/AsyncJobUnsuccessfulAlert";


type GenerateAssetParams = {
  id: string,
  type: string,
}

export default function IPAAssets({ binary }: {
  binary: Ipa
}) {

  const queryClient = useQueryClient();

  const { data: mutationResult, isLoading: mutationLoading, isSuccess: mutationSuccess, error: mutationError, mutate: generateAsset } = useMutation<GenerateAssetResult, AxiosError, GenerateAssetParams>((params: GenerateAssetParams) => {
    return generateAssetUnwrapped(params.id, params.type);
  }, {
    // this object is a MutateOptions
    // TOOD: queryclient invalidate the list of pending jobs
    onSuccess: async () => {
      queryClient.invalidateQueries(['jobs', binary.id]);
    }
  });

  return <>

    <div className="flex flex-row flex-wrap gap-3 py-2 mb-5">

      <div>
        <h3 className="font-semibold text-2xl">.mobileprovision</h3>
        <button disabled={mutationLoading} onClick={() => {
          generateAsset({ id: binary.id, type: 'MOBILEPROVISION' })
        }} className={'text-base text-blue-700 hover:text-white border-2 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm p-2 text-center mt-2'}>
          <FaFileImport className="inline-block mr-2" size={'1.5em'} />
          Generate
        </button>
      </div>


      <div>
        <h3 className="font-semibold text-2xl">Primary App Icon</h3>

        <button disabled={mutationLoading} onClick={() => {
          generateAsset({ id: binary.id, type: 'PUBLIC_ICON' })
        }} className={'text-base text-blue-700 hover:text-white border-2 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm p-2 text-center mt-2'}>
          <FaFileImport className="inline-block mr-2" size={'1.5em'} />
          Generate
        </button>
      </div>

    </div>

    {/* TODO */}
    {/* <h3 className="font-semibold text-2xl">All App Icons</h3> */}

    {mutationSuccess && <AsyncJobSuccessfulAlert message={`Job created with ID: ${mutationResult.jobId}`} />}
    {mutationError && <AsyncJobUnsuccessfulAlert error={mutationError} />}
  </>
}