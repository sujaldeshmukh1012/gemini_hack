export interface VoiceAgentSettings {
  autoStart?: boolean;
}

const STORAGE_KEY = 'voice-agent-settings';

export const loadVoiceAgentSettings = (): VoiceAgentSettings => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as VoiceAgentSettings;
  } catch {
    return {};
  }
};

export const saveVoiceAgentSettings = (settings: VoiceAgentSettings) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent('voice-agent-settings-updated'));
};

