export const validateWhatsAppNumber = (number: string): boolean => {
  // Remove any non-digit characters
  const cleanNumber = number.replace(/\D/g, '')
  
  // Check if number is between 8 and 15 digits
  if (cleanNumber.length < 8 || cleanNumber.length > 15) {
    return false
  }

  // Check if number starts with Cameroon country code (237)
  if (!cleanNumber.startsWith('237')) {
    return false
  }

  // Check if remaining digits form a valid mobile number
  const mobileNumber = cleanNumber.slice(3) // Remove country code
  if (mobileNumber.length !== 9) {
    return false
  }

  // Check if it starts with valid Cameroon mobile prefixes
  const validPrefixes = ['65', '66', '67', '68', '69', '67', '68', '69', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99']
  const prefix = mobileNumber.slice(0, 2)
  return validPrefixes.includes(prefix)
}

export const formatWhatsAppNumber = (number: string): string => {
  const cleanNumber = number.replace(/\D/g, '')
  
  // If number doesn't start with country code, add it
  if (!cleanNumber.startsWith('237')) {
    return `237${cleanNumber}`
  }
  
  return cleanNumber
}

export const getWhatsAppError = (number: string): string | null => {
  if (!number) {
    return 'WhatsApp number is required'
  }
  
  const cleanNumber = number.replace(/\D/g, '')
  
  if (!cleanNumber.startsWith('237')) {
    return 'WhatsApp number must start with country code 237'
  }
  
  if (cleanNumber.length !== 12) { // 237 + 9 digits
    return 'WhatsApp number must be 9 digits after country code'
  }
  
  const mobileNumber = cleanNumber.slice(3)
  const prefix = mobileNumber.slice(0, 2)
  const validPrefixes = ['65', '66', '67', '68', '69', '67', '68', '69', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99']
  
  if (!validPrefixes.includes(prefix)) {
    return 'Invalid Cameroon mobile number prefix'
  }
  
  return null
}

export const formatPhoneNumberDisplay = (number: string): string => {
  const cleanNumber = number.replace(/\D/g, '')
  if (cleanNumber.length !== 12) return number // Return original if invalid
  
  // Format as: 237 6XX XXX XXX
  return `${cleanNumber.slice(0, 3)} ${cleanNumber.slice(3, 6)} ${cleanNumber.slice(6, 9)} ${cleanNumber.slice(9)}`
}