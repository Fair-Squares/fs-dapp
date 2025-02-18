import { CouncilContextInterface } from './types';

export const defaultCouncilContext: CouncilContextInterface = {
  members: [],
  totalProposals: 0,
  proposals: [],
  fetchCouncilVotes: async () => null,
  isCouncilMember: () => false,
};
