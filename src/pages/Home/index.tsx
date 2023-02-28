import Footer from "../../components/Footer";
import HomeUpload from "../../components/HomeUpload";

export default function Home() {
  // container is width: 100%
  return <div className="container mx-auto min-h-full flex items-center px-5 py-20">

    <div className="w-full md:w-3/4 max-w-2xl flex flex-col gap-5">
      <h1 className="subpixel-antialiased font-semibold text-3xl">Manage your app betas - and bring your own storage *</h1>
      <p>* Currently supports S3-compatible object stores and FTP-web server combinations.</p>

      {/* start of drop to upload */}
      <HomeUpload />

      <Footer />
    </div>

  </div>
}