"use server";

export const profilePayload = (
  data: Record<string, any>,
  currentUser: Record<string, any>,
  changedFields: string[]
): FormData => {
  const requestPayload = new FormData();

  /**
   * Safely convert any input to a string.
   * Only string, number, boolean are allowed. Others become empty string.
   */
  const safeString = (val: unknown): string => {
    if (typeof val === "string" || typeof val === "number") {
      return String(val);
    }
    if (typeof val === "boolean") {
      return val ? "1" : "0";
    }
    return "";
  };

  /**
   * Convert boolean-like input to "1" or "0"
   */
  const safeBoolString = (val: unknown): "1" | "0" => {
    return val === true || val === "1" ? "1" : "0";
  };

  /**
   * Define all the editable user fields (text + toggle)
   */
  const fieldsToAppend: (keyof typeof currentUser)[] = [
    "firstname",
    "lastname",
    "email",
    "username",
    "address",
    "email_status",
    "twofa_status"
  ];

  /**
   * CASE: Only profile picture is being updated.
   */
  const isOnlyPhotoChanged =
    changedFields.length === 0 && data.user_photo instanceof File;

  if (isOnlyPhotoChanged) {
    fieldsToAppend.forEach((field) => {
      const value =
        field === "email_status" || field === "twofa_status"
          ? safeBoolString(currentUser[field])
          : safeString(currentUser[field]);

      requestPayload.append(field, value);
    });

    requestPayload.append("user_photo", data.user_photo);
    return requestPayload;
  }

  /**
   * CASE: Other fields were changed
   */
  fieldsToAppend.forEach((field) => {
    const useNewValue = changedFields.includes(field);
    const rawValue = useNewValue ? data[field] : currentUser[field];

    const value =
      field === "email_status" || field === "twofa_status"
        ? safeBoolString(rawValue)
        : safeString(rawValue);

    requestPayload.append(field, value);
  });

  /**
   * Append photo only if it's a valid File instance
   */
  if (data.user_photo instanceof File) {
    requestPayload.append("user_photo", data.user_photo);
  }

  return requestPayload;
};


// "use server"

// export const profilePayload = (data: any, currentUser: any, changedFields: string[]) => {
//   const requestPayload = new FormData()

//   // If only photo is being updated and no other fields changed, use existing data
//   if (changedFields.length === 0 && data.user_photo instanceof File) {
//     // Append all existing user data
//     requestPayload.append("firstname", currentUser.firstname)
//     requestPayload.append("lastname", currentUser.lastname)
//     requestPayload.append("email", currentUser.email)
//     requestPayload.append("username", currentUser.username)
//     requestPayload.append("address", currentUser.address)
//     requestPayload.append("email_status", currentUser.email_status ? "1" : "0")
//     requestPayload.append("twofa_status", currentUser.twofa_status ? "1" : "0")
//     requestPayload.append("user_photo", data.user_photo)
//     return requestPayload
//   }

//   // For fields that haven't changed, use the current user data
//   const fieldsToAppend = ["firstname", "lastname", "email", "username", "address", "email_status", "twofa_status"]

//   fieldsToAppend.forEach((field) => {
//     let value
//     if (changedFields.includes(field)) {
//       // Use new value for changed fields
//       if (field === "email_status" || field === "twofa_status") {
//         value = data[field] ? "1" : "0"
//       } else {
//         value = data[field]
//       }
//     } else {
//       // Use existing value for unchanged fields
//       if (field === "email_status" || field === "twofa_status") {
//         value = currentUser[field] ? "1" : "0"
//       } else {
//         value = currentUser[field]
//       }
//     }
//     requestPayload.append(field, value)
//   })

//   // Handle photo upload separately
//   if (data.user_photo instanceof File) {
//     requestPayload.append("user_photo", data.user_photo)
//   }

//   return requestPayload
// }

