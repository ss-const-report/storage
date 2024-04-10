import ContactInfo from "@/components/ContactInfo";
import Login from "@/components/Login/Login";
import LoginTextInfo from "@/components/LoginTextInfo";

export default function Home() {
  return (
    <div className="g-0 lg:flex lg:flex-wrap">
      <div className="px-4 md:px-0 lg:w-6/12">
        <Login />
      </div>


      <div className="flex items-center rounded-b-lg lg:w-6/12 lg:rounded-r-lg lg:rounded-bl-none bg-gradient-to-r from-[#cec8c8] via-[#b7c091] to-[#b6c47b]">
        <div className="px-4 py-6 md:mx-6 md:p-12 ">
          <LoginTextInfo />
          <div className="flex justify-end">
            <ContactInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
