import UnifiedProfileSettings from "@/components/settings/unified-profile-settings";
import { Metadata } from "next";
// import ProfileSettingPage from "./_components/ProfileSetting";
// import UnifiedProfileSettings from "@/components/profile/unified-profile-settings";

export const metadata: Metadata = {
  title: "Setting | Profile",
};

export default function ProfileSetting() {
  return (
    <>
      <UnifiedProfileSettings userType="buyer" />
    </>
  );
}
