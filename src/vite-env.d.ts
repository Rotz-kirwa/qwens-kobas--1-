/// <reference types="vite/client" />

interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleAccountsIdConfiguration {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  context?: string;
  ux_mode?: string;
}

interface GoogleAccountsIdPromptMomentNotification {
  isNotDisplayed?: () => boolean;
  isSkippedMoment?: () => boolean;
}

interface Window {
  google?: {
    accounts?: {
      id?: {
        initialize: (config: GoogleAccountsIdConfiguration) => void;
        renderButton: (
          parent: HTMLElement,
          options: Record<string, string | number | boolean>
        ) => void;
        prompt: (listener?: (notification: GoogleAccountsIdPromptMomentNotification) => void) => void;
      };
    };
  };
}
