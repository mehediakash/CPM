const mongoose = require('mongoose');


function dbconfig(){
    mongoose.connect(`mongodb+srv://aklogic:ZtMJ1f6yPIMa4ubG@cluster0.knqixdj.mongodb.net/cpmexcel?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => console.log('Connected!'));
}

module.exports = dbconfig