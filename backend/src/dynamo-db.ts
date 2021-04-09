import AWS from 'aws-sdk'
import dotenv from "dotenv";

dotenv.config()

export enum Region {
    NA = 'na',
    BR = 'br',
    EUNE = 'eune',
    EUW = 'euw',
    JP = 'jp',
    KR = 'kr',
    LAN = 'lan',
    LAS = 'las',
    OCE = 'oce',
    TR = 'tr',
    RU = 'ru'
}

export interface SummonerEntity {
    name: string,
    region: Region,
    accountId: string,
    revisionDate: number,
    availabilityDate: number
    level: number,
    lastUpdated: number
}

AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET
})

const client = new AWS.DynamoDB.DocumentClient();

export const querySummoners = (region: Region, timestamp: number, backwards: boolean) => {
    return new Promise((res, rej) => {
        client.query({
            TableName: 'lol-summoners',
            Limit: 50,
            ExpressionAttributeValues: {
                ':region': region.toUpperCase(),
                ':timestamp': timestamp,
            },
            KeyConditionExpression: backwards ? 'r = :region and ad <= :timestamp' : 'r = :region and ad >= :timestamp',
            IndexName: 'region-activation-date-index',
            ScanIndexForward: !backwards
        }, (err, data) => {
            if (err) rej(err)
            else res(data)
        })
    })
}

export const querySummonersByNameSize = (region: Region, timestamp: number, backwards: boolean, nameSize: number) => {
    return new Promise((res, rej) => {
        client.query({
            TableName: 'lol-summoners',
            Limit: 50,
            ExpressionAttributeValues: {
                ':nameLength': region.toUpperCase() + '#' + nameSize,
                ':timestamp': timestamp
            },
            KeyConditionExpression: backwards ? 'nl = :nameLength and ad <= :timestamp' : 'nl = :nameLength and ad >= :timestamp',
            IndexName: 'name-length-availability-date-index',
            ScanIndexForward: !backwards
        }, (err, data) => {
            if (err) rej(err)
            else res(data)
        })
    })
}

export const updateSummoner = (summoner: SummonerEntity): void => {
    client.update({
        TableName: 'lol-summoners',
        Key: {
            n: summoner.region.toUpperCase() + '#' + summoner.name.toUpperCase(),
        },
        ExpressionAttributeValues: {
            ':ad': summoner.availabilityDate,
            ':r': summoner.region.toUpperCase(),
            ':aid': summoner.accountId,
            ':rd': summoner.revisionDate,
            ':l': summoner.level,
            ':nl': summoner.region.toUpperCase() + '#' + summoner.name.length,
            ':ld': summoner.lastUpdated
        },
        UpdateExpression: 'set ad = :ad, r = :r, aid = :aid, rd = :rd, l = :l, nl = :nl, ld = :ld'
    }, (err, data) => {
        if (err) console.log(err)
        else console.log('Successfully updated summoner in DynamoDB:', summoner.region.toUpperCase() + '#' + summoner.name.toUpperCase())
    })
}

export const deleteSummoner = (name: string, region: Region) => {
    return new Promise<void>((res, rej) => {
        client.delete({
            TableName: 'lol-summoners',
            Key: {name, region},
        }, (err, data) => {
            if (err) rej(err)
            else res()
        })
    })
}