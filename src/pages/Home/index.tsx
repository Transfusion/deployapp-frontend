import HomeUpload from "../../components/HomeUpload";

export default function Home() {
  // container is width: 100%
  return <div className="container mx-auto min-h-full flex items-center px-5 py-20">

    <div className="w-full md:w-3/4 flex flex-col gap-5">
      <h1 className="subpixel-antialiased font-semibold text-3xl">Manage your app betas - and bring your own storage *</h1>
      <p>* Currently only supports S3-compatible object stores.</p>

      {/* start of drop to upload */}
      <HomeUpload />
    </div>

  </div>
}