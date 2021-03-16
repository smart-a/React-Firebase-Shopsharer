import React from "react";
import Navbar from "./Navbar";

function Layout({ children }) {
  //background-color class: bg-gray-900
  return (
    <>
      <Navbar />
      <section className="text-gray-500  body-font">
        <div className="container px-5 py-24 mx-auto">{children}</div>
      </section>
    </>
  );
}

export default Layout;
