import { Metadata } from "next";
// import ProfileSettingPage from "./_components/ProfileSetting";
import UnifiedProfileSettings from "@/components/settings/unified-profile-settings";

export const metadata: Metadata = {
  title: "Page Setup | SphereServe",
};

export default function ProfileSetting() {
  return (
    <>
      <UnifiedProfileSettings />
    </>
  );
}
