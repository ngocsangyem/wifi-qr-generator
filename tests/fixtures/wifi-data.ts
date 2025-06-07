import type { EncryptionType } from '../../src/types';

export const wifiTestData = {
  // Standard WPA/WPA2 network
  wpaNetwork: {
    ssid: 'TestWiFiNetwork',
    encryptionType: 'WPA/WPA2' as EncryptionType,
    password: 'testpassword123',
    expectedQRString: 'WIFI:S:TestWiFiNetwork;T:WPA;P:testpassword123;;',
  },

  // WEP network
  wepNetwork: {
    ssid: 'OldWiFiNetwork',
    encryptionType: 'WEP' as EncryptionType,
    password: 'wepkey123',
    expectedQRString: 'WIFI:S:OldWiFiNetwork;T:WEP;P:wepkey123;;',
  },

  // Open network (no password)
  openNetwork: {
    ssid: 'FreeWiFi',
    encryptionType: 'None' as EncryptionType,
    password: '',
    expectedQRString: 'WIFI:S:FreeWiFi;T:nopass;P:;;',
  },

  // Network with special characters
  specialCharsNetwork: {
    ssid: 'WiFi-Network_2024!',
    encryptionType: 'WPA/WPA2' as EncryptionType,
    password: 'P@ssw0rd!2024',
    expectedQRString: 'WIFI:S:WiFi-Network_2024!;T:WPA;P:P@ssw0rd!2024;;',
  },

  // Vietnamese network
  vietnameseNetwork: {
    ssid: 'MạngWiFiViệtNam',
    encryptionType: 'WPA/WPA2' as EncryptionType,
    password: 'mậtkhẩu123',
    expectedQRString: 'WIFI:S:MạngWiFiViệtNam;T:WPA;P:mậtkhẩu123;;',
  },

  // Long SSID and password
  longNetwork: {
    ssid: 'VeryLongWiFiNetworkNameThatExceedsNormalLength',
    encryptionType: 'WPA/WPA2' as EncryptionType,
    password: 'VeryLongPasswordThatIsMoreThan32Characters',
    expectedQRString: 'WIFI:S:VeryLongWiFiNetworkNameThatExceedsNormalLength;T:WPA;P:VeryLongPasswordThatIsMoreThan32Characters;;',
  },

  // Empty SSID (invalid case)
  emptySSID: {
    ssid: '',
    encryptionType: 'WPA/WPA2' as EncryptionType,
    password: 'password123',
    expectedQRString: '',
  },
};

export const translations = {
  en: {
    appTitle: 'Wi-Fi QR Generator',
    ssidLabel: 'Wi-Fi Name (SSID)',
    encryptionLabel: 'Encryption Type',
    passwordLabel: 'Password',
    saveImageButton: 'Save as Image',
    printButton: 'Print',
    qrTitle: 'Connect to Wi-Fi',
    ssidPlaceholder: 'Enter Wi-Fi name',
    passwordPlaceholder: 'Enter password',
    encryptionPlaceholder: 'Select encryption type',
  },
  vi: {
    appTitle: 'Tạo Mã QR Wi-Fi',
    ssidLabel: 'Tên Wi-Fi (SSID)',
    encryptionLabel: 'Loại Mã Hóa',
    passwordLabel: 'Mật Khẩu',
    saveImageButton: 'Lưu Hình Ảnh',
    printButton: 'In',
    qrTitle: 'Kết Nối Wi-Fi',
    ssidPlaceholder: 'Nhập tên Wi-Fi',
    passwordPlaceholder: 'Nhập mật khẩu',
    encryptionPlaceholder: 'Chọn loại mã hóa',
  },
};

export const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1024, height: 768 },
  large: { width: 1440, height: 900 },
};

export const encryptionOptions = {
  'WPA/WPA2': 'WPA/WPA2',
  'WEP': 'WEP',
  'None': 'None',
};

export const languages = {
  english: { code: 'en', name: 'English', flag: '🇺🇸' },
  vietnamese: { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
};
