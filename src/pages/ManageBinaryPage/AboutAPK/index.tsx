import _ from "lodash"
import { Apk } from "../../../api/interfaces/response/app_binary"
import { InfoCell } from "../../../components/InfoCell"
import { formatBytes, humanReadableDate } from "../../../utils/utils"
import { ManifestPanel } from "./components/ManifestPanel"

export default function AboutAPK({ binary }: {
  binary: Apk
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

      <InfoCell title={"Min. OS version"} value={binary.minOsVersion} />
      <InfoCell title={"Target SDK version"} value={binary.targetSdkVersion} />

      <InfoCell title={"Device Type"} value={binary.deviceType ?? "N/A"} />

      <InfoCell title={"Features"} value={binary.useFeatures ?
        <span className="font-mono text-sm">{binary.useFeatures?.toString()}</span>
        : 'N/A'} />

      <div className="basis-full h-0" />

      <InfoCell title={"Permissions"} value={binary.usePermissions ?
        <span className="font-mono text-sm">{binary.usePermissions?.toString()}</span>
        : 'N/A'} />

      <div className="basis-full h-0" />

      <InfoCell title={"Deep Links"} value={!_.isEmpty(binary.deepLinks) ?
        <span className="font-mono text-sm">{binary.deepLinks?.toString()}</span>
        : 'N/A'} />


      <InfoCell title={"Schemes"} value={!_.isEmpty(binary.schemes) ?
        <span className="font-mono text-sm">{binary.schemes?.toString()}</span>
        : 'N/A'} />

    </div>

    <h3 className="font-semibold text-2xl">Manifest</h3>
    {binary.manifestXml && <ManifestPanel manifestXml={binary.manifestXml} />}
  </>
}