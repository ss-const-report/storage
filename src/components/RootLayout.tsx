import NavBar from "@/components/UI/NavBar";
import { ReactNode } from "react";

const RootLayout = ({children}: {children: ReactNode}) => {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
};

export default RootLayout;