import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'
import { getWhatsAppError, formatPhoneNumberDisplay } from '@/utils/validation'
import { useState, useEffect } from 'react'

interface WhatsAppInputProps {
  value: string
  onChange: (value: string) => void
  required?: boolean
  label?: string
  className?: string
}

const WhatsAppInput = ({ 
  value, 
  onChange, 
  required = false,
  label = "WhatsApp Number",
  className = ""
}: WhatsAppInputProps) => {
  const [displayValue, setDisplayValue] = useState(value)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setDisplayValue(formatPhoneNumberDisplay(value))
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, '')
    onChange(newValue)
    setError(getWhatsAppError(newValue))
  }

  const handleBlur = () => {
    setError(getWhatsAppError(value))
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor="whatsapp">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id="whatsapp"
        type="tel"
        placeholder="237 6XX XXX XXX"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={error ? 'border-red-500' : ''}
      />
      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default WhatsAppInput