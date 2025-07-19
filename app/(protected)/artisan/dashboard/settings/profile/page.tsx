import UnifiedProfileSettings from "@/components/settings/unified-profile-settings";

export default function AdminProfileSettingsPage() {
  return (
    <UnifiedProfileSettings
      userType="admin"
      showBusinessInfo={true}
      showBankDetails={false}
    />
  );
}
