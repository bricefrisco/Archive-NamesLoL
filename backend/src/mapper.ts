import { Region, SummonerEntity } from "./dynamo-db";
import { SummonerDTO } from "./riot-api";

export interface DynamoItem {
  r: string;
  aid: string;
  rd: number;
  l: number;
  ad: number;
  n: string;
  ld: number;
}

interface DynamoLastEvaluatedKey {
  ad: number;
  r: string;
  n: string;
}

export interface DynamoSummonerList {
  Items: DynamoItem[];
  Count: number;
  ScannedCount: number;
  LastEvaluatedKey: DynamoLastEvaluatedKey;
}

const calcAvailabilityDate = (
  revisionDate: number,
  summonerLevel: number
): number => {
  const date = new Date(revisionDate);
  if (summonerLevel <= 6)
    return new Date(date.setMonth(date.getMonth() + 6)).valueOf();
  if (summonerLevel >= 30)
    return new Date(date.setMonth(date.getMonth() + 30)).valueOf();
  return new Date(date.setMonth(date.getMonth() + summonerLevel)).valueOf();
};

export const mapSummoners = (dynamoResponse: DynamoSummonerList) => {
  const summoners = dynamoResponse.Items.sort((a, b) => a.ad - b.ad).map(
    (i) => ({
      region: i.r,
      accountId: i.aid,
      revisionDate: i.rd,
      level: i.l,
      availabilityDate: i.ad,
      name: i.n.split("#")[1].toLowerCase(),
      lastUpdated: i.ld,
    })
  );

  return {
    summoners,
    forwards:
      summoners &&
      summoners.length > 0 &&
      summoners[summoners.length - 1].availabilityDate,
    backwards:
      summoners && summoners.length > 0 && summoners[0].availabilityDate,
  };
};

export const mapRegion = (region: string): Region => {
  if (region === undefined || region === null || region === "")
    return undefined;
  switch (region.toUpperCase()) {
    case "NA":
      return Region.NA;
    case "BR":
      return Region.BR;
    case "EUNE":
      return Region.EUNE;
    case "EUW":
      return Region.EUW;
    case "KR":
      return Region.KR;
    case "LAN":
      return Region.LAN;
    case "LAS":
      return Region.LAS;
    case "TR":
      return Region.TR;
    default:
      return undefined;
  }
};

export const mapSummoner = (
  summoner: SummonerDTO,
  region: Region
): SummonerEntity => {
  return {
    ...summoner,
    region,
    level: summoner.summonerLevel,
    availabilityDate: calcAvailabilityDate(
      summoner.revisionDate,
      summoner.summonerLevel
    ),
    lastUpdated: new Date().valueOf(),
  };
};
