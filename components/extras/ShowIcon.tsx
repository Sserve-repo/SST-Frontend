import Image from "next/image";
import React from "react";
import Show from "../../assets/icons/plus.svg";

interface ShowIconProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShowIcon: React.FC<ShowIconProps> = ({ setShow }) => {
  return (
    <div
      className="bg-[#FF7F00] inline-flex justify-center items-center h-10 w-10 rounded-lg ml-auto cursor-pointer"
      onClick={() => setShow((prev) => !prev)}
    >
      <Image src={Show} alt="Show Icon" />
    </div>
  );
};

export default ShowIcon;
