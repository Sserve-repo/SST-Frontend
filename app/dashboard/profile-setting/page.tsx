import { Metadata } from "next";
import ProfileSettingPage from "./_components/ProfileSetting";

export const metadata: Metadata = {
  title: "Page Setup | SphereServe",
};

export default function ProfileSetting() {
  return (
    <>
      <ProfileSettingPage />
    </>
  );
}
