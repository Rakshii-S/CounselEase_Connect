import express from 'express';
import cors from 'cors';
import sdk from 'node-appwrite';

const app = express();
const port = 3000;
app.use(cors());

const client = new sdk.Client();
const users = new sdk.Users(client);
const appwriteConfig = {
    databaseId: '65eeb8ce999889bf3cc1',
}

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('65eea61f1a70e314b9a4')
    .setKey('c64d0304f5aa9f82ace0f281e89be8a58c162f819e16e6a59c944ad094f690ccd7b965c60956cdc73b189dd769558f9b2686fcc493252c11483592da850f864e0d5d6012ac616abd7ddf385e3b74579bd8634346a8f25642f0ce69efb0253c1dba187300bbcb42722d4b275ed6d859ec94cca5bf2e703f4e69b9cbd4664b96fb');


app.get('/deleteUser/:userId', (req, res) => {
    console.log(process.env)
    const promise = users.delete(req.params.userId);
    promise.then(function (response) {
        res.send({ response });
    }, function (error) {
        res.send({ error });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
