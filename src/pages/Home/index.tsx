import HomeUpload from "../../components/HomeUpload";

export default function Home() {
  return <div className="container mx-auto min-h-full flex items-center px-10">

    <div>
      <h1 className="subpixel-antialiased font-semibold text-3xl">Manage your app betas - and bring your own storage *</h1>
      <p>* Currently only supports S3-compatible object stores.</p>

      {/* start of drop to upload */}
      <HomeUpload />
    </div>

  </div>
}