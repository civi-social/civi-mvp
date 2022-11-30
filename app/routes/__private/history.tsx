/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "fs";
import path from "path";
import { parseFile } from "fast-csv";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUser } from "~/session.server";
import type { VoteRecord, VoterInfo } from "~/entities/voter";

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  info?: VoterInfo | null;
  history: VoteRecord[];
};

const historyCsvPath = path.resolve("csvs/district_13_history.csv");
const historyJsonPath = path.resolve("csvs/district_13_history.json");
const votersCsvPath = path.resolve("csvs/district_13_voters.csv");
const votersJsonPath = path.resolve("csvs/district_13_voters.json");

const loadVoteHistory = (): Promise<VoteRecord[]> => {
  return new Promise((resolve, reject) => {
    fs.readFile(historyJsonPath, "utf-8", (err, data) => {
      if (!err && data) {
        resolve(JSON.parse(data));
      } else {
        const voteHistory: VoteRecord[] = [];
        parseFile(historyCsvPath)
          .on("error", reject)
          .on("data", (row: string[]) => {
            if (row[0]) {
              const [, suid, electionDate, electionType, party] = row;
              voteHistory.push({
                suid,
                electionDate,
                electionType,
                party,
              });
            }
          })
          .on("end", (rowCount: number) => {
            console.log(`Parsed history ${rowCount} rows`);
            fs.writeFileSync(historyJsonPath, JSON.stringify(voteHistory));
            resolve(voteHistory);
          });
      }
    });
  });
};

const loadVoters = (): Promise<VoterInfo[]> => {
  return new Promise((resolve, reject) => {
    fs.readFile(votersJsonPath, "utf-8", (err, data) => {
      if (!err && data) {
        resolve(JSON.parse(data));
      } else {
        const allVoters: VoterInfo[] = [];
        parseFile(votersCsvPath)
          .on("error", reject)
          .on("data", (row: string[]) => {
            if (row[0]) {
              const [
                id,
                suid,
                jurisdictionId,
                lastName,
                firstName,
                middleName,
                nameSuffix,
                registrationDate,
                age,
                dateModified,
                status,
                sex,
                telephone,
                voteHouseNumber,
                votePreDirection,
                voteStreetName,
                voteStreetType,
                votePostDirection,
                voteAddress,
                voteCity,
                voteState,
                voteZip,
                address1,
                address2,
                address3,
                mailLine1,
                mailLine2,
                mailLine3,
                mailCity,
                mailState,
                mailZip,
                mailCountry,
                emailAddress,
              ] = row;
              allVoters.push({
                suid,
                firstName,
                lastName,
                middleName,
                nameSuffix,
                voteAddress,
              });
            }
          })
          .on("end", (rowCount: number) => {
            console.log(`Parsed voters ${rowCount} rows`);
            fs.writeFileSync(votersJsonPath, JSON.stringify(allVoters));
            resolve(allVoters);
          });
      }
    });
  });
};

const areEqual = (a: string, b: string) =>
  a.trim().localeCompare(b.trim(), "en", { sensitivity: "base" }) === 0;

export const loader: LoaderFunction = async ({ request }) => {
  let voteHistory: VoteRecord[] = [];
  let allVoters: VoterInfo[] = [];

  const user = await getUser(request);

  if (!user) {
    return json<LoaderData>({
      user: null,
      info: null,
      history: [],
    });
  }
  if (
    // if a file doesn't exist
    ![historyCsvPath, historyJsonPath, votersCsvPath, votersJsonPath].every(
      fs.existsSync
    )
  ) {
    return json<LoaderData>({
      user,
      info: null,
      history: [],
    });
  }

  try {
    if (allVoters.length === 0) {
      allVoters = await loadVoters();
    }
  } catch (error) {
    console.warn("failed in loading voters:", error);
  }

  try {
    if (voteHistory.length === 0) {
      voteHistory = await loadVoteHistory();
    }
  } catch (error) {
    console.warn("failed in loading vote history:", error);
  }

  const info = allVoters.find(
    ({ firstName, lastName, voteAddress }) =>
      (areEqual(firstName, user.firstName) &&
        areEqual(lastName, user.lastName)) ||
      areEqual(voteAddress, user.address)
  );
  const history = info?.suid
    ? voteHistory.filter(({ suid }) => suid === info.suid)
    : [];
  return json<LoaderData>({ user, info, history });
};

export default function VoteHistory() {
  const data = useLoaderData<LoaderData>();
  return (
    <>
      {data.history.length > 0 && (
        <div className="w-full max-w-5xl p-4">
          <h2 className="mt-6 text-xl font-bold">Your vote history</h2>
          <div className="overflow-x-auto">
            <table className="table-zebra mt-4 table w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>Election Date</th>
                  <th>Election Type</th>
                  <th>Party</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800">
                {data.history.map(
                  ({ electionDate, electionType, party }, i) => (
                    <tr key={i}>
                      <th>{i + 1}</th>
                      <td>{electionDate}</td>
                      <td>{electionType}</td>
                      <td>{party}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
