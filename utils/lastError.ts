import { Storage } from './storage';

export const LAST_MODEL_ERROR_KEY = 'offline-ai-chat:last-model-error';

export interface SavedModelError {
  stage: string;
  message: string;
  stack: string;
  at: string;
}

export async function saveLastModelError(stage: string, error: unknown): Promise<void> {
  try {
    const message =
      error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    const stack =
      error instanceof Error && error.stack ? error.stack.slice(0, 2000) : '';
    await Storage.setItem(
      LAST_MODEL_ERROR_KEY,
      JSON.stringify({ stage, message, stack, at: new Date().toISOString() }),
    );
  } catch {
    // Diagnostics must never break the app.
  }
}

export async function readLastModelError(): Promise<SavedModelError | null> {
  try {
    const raw = await Storage.getItem(LAST_MODEL_ERROR_KEY);
    return raw ? (JSON.parse(raw) as SavedModelError) : null;
  } catch {
    return null;
  }
}

export async function clearLastModelError(): Promise<void> {
  try {
    await Storage.removeItem(LAST_MODEL_ERROR_KEY);
  } catch {
    // ignore
  }
}
