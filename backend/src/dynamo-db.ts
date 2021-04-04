import AWS from 'aws-sdk'
import dotenv from "dotenv";
dotenv.config()

export enum Region {
    NA = 'NA'
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

export const updateSummoner = (name: string, region: Region, bar: string) => {
    return new Promise<void>((res, rej) => {
        client.update({
            TableName: 'lol-summoners',
            Key: {name, region},
            ExpressionAttributeValues: {
                ':bar': bar
            },
            UpdateExpression: 'set foo = :bar'
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