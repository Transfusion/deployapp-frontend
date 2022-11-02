import { Ipa } from "../../../../api/interfaces/response/app_binary"
import { InfoCell } from "../../../../components/InfoCell"
import { formatBytes, humanReadableDate } from "../../../../utils/utils"

export default function PublicAboutIPA({ binary }: {
  binary: Ipa
}) {
  return <>
    <div className="flex flex-row flex-wrap gap-3 py-2">
      <InfoCell title={"Type"} value={binary.type} />
      <InfoCell title={"Version"} value={binary.version} />
      <InfoCell title={"Build"} value={binary.build} />
      <InfoCell title={"Upload Date"} value={humanReadableDate(binary.uploadDate)} />
      {/* <InfoCell title={"Name"} value={binary.name} /> */}
      <InfoCell title={"Last Install Date"} value={humanReadableDate(binary.lastInstallDate)} />
      <InfoCell title={"Bundle ID"} value={binary.identifier} />

      <InfoCell title={"Size"} value={formatBytes(binary.sizeBytes)} />

      {/* <InfoCell title={"File Name"} value={binary.fileName ?? 'N/A'} /> */}

      {/* <InfoCell title={"Storage Cred. ID"} value={binary.storageCredential} /> */}

      <InfoCell title={"Min. OS version"} value={binary.minSdkVersion} />
      {/* <InfoCell title={"Device Type"} value={binary.deviceType ?? "N/A"} /> */}
      {/* <InfoCell title={"Archs."} value={binary.archs.join(" ") ?? "N/A"} /> */}
      <InfoCell title={"Release Type"} value={binary.releaseType ?? 'N/A'} />
      <InfoCell title={"Team Name"} value={binary.teamName ?? 'N/A'} />
      <InfoCell title={"Expiry Date"} value={humanReadableDate(binary.expiredDate)} />
    </div>
  </>

}