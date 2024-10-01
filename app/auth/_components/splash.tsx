import Image from "next/image";
import React from "react";

const Splash = () => {
  return (
    <div className='h-screen w-full bg-primary bg-cover object-center flex flex-col justify-center items-center bg-[url("/assets/images/splash.png")]'>
      <div className="2xl:pr-16 xl:pr-14 pr-12 2xl:pl-32 xl:pl-28 pl-24 py-20 flex flex-col justify-between h-screen">
        <Image
          src="/assets/images/logo-light.png"
          width={200}
          height={200}
          alt="logo"
        />
        <div className="text-left py-10">
          <h1 className="2xl:text-6xl xl:text-5xl text-4xl font-bold text-white">
            Join a thriving community of experts and clients
          </h1>
          <p className="text-white xl:text-xl 2xl:text-2xl text-lg mt-3">
            Consectetur sapien amet ornare nisl lacus rhoncus. Aliquam mi felis
            viverra nunc.
          </p>
        </div>
        <div className="p-1"></div>
      </div>
    </div>
  );
};

export default Splash;
