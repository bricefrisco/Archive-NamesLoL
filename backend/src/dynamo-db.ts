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
    level: number
}

AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET
})

const client = new AWS.DynamoDB.DocumentClient();

export const querySummoners = (region: Region, lastItem?: any) => {
    return new Promise((res, rej) => {
        client.query({
            TableName: 'lol-summoners',
            Limit: 20,
            ExpressionAttributeValues: {
                ':region': region
            },
            ExclusiveStartKey: lastItem,
            KeyConditionExpression: 'r = :region',
            IndexName: 'region-activation-date-index'
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
            n: summoner.region + '-' + summoner.name.toLowerCase(),
            ad: summoner.availabilityDate
        },
        ExpressionAttributeValues: {
            ':r': summoner.region,
            ':aid': summoner.accountId,
            ':rd': summoner.revisionDate,
            ':l': summoner.level
        },
        UpdateExpression: 'set r = :r, aid = :aid, rd = :rd, l = :l'
    }, (err, data) => {
        if (err) console.log(err)
        else console.log('Successfully updated summoner in DynamoDB:', summoner.region + '-' + summoner.name)
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