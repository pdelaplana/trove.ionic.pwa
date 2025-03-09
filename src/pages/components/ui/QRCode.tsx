import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';

const SCANNER_APP_URL = import.meta.env.VITE_SCANNER_APP_URL;

interface QRCodeProps {
  value: Record<string, any>;
  url?: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  bgColor?: string;
  fgColor?: string;
  refreshInterval?: number;
}

const QRCode: React.FC<QRCodeProps> = ({
  value,
  url,
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
    const params = new URLSearchParams();

    // Iterate through all properties in the value object
    Object.entries(value).forEach(([key, val]) => {
      // Only append if the value is not null or undefined
      if (val != null) {
        params.append(key.toLowerCase(), val.toString());
      }
    });

    // You can add more parameters as needed
    params.append('timestamp', Date.now().toString());

    return `${url}?${params.toString()}`;
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
