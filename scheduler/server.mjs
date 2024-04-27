import express from 'express';
import cors from 'cors';
import sdk from 'node-appwrite';
import schedule from 'node-schedule';

const client = new sdk.Client();
const users = new sdk.Users(client);
const databases = new sdk.Databases(client);
const app = express();
const port = 3000;


const appwriteConfig = {
    databaseId: '65eeb8ce999889bf3cc1',
    appointmentCollectionId: '6616647b3d40ad737b0e',
    scheduleCollectionId: '6614b49bb5c91ed69972'
}
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('65eea61f1a70e314b9a4')
    .setKey('c64d0304f5aa9f82ace0f281e89be8a58c162f819e16e6a59c944ad094f690ccd7b965c60956cdc73b189dd769558f9b2686fcc493252c11483592da850f864e0d5d6012ac616abd7ddf385e3b74579bd8634346a8f25642f0ce69efb0253c1dba187300bbcb42722d4b275ed6d859ec94cca5bf2e703f4e69b9cbd4664b96fb');

// system time and date 
let date = new Date()
let day0 = date.getDay()

async function schedule1() {
    console.log("hello")
    let s
    let stat = []
    let statuss = []
    let daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let sched = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.scheduleCollectionId
    )
    for (let k = 0; k < Number(sched.documents.length); k++) {
        s = sched.documents[k].status
        for (let n = 0; n < 6; n++) {
            stat = []
            for (let m = 0; m < 8; m++) {
                stat.push(s[m])
            }
            for (let m = 0; m < 8; m++)
                s.shift()
            statuss.push(stat)
        }
        let counsellorID = String(sched.documents[k].counsellorid)
        let timeslot = sched.documents[k].timeslot
        if (day0 == 0) {
            return
        } else {
            let status = []
            let dt = []
            let days = []
            for (let i = 0; i < 6; i++) {
                let nullPush = true
                let nullPush2 = true
                for (let j = 0; j < 8; j++) {
                    if (i + 1 >= day0) {
                        let date = new Date();
                        date.setDate(date.getDate() + (i + 1) - day0);
                        let date_0 = date.toISOString().split('T')[0]
                        if (!dt.includes(date_0)) {
                            dt.push(date_0)
                        }
                        if (!days.includes(daysOfWeek[i])) {
                            days.push(daysOfWeek[i])
                        }
                        status.push(statuss[i][j])
                    }
                    else {
                        if (nullPush) {
                            dt.push("null")
                            nullPush = false
                        }
                        if (nullPush2) {
                            days.push("null")
                            nullPush2 = false
                        }
                        status.push("null")
                    }
                }
            }
            await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.scheduleCollectionId,
                counsellorID,
                {
                    counsellorid: counsellorID,
                    days: days,
                    timeslot: timeslot,
                    status: status,
                    dates: dt
                })
        }
    }
}

const Schedulejob = schedule.scheduleJob('11 * * * *', () => {
    schedule1()
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});