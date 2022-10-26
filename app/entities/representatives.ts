export interface OfficialOffice {
  office: Office;
  official: Official;
}

export interface RepresentativesResult {
  normalizedInput: GoogleRepresentativesResponse['normalizedInput'];
  offices: {
    national: OfficialOffice[];
    state: OfficialOffice[];
    county: OfficialOffice[];
    city: OfficialOffice[];
  };
}

export type Levels =
  | 'international'
  | 'country' // national reps
  | 'administrativeArea1' // state reps
  | 'administrativeArea2' // county reps
  | 'locality' // city reps
  | 'regional'
  | 'special'
  | 'subLocality1'
  | 'subLocality2';

export interface Office {
  name: string;
  divisionId: string;
  levels: [Levels];
  roles: [string];
  sources: [
    {
      name: string;
      official: boolean;
    }
  ];
  officialIndices: [number];
}

export interface Official {
  name: string;
  address: [
    {
      locationName: string;
      line1: string;
      line2: string;
      line3: string;
      city: string;
      state: string;
      zip: string;
    }
  ];
  party: string;
  phones: [string];
  urls: [string];
  photoUrl: string;
  emails: [string];
  channels: [
    {
      type: string;
      id: string;
    }
  ];
}

export interface GoogleRepresentativesResponse {
  kind: 'civicinfo#representativeInfoResponse';
  normalizedInput: {
    locationName: string;
    line1: string;
    line2: string;
    line3: string;
    city: string;
    state: string;
    zip: string;
  };
  divisions: {
    [key: string]: {
      name: string;
      alsoKnownAs: [string];
      officeIndices: [number];
    };
  };
  offices: [Office];
  officials: [Official];
}

export const transformGoogleCivicInfo = (
  data: GoogleRepresentativesResponse
): RepresentativesResult => {
  const offices = data.offices
    .map((office) => {
      return office.officialIndices.map((index) => ({
        official: data.officials[index],
        office,
      }));
    })
    .flat()
    .reverse();

  const response: RepresentativesResult = {
    normalizedInput: data.normalizedInput,
    offices: {
      city: offices.filter((off) => off.office.levels[0] === 'locality'),
      county: offices.filter(
        (off) => off.office.levels[0] === 'administrativeArea2'
      ),
      state: offices.filter(
        (off) => off.office.levels[0] === 'administrativeArea1'
      ),
      national: offices.filter((off) => off.office.levels[0] === 'country'),
    },
  };
  return response;
};
