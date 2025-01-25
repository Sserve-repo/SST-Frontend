"use server"

export const profilePayload = (data: any, currentUser: any, changedFields: string[]) => {
  const requestPayload = new FormData()

  // If only photo is being updated and no other fields changed, use existing data
  if (changedFields.length === 0 && data.user_photo instanceof File) {
    // Append all existing user data
    requestPayload.append("firstname", currentUser.firstname)
    requestPayload.append("lastname", currentUser.lastname)
    requestPayload.append("email", currentUser.email)
    requestPayload.append("username", currentUser.username)
    requestPayload.append("address", currentUser.address)
    requestPayload.append("email_status", currentUser.email_status ? "1" : "0")
    requestPayload.append("twofa_status", currentUser.twofa_status ? "1" : "0")
    requestPayload.append("user_photo", data.user_photo)
    return requestPayload
  }

  // For fields that haven't changed, use the current user data
  const fieldsToAppend = ["firstname", "lastname", "email", "username", "address", "email_status", "twofa_status"]

  fieldsToAppend.forEach((field) => {
    let value
    if (changedFields.includes(field)) {
      // Use new value for changed fields
      if (field === "email_status" || field === "twofa_status") {
        value = data[field] ? "1" : "0"
      } else {
        value = data[field]
      }
    } else {
      // Use existing value for unchanged fields
      if (field === "email_status" || field === "twofa_status") {
        value = currentUser[field] ? "1" : "0"
      } else {
        value = currentUser[field]
      }
    }
    requestPayload.append(field, value)
  })

  // Handle photo upload separately
  if (data.user_photo instanceof File) {
    requestPayload.append("user_photo", data.user_photo)
  }

  return requestPayload
}

