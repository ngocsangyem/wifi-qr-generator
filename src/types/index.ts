export type EncryptionType = 'WPA/WPA2' | 'WEP' | 'None'

export interface WifiCredentials {
  ssid: string
  encryptionType: EncryptionType
  password: string
}

export interface QRCodeData {
  ssid: string
  encryptionType: string
  password: string
  qrString: string
}

export type Theme = 'light' | 'dark' | 'system'

export type Locale = 'en' | 'vi'
