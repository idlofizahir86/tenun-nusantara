"use client";

import { useCallback, useEffect, useState } from "react";
import {
  isDemo,
  setDemo,
  checkDemoPassword,
  triggerDemoSkip,
  getDemoSkip,
  subscribeDemo,
  isDemoInstant,
  setDemoInstant as setDemoInstantStore,
} from "@/lib/demo/demo-store";

// Hook untuk membaca/mengubah Live Demo Mode secara reaktif.
export function useDemo() {
  const [demo, setOn] = useState(isDemo());
  const [skip, setSkip] = useState(getDemoSkip());
  const [demoInstant, setInstant] = useState(isDemoInstant());

  useEffect(() => {
    return subscribeDemo(() => {
      setOn(isDemo());
      setSkip(getDemoSkip());
      setInstant(isDemoInstant());
    });
  }, []);

  const enable = useCallback((pw: string): boolean => {
    if (!checkDemoPassword(pw)) return false;
    setDemo(true);
    return true;
  }, []);

  const disable = useCallback(() => setDemo(false), []);

  const setDemoInstant = useCallback((on: boolean) => setDemoInstantStore(on), []);

  const triggerSkip = useCallback(() => triggerDemoSkip(), []);

  return { demo, skip, demoInstant, enable, disable, setDemoInstant, triggerSkip };
}
