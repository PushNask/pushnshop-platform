export const validateWhatsAppNumber = (number: string): boolean => {
  // Remove any non-digit characters
  const cleanNumber = number.replace(/\D/g, '')
  
  // Check if number is between 8 and 15 digits
  if (cleanNumber.length < 8 || cleanNumber.length > 15) {
    return false
  }

  // Check if number starts with country code
  if (!cleanNumber.startsWith('237')) {
    return false
  }

  return true
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
  const cleanNumber = number.replace(/\D/g, '')
  
  if (!cleanNumber) {
    return 'WhatsApp number is required'
  }
  
  if (cleanNumber.length < 8) {
    return 'WhatsApp number is too short'
  }
  
  if (cleanNumber.length > 15) {
    return 'WhatsApp number is too long'
  }
  
  if (!cleanNumber.startsWith('237')) {
    return 'WhatsApp number must start with country code 237'
  }
  
  return null
}