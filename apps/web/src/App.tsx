import { useEffect, useState } from 'react';
import { pingDirectus } from './lib/directus';

type ConnectionStatus = 'checking' | 'connected' | 'failed';

const DEFAULT_ERROR_MESSAGE = 'Die Verbindung zu Directus konnte nicht hergestellt werden.';

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE;

export const App = (): React.JSX.Element => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('checking');
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    let isMounted = true;

    const checkConnection = async (): Promise<void> => {
      try {
        await pingDirectus();
        if (isMounted) {
          setConnectionStatus('connected');
        }
      } catch (error) {
        if (isMounted) {
          setConnectionStatus('failed');
          setErrorMessage(getErrorMessage(error));
        }
      }
    };

    void checkConnection();

    return () => {
      isMounted = false;
    };
  }, []);

  if (connectionStatus === 'checking') {
    return <main className="connection-status">Directus-Verbindung wird geprueft ...</main>;
  }

  if (connectionStatus === 'failed') {
    return (
      <main className="connection-status connection-status--failed">
        <p>Directus nicht erreichbar.</p>
        <p>{errorMessage}</p>
      </main>
    );
  }

  return <main className="connection-status connection-status--connected">✅ Directus erreichbar</main>;
};