export type Company = {
  id: string;
  number: number;
  name: string;
  about: string;
  website: string;
  tagline: string;
  sector: string;
  jobCount: number;
};

export type Job = {
  id: string;
  companyId: string;
  company: string;
  number: number;
  title: string;
  hours: string;
  location: string;
  eligibility: string;
  category: string;
  seniority: string;
  description: string[];
  requirements: string[];
};

export type Centre = {
  name: string;
  address: string;
  mrt: string;
};

export type FairData = {
  event: {
    name: string;
    organizer: string;
    date: string;
    dateIso: string;
    day: string;
    venue: string;
    address: string;
    website: string;
    about: string;
  };
  centres: Centre[];
  hoursNote: string;
  companies: Company[];
  jobs: Job[];
};
