const Dev = require('../models/Dev');

module.exports = {
    async store(req, res){
        const {user} = req.headers; 
        const {devId} = req.params; 

        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devId);

        if (!targetDev) {
            return res.status(400).json({ error: 'Dev not exists' });
        }

        loggedDev.dislikes.push(targetDev._id);
        console.log(loggedDev.name, 'deu dislike em', targetDev.name);
        console.log('');

        await loggedDev.save();

        return res.json(loggedDev);
    }
}