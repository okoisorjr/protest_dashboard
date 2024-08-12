const express = require("express");
const DataModel = require("./DataModel");
const StateInfoModel = require("./StatesInfo");
const { default: mongoose } = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

app.get('', async function(req, res) {
    try{
        const data = await DataModel.find().select("-_id").sort({ name: 1 });

        if(data) {
            return res.status(200).send({
                statusCode: 200,
                data: data
            });
        }
    }catch(error) {
        return res.status(500).send({
            errorCode: 500,
            errorMsg: `Unexpected break in operations`
        });
    }
    console.log("Welcome to the protestant dashboard!");
});

app.get('/data/:id', async function(req, res) {
    if(!req.params.id) {
        return res.status(400).send({
            errorCode: 400,
            errorMsg: 'No id provided'
        });
    }

    console.log(req.params.id);

    try{
        const state = await DataModel.findOne({ id: req.params.id });

        if(!state) {
            return res.status(404).send({
                errorCode: 404,
                errorMsg: ""
            });
        }

        const data = await StateInfoModel.findOne({ state: state._id }).populate("state", "-_id").exec();

        if(!data) {
            return res.status(404).send({
                errorCode: 404,
                errorMsg: 'No data was found!'
            });
        }
        
        if(data) {
            return res.status(200).send({
                statusCode: 200,
                data: data
            });
        }
    }catch(error) {
        console.log(error);
        return res.status(500).send({
            errorCode: 500,
            errorMsg: `Unexpected break in operations`
        });
    }
    console.log("Welcome to the protestant dashboard!");
});

app.post('', async (req, res) => {
    const data = new DataModel();

    data.id = req.body.id;
    data.name = req.body.name;
    data.value = req.body.value;

    try{
        const savedData = await DataModel.create(data);

        if(savedData) {
            return res.status(200).send({
                statusCode: 200,
                data: savedData
            });
        }
    } catch(error) {
        console.log(error);
        return res.status(500).send({
            errorCode: 500,
            errorMsg: `Unexpected break in operations`
        });
    }
});

app.post('/new-data', async (req, res) => {
    const new_data = new StateInfoModel();
    
    new_data.population = req.body.population;
    new_data.governor = req.body.governor;

    try{
        const activeState = await DataModel.findOne({ id: req.body.id });

        if(!activeState) {
            return res.status(404).send({
                errorCode: 404,
                errorMsg: ''
            });
        }
        new_data.state = activeState._id;

        console.log(new_data);
        
        const data = await StateInfoModel.create(new_data);

        if(data) {
            return res.status(200).send({
                statusCode: 200,
                data: data
            });
        }
    } catch(error) {
        console.log(error);
        return res.status(500).send({
            errorCode: 500,
            errorMsg: 'We cannot complete this operation at this time!'
        });
    }
    
});

mongoose.connect(process.env.MONGO_URI)
.then((res) => {
    console.log('Connection to DB successful');
    app.listen(5000, () => {
        console.log('api service running on port 5000');
    });
})
.catch((error) => {
    console.log("Error connecting to DB:", error);
})

