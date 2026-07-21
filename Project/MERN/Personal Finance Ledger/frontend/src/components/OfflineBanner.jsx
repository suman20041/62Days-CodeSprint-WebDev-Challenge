import { useEffect, useState } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus.js';
import { getQueue, flushQueue } from '../utils/offlineQueue.js';
import client from '../api/client.js';

export default function OfflineBanner() {
  const online = useOnlineStatus();
  const [queueSize, setQueueSize] = useState(getQueue().length);

  useEffect(() => {
    const interval = setInterval(() => setQueueSize(getQueue().length), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (online && queueSize > 0) {
      flushQueue(client).then(() => setQueueSize(getQueue().length));
    }
  }, [online]); // eslint-disable-line react-hooks/exhaustive-deps

  if (online && queueSize === 0) return null;

  return (
    <div className="offline-banner">
      {online
        ? `Back online — syncing ${queueSize} queued change(s)...`
        : `You are offline. ${queueSize} change(s) will sync automatically when you reconnect.`}
    </div>
  );
}
