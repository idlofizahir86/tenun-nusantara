"use client";

import { useCallback, useEffect, useState } from "react";
import {
  isDemo,
  setDemo,
  checkDemoPassword,
  triggerDemoSkip,
  getDemoSkip,
  subscribeDemo,
} from "@/lib/demo/demo-store";

// Hook untuk membaca/mengubah Live Demo Mode secara reaktif.
export function useDemo() {
  const [demo, setOn] = useState(isDemo());
  const [skip, setSkip] = useState(getDemoSkip());

  useEffect(() => {
    return subscribeDemo(() => {
      setOn(isDemo());
      setSkip(getDemoSkip());
    });
  }, []);

  const enable = useCallback((pw: string): boolean => {
    if (!checkDemoPassword(pw)) return false;
    setDemo(true);
    return true;
  }, []);

  const disable = useCallback(() => setDemo(false), []);

  const triggerSkip = useCallback(() => triggerDemoSkip(), []);

  return { demo, skip, enable, disable, triggerSkip };
}
