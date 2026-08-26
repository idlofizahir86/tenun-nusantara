export interface TelemetryEvent {
  id: string;
  userId: string;
  islandId: string;
  actNumber: number;
  nodeId: string;
  eventType: "choice" | "latency" | "revision" | "hint" | "completion" | "reflection";
  data: Record<string, any>;
  timestamp: Date;
}

export interface ChoiceEvent extends TelemetryEvent {
  eventType: "choice";
  data: {
    choiceId: string;
    choiceText: string;
    timeSpent: number; // milliseconds
  };
}

export interface LatencyEvent extends TelemetryEvent {
  eventType: "latency";
  data: {
    duration: number; // milliseconds
    context: string;
  };
}

export interface RevisionEvent extends TelemetryEvent {
  eventType: "revision";
  data: {
    fromChoiceId: string;
    toChoiceId: string;
    revisionCount: number;
  };
}