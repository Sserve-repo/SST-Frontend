import Image from "next/image";
import React from "react";
import Hide from "../../assets/icons/minus.svg";

interface ShowIconProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
const HideIcon: React.FC<ShowIconProps> = ({setShow}) => {
  return (
    <div
      className="bg-black  inline-flex justify-center items-center h-10 w-10 rounded-lg ml-auto"
      onClick={() => setShow((prev) => !prev)}
    >
      <Image src={Hide} alt="" />
    </div>
  );
};

export default HideIcon;
