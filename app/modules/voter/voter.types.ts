export type VoterInfo = {
  suid: string;
  firstName: string;
  lastName: string;
  middleName: string;
  nameSuffix: string;
  voteAddress: string;
};

export type VoteRecord = {
  suid: string;
  electionDate: string;
  electionType: string;
  party: string;
};
