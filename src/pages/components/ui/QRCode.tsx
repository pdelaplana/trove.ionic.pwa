import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';

const SCANNER_APP_URL = import.meta.env.VITE_SCANNER_APP_URL;

interface QRCodeProps {
  value: Record<string, any>;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  bgColor?: string;
  fgColor?: string;
  refreshInterval?: number;
}

const QRCode: React.FC<QRCodeProps> = ({
  value,
  size = 256,
  level = 'M',
  bgColor = '#FFFFFF',
  fgColor = '#000000',
  refreshInterval = 30000,
}) => {
  const [securedValue, setSecuredValue] = useState<string>('');
  const [timestamp, setTimestamp] = useState<number>(Date.now());
  const [remainingTime, setRemainingTime] = useState(0);

  // Build the deep link URL
  const getDeepLinkUrl = () => {
    const baseUrl = import.meta.env.VITE_SCANNER_APP_URL; // Your base URL
    const path = 'scan'; // Your deep link path
    const params = new URLSearchParams();

    const memberno = value.memberno ?? '';
    const businessId = value.businessid ?? '';
    params.append('memberno', memberno);
    params.append('businessId', businessId);

    // You can add more parameters as needed
    params.append('timestamp', Date.now().toString());

    return `${baseUrl}/${path}?${params.toString()}`;
  };

  const timeUntilRefresh = () => {
    const elapsed = Date.now() - timestamp;
    const remaining = Math.max(0, refreshInterval - elapsed);
    return Math.ceil(remaining / 1000);
  };

  const generateSecuredValue = (value: string) => {
    const currentTime = Date.now();
    const payload = {
      cid: value,
      ts: currentTime,
      // Add additional security measures here if needed
    };
    setSecuredValue(JSON.stringify(payload));
    setTimestamp(currentTime);
  };

  useEffect(() => {
    setSecuredValue(getDeepLinkUrl());
    const interval = setInterval(() => {
      setSecuredValue(getDeepLinkUrl());
    }, refreshInterval);
    return () => clearInterval(interval);
  }, [value, refreshInterval]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(timeUntilRefresh());
    }, 1000);
    return () => clearInterval(timer);
  }, [timestamp]);

  return (
    <div className='ion-text-center'>
      <QRCodeSVG
        value={securedValue}
        size={size}
        level={level}
        bgColor={bgColor}
        fgColor={fgColor}
      />
      <p>
        Code refreshes in: <strong>{remainingTime}s</strong>
      </p>
    </div>
  );
};

export default QRCode;
