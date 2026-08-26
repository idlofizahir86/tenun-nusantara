"use client";

import type { MinigamePayload } from "@/types/game";
import { MinigameObserve } from "./minigame-observe";
import { MinigamePuzzle } from "./minigame-puzzle";
import { MinigamePuzzle16 } from "./minigame-puzzle16";
import { MinigamePipe } from "./minigame-pipe";
import { MinigamePattern } from "./minigame-pattern";
import { MinigameChoice } from "./minigame-choice";
import { MinigameSequence } from "./minigame-sequence";
import { MinigameMatch } from "./minigame-match";
import { MinigameBarter } from "./minigame-barter";
import { MinigameTune } from "./minigame-tune";
import { MinigameStage } from "./minigame-stage";
import { MinigameMediate } from "./minigame-mediate";
import { MinigameFilter } from "./minigame-filter";
import { MinigameWeave } from "./minigame-weave";
import { MinigameVerse } from "./minigame-verse";
import { ResumeKeyProvider } from "@/hooks/use-resume";

interface Props {
  game: MinigamePayload;
  onProgress: () => void;
  onComplete: () => void;
  onWrong?: (detail?: string) => void;
  resumeKey?: string;
}

export function Minigame({ game, onProgress, onComplete, onWrong, resumeKey = "default" }: Props) {
  let content: React.ReactNode;
  if (game.type === "observe") {
    content = <MinigameObserve game={game} onProgress={onProgress} onComplete={onComplete} onWrong={onWrong} />;
  } else if (game.type === "puzzle") {
    content = <MinigamePuzzle game={game} onProgress={onProgress} onComplete={onComplete} onWrong={onWrong} />;
  } else if (game.type === "puzzle16") {
    content = <MinigamePuzzle16 game={game} onProgress={onProgress} onComplete={onComplete} onWrong={onWrong} />;
  } else if (game.type === "pipe") {
    content = <MinigamePipe game={game} onProgress={onProgress} onComplete={onComplete} onWrong={onWrong} />;
  } else if (game.type === "pattern") {
    content = <MinigamePattern game={game} onProgress={onProgress} onComplete={onComplete} onWrong={onWrong} />;
  } else if (game.type === "choice") {
    content = <MinigameChoice game={game} onProgress={onProgress} onComplete={onComplete} onWrong={onWrong} />;
  } else if (game.type === "sequence") {
    content = <MinigameSequence game={game} onProgress={onProgress} onComplete={onComplete} onWrong={onWrong} />;
  } else if (game.type === "match") {
    content = <MinigameMatch game={game} onProgress={onProgress} onComplete={onComplete} onWrong={onWrong} />;
  } else if (game.type === "barter") {
    content = <MinigameBarter game={game} onProgress={onProgress} onComplete={onComplete} onWrong={onWrong} />;
  } else if (game.type === "tune") {
    content = <MinigameTune game={game} onProgress={onProgress} onComplete={onComplete} onWrong={onWrong} />;
  } else if (game.type === "stage") {
    content = <MinigameStage game={game} onProgress={onProgress} onComplete={onComplete} onWrong={onWrong} />;
  } else if (game.type === "mediate") {
    content = <MinigameMediate game={game} onProgress={onProgress} onComplete={onComplete} onWrong={onWrong} />;
  } else if (game.type === "filter") {
    content = <MinigameFilter game={game} onProgress={onProgress} onComplete={onComplete} onWrong={onWrong} />;
  } else if (game.type === "weave") {
    content = <MinigameWeave game={game} onProgress={onProgress} onComplete={onComplete} onWrong={onWrong} />;
  } else if (game.type === "verse") {
    content = <MinigameVerse game={game} onProgress={onProgress} onComplete={onComplete} onWrong={onWrong} />;
  } else {
    return null;
  }
  return <ResumeKeyProvider value={resumeKey}>{content}</ResumeKeyProvider>;
}
