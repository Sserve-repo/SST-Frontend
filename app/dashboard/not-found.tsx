import Link from "next/link";

const Custom404 = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-5xl font-bold text-primary">404</h1>
      <p className="text-lg mt-4">
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" passHref>
        <button className="mt-6 px-12 py-3 bg-primary text-white rounded-md">
          Back to Home
        </button>
      </Link>
    </div>
  );
};

export default Custom404;
