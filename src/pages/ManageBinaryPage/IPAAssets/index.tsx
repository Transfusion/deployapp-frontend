import classNames from "classnames"
import { BsCloudDownloadFill } from "react-icons/bs"
import { AppBinary, Ipa } from "../../../api/interfaces/response/app_binary"
import { formatBytes, humanReadableDate } from "../../../utils/utils"

export default function IPAAssets({ binary }: {
  binary: Ipa
}) {
  return <>
    <h3 className="font-semibold text-2xl">.mobileprovision</h3>

    <button onClick={() => { }} type="button" className={classNames('text-base', 'text-blue-700', 'hover:text-white', 'border-2', 'border-blue-700', 'hover:bg-blue-800', 'focus:ring-4', 'focus:outline-none', 'focus:ring-blue-300', 'font-medium', 'text-sm', 'p-2', 'text-center', 'mt-2')}>
      <BsCloudDownloadFill className="inline-block mr-2" size={'1.5em'} />
      Generate
    </button>

  </>
}