export type IslandId = "candi" | "terapung" | "rimba" | "harmoni" | "aksara";

export type ActNumber = 1 | 2 | 3;

export interface StoryChoice {
  id: string;
  text: string;
  nextNode: string;
  telemetry?: {
    trait: string;
    weight: number;
  };
}

export interface StoryNode {
  id: string;
  type: "narrative" | "choice" | "minigame" | "reflection";
  text?: string;
  choices?: StoryChoice[];
  minigameId?: string;
  reflectionPrompt?: string;
}

export interface IslandStory {
  id: IslandId;
  name: string;
  description: string;
  acts: {
    act1: StoryNode[];
    act2: StoryNode[];
    act3: StoryNode[];
  };
  reflectionQuestions: string[];
  reward: {
    motifId: string;
    badgeId: string;
  };
}