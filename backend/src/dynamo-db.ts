import AWS from 'aws-sdk'
import dotenv from "dotenv";
dotenv.config()

export enum Region {
    NA = 'NA'
}

export interface SummonerEntity {
    name: string,
    region: Region,
    accountId: string,
    revisionDate: number,
    availabilityDate: number
}

AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET
})

const client = new AWS.DynamoDB.DocumentClient();

export const getSummoner = (name: string, region: Region) => {
    return new Promise((res, rej) => {
        client.query({
            TableName: 'lol-summoners',
            ExpressionAttributeNames: {
                '#name': 'name',
                '#region': 'region'
            },
            ExpressionAttributeValues: {
                ':name': name,
                ':region': region
            },
            KeyConditionExpression: '#name = :name and #region = :region',
        }, (err, data) => {
            if (err) rej(err)
            else res(data)
        })
    })
}

export const querySummoners = (name: string, region: Region) => {
    return new Promise((res, rej) => {
        client.get({
            TableName: 'lol-summoners',
            Key: {
                name,
                region
            }
        }, (err, data) => {
            if (err) rej(err)
            else res(data)
        })
    })
}

export const updateSummoner = (summoner: SummonerEntity) => {
    return new Promise<void>((res, rej) => {
        client.update({
            TableName: 'lol-summoners',
            Key: {n: summoner.name, r: summoner.region },
            ExpressionAttributeValues: {
                ':aid': summoner.accountId,
                ':rd': summoner.revisionDate,
                ':ad': summoner.availabilityDate
            },
            UpdateExpression: 'set aid = :aid, rd = :rd, ad = :ad'
        }, (err, data) => {
            if (err) rej(err)
            else res()
        })
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