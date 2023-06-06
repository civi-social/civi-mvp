import React from "react";

const chicago_neighborhoods = [
  "Albany Park",
  "Andersonville",
  "Arcadia Terrace",
  "Archer Heights",
  "Armour Square",
  "Ashburn",
  "Auburn Gresham",
  "Austin",
  "Avalon Park",
  "Avondale",
  "Back of the Yards",
  "Belmont Central",
  "Beverly",
  "Boystown",
  "Bridgeport",
  "Brighton Park",
  "Bronzeville",
  "Bucktown",
  "Burnside",
  "Calumet Heights",
  "Canaryville",
  "Chatham",
  "Chicago Lawn",
  "Chinatown",
  "Clearing",
  "Cottage Grove Heights",
  "DePaul",
  "Douglas Park",
  "Dunning",
  "East Garfield Park",
  "East Side",
  "Edgewater",
  "Edison Park",
  "Englewood",
  "Forest Glen",
  "Fuller Park",
  "Gage Park",
  "Galewood",
  "Garfield Ridge",
  "Gold Coast",
  "Goose Island",
  "Grand Boulevard",
  "Greater Grand Crossing",
  "Greektown",
  "Hegewisch",
  "Hermosa",
  "Humboldt Park",
  "Hyde Park",
  "Irving Park",
  "Jackson Park Highlands",
  "Jefferson Park",
  "Kenwood",
  "Lake View",
  "Lincoln Park",
  "Lincoln Square",
  "Little Italy",
  "Little Village",
  "Logan Square",
  "Loop",
  "Lower West Side",
  "Magnificent Mile",
  "Marquette Park",
  "McKinley Park",
  "Montclare",
  "Morgan Park",
  "Mount Greenwood",
  "Near North Side",
  "Near South Side",
  "Near West Side",
  "New City",
  "Noble Square",
  "North Center",
  "North Lawndale",
  "North Park",
  "Norwood Park",
  "Old Town",
  "Pilsen",
  "Portage Park",
  "Printer's Row",
  "Pullman",
  "Ravenswood",
  "River North",
  "Riverdale",
  "Rogers Park",
  "Roscoe Village",
  "Roseland",
  "South Chicago",
  "South Deering",
  "South Lawndale",
  "South Loop",
  "South Shore",
  "Streeterville",
  "The Bush",
  "Ukrainian Village",
  "Uptown",
  "Washington Heights",
  "Washington Park",
  "West Elsdon",
  "West Englewood",
  "West Garfield Park",
  "West Lawn",
  "West Loop",
  "West Pullman",
  "West Ridge",
  "West Town",
  "Wicker Park",
  "Woodlawn",
  "Wrigleyville",
] as const;

const ELIGIBLE_NEIGHBORHOODS = [
  "Andersonville",
  "Lincoln Square",
  "Edgewater",
  "Arcadia Terrace",
  "Bowmanville",
];

export const NewsletterForm = () => {
  const [isEligible, setIsEligible] = React.useState<"YES" | "NO">("NO");
  const setEligibility = (value: string) => {
    if (ELIGIBLE_NEIGHBORHOODS.some((v) => v === value)) {
      setIsEligible("YES");
    } else {
      setIsEligible("NO");
    }
  };
  return (
    <section className="flex flex-col items-center justify-center p-4">
      <h2 className="mb-2 text-center font-serif text-xl font-bold">
        Like what you see?
      </h2>
      <h3 className="text-center italic">
        Sign up! We need 500 people from the 40th Ward on our waiting list
      </h3>
      <form
        className="w-full max-w-sm justify-center"
        action="https://social.us11.list-manage.com/subscribe/post?u=5d27cdfc23603091d05858a9b&amp;id=e52325cbc0&amp;f_id=00f5a6e0f0"
        method="post"
      >
        <div className="flex flex-row flex-wrap items-center border-b border-secondary-400 py-2">
          <input
            className="mb-2 w-full appearance-none rounded-md border-none bg-gray-200 py-1 px-2 leading-tight text-gray-700 focus:outline-none"
            type="text"
            name="FNAME"
            placeholder="First Name"
            aria-label="First Name"
          />
          <input
            className="mb-2 w-full appearance-none rounded-md border-none bg-gray-200 py-1 px-2 leading-tight text-gray-700 focus:outline-none"
            type="text"
            name="LNAME"
            placeholder="Last Name"
            aria-label="Last Name"
          />
          <input
            className="mb-2 w-full appearance-none rounded-md border-none bg-gray-200 py-1 px-2 leading-tight text-gray-700 focus:outline-none"
            type="email"
            name="EMAIL"
            placeholder="E-mail Address"
            aria-label="E-mail Address"
          />
          <label className="block w-full" htmlFor="neighborhood">
            Select a neighborhood:
          </label>
          <select
            className="mb-6 w-full bg-gray-200 p-1 leading-tight"
            id="neighborhood"
            name="HOOD"
            onChange={(e) => {
              console.log(e.target.value);
              setEligibility(e.target.value);
            }}
          >
            {chicago_neighborhoods.map((neighborhood) => (
              <option key={neighborhood} value={neighborhood}>
                {neighborhood}
              </option>
            ))}
          </select>
          <input type="hidden" name="ELIGIBLE" value={isEligible} readOnly />

          <div
            style={{ position: "absolute", left: "-5000px" }}
            aria-hidden="true"
          >
            <input
              type="text"
              name="b_5d27cdfc23603091d05858a9b_e52325cbc0"
              tabIndex={-1}
              value=""
              readOnly
            />
          </div>
          <button
            className="mb-2 w-full flex-shrink-0 rounded border-4 border-secondary-400 bg-secondary-400 py-1 px-2 text-sm text-zinc-50 hover:border-secondary-200 hover:bg-secondary-200 hover:text-gray-800"
            type="submit"
            name="submit"
          >
            Sign Up For Our Waitlist
          </button>
        </div>
      </form>
    </section>
  );
};
