import UnifiedProfileSettings from "@/components/settings/unified-profile-settings";
import React from "react";

function page() {
  return (
    <div>
      <UnifiedProfileSettings
        userType="vendor"
        showBusinessInfo={true}
        showBankDetails={false}
      />
    </div>
  );
}

export default page;
