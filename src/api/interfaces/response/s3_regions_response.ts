interface S3Region {
  isGlobalRegion: boolean,
  id: string,
  description: string,
}

type S3RegionsResponse = S3Region[]
export default S3RegionsResponse