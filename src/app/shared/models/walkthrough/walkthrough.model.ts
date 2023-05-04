export interface Walkthrough {
  count?: number;
  title: string;
  description: string;
  stepper: number;
}

export interface SetWalkthroughVisible {
  isMemberAdded: boolean;
  stepper: number;
}
