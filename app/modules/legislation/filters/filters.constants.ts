export const ALLOWED_GPT_TAGS = [
  "Education",
  "Democracy",
  "Health Care",
  "Public Safety",
  "Transit",
  "Abortion",
  "Immigration",
  "Foreign Policy",
  "States Rights",
  "Civil Rights",
  "Climate Change",
  "City Ordinances",
  "Other",
];

export const AVAILABLE_TAGS = [...ALLOWED_GPT_TAGS, "City Ordinances"];

export enum RepLevel {
  City = "city",
  County = "county",
  State = "state",
  National = "national",
}

export enum SupportedLocale {
  Chicago = "Chicago",
  Illinois = "Illinois",
  USA = "USA",
  Custom = "Custom",
}
