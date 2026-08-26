"use client";

import { useCallback, useEffect, useState } from "react";
import { isMuted, subscribeSound, toggleMuted, setMuted } from "@/lib/sound/sound-store";

// Hook untuk membaca/mengubah status suara global (mute/unmute).
export function useSound() {
  const [muted, setMutedState] = useState(isMuted());

  useEffect(() => {
    return subscribeSound(() => setMutedState(isMuted()));
  }, []);

  const toggle = useCallback(() => {
    toggleMuted();
  }, []);

  return { muted, toggleMute: toggle, setMuted };
}
