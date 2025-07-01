import Image from "next/image";
import Link from "next/link";

interface SplashProps {
  bgImage: string;
  title: string;
  description: string;
}

export const Splash = () => {
  return (
    <div
      className={
        'h-screen w-full bg-primary bg-cover object-center flex flex-col justify-center items-center bg-[url("/assets/images/carpenter.png")]'
      }
    >
      <div className="2xl:pr-16 xl:pr-14 pr-12 2xl:pl-32 xl:pl-28 pl-24 py-20 flex flex-col justify-between h-screen">
        <Link href="/">
          <Image
            src="/assets/images/logo-light.png"
            width={200}
            height={200}
            alt="logo"
          />
        </Link>
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

export const SplashCard = ({ bgImage, title, description }: SplashProps) => {
  return (
    <div
      className={`h-screen w-full bg-primary bg-cover object-center flex flex-col justify-center items-center`}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="2xl:pr-16 xl:pr-14 pr-12 2xl:pl-32 xl:pl-28 pl-24 py-20 flex flex-col justify-between h-screen">
        <Link href={"/"}>
          <Image
            src="/assets/images/logo-light.png"
            width={200}
            height={200}
            alt="logo"
          />
        </Link>

        <div className="text-left py-10">
          <h1 className="2xl:text-6xl xl:text-5xl text-4xl font-bold text-white">
            {title}
          </h1>
          <p className="text-white xl:text-xl 2xl:text-2xl text-lg mt-3">
            {description}
          </p>
        </div>
        <div className="p-1"></div>
      </div>
    </div>
  );
};

export const ArtisanSplash = () => (
  <SplashCard
    bgImage="/assets/images/carpenter.png"
    title="Join a thriving community of experts and clients"
    description="Consectetur sapien amet ornare nisl lacus rhoncus. Aliquam mi felis viverra nunc."
  />
);

export const VendorSplash = () => (
  <SplashCard
    bgImage="/assets/images/vendor-splash.png"
    title="Join a thriving community of experts and clients"
    description="Consectetur sapien amet ornare nisl lacus rhoncus. Aliquam mi felis viverra nunc."
  />
);

export const BuyerSplash = () => (
  <SplashCard
    bgImage="/assets/images/splash.png"
    title="Join a thriving community of experts and clients"
    description="Consectetur sapien amet ornare nisl lacus rhoncus. Aliquam mi felis viverra nunc."
  />
);
