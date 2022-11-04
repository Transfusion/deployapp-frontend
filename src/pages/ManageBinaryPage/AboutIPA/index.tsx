import { Ipa } from "../../../api/interfaces/response/app_binary"
import { InfoCell } from "../../../components/InfoCell"
import { formatBytes, humanReadableDate } from "../../../utils/utils"
import { InfoPlistPanel } from "./components/InfoPlistPanel"
import MobileProvisionDetails from "./components/MobileProvisionDetails"

export default function AboutIPA({ binary }: {
  binary: Ipa
}) {
  return <>
    <div className="flex flex-row flex-wrap gap-3 p-2 mb-5 border border-gray-800">

      <InfoCell title={"Type"} value={binary.type} />
      <InfoCell title={"Version"} value={binary.version} />
      <InfoCell title={"Build"} value={binary.build} />
      <InfoCell title={"Upload Date"} value={humanReadableDate(binary.uploadDate)} />
      <InfoCell title={"Name"} value={binary.name} />
      <InfoCell title={"Last Install Date"} value={humanReadableDate(binary.lastInstallDate)} />
      <InfoCell title={"Bundle ID"} value={binary.identifier} />

      <InfoCell title={"Size"} value={formatBytes(binary.sizeBytes)} />

      <InfoCell title={"File Name"} value={binary.fileName ?? 'N/A'} />

      <InfoCell title={"Storage Cred. ID"} value={binary.storageCredential} />

    </div>
    <div className="flex flex-row flex-wrap gap-3 p-2 mb-5 border border-gray-800">
      <InfoCell title={"Min. SDK version"} value={binary.minSdkVersion} />

      <InfoCell title={"iPhone"} value={binary.iphone.toString()} />
      <InfoCell title={"iPad"} value={binary.ipad.toString()} />
      <InfoCell title={"Universal"} value={binary.universal.toString()} />

      <InfoCell title={"Device Type"} value={binary.deviceType ?? "N/A"} />

      <InfoCell title={"Archs."} value={binary.archs?.join(" ") ?? "N/A"} />

      <InfoCell title={"Display Name"} value={binary.displayName ?? 'N/A'} />

      <InfoCell title={"Release Type"} value={binary.releaseType ?? 'N/A'} />

      <InfoCell title={"Build Type"} value={binary.buildType ?? 'N/A'} />

      <InfoCell title={"Team Name"} value={binary.teamName ?? 'N/A'} />

      <InfoCell title={"Expiry Date"} value={humanReadableDate(binary.expiredDate)} />

    </div>

    <h3 className="font-semibold text-2xl">info.plist Details</h3>

    {binary.plistJson && <InfoPlistPanel plist={binary.plistJson} />}

    <h3 className="font-semibold text-2xl">MobileProvision Details</h3>
    <MobileProvisionDetails id={binary.id} />
  </>
}