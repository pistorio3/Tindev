const Dev = require('../models/Dev');

module.exports = {
    async store(req, res){
        console.log(req.io, req.connectedUsers);

        const {user} = req.headers; 
        const {devId} = req.params; 

        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devId);

        if (!targetDev) {
            return res.status(400).json({ error: 'Dev not exists' });
        }

        loggedDev.likes.push(targetDev._id);
        console.log(loggedDev.name, 'deu like em', targetDev.name);

        if (targetDev.likes.includes(loggedDev._id)) {
            console.log(loggedDev.name,'DEU MATCH COM',targetDev.name);

            const loggedSocket = req.connectedUsers[user];
            const targetSocket = req.connectedUsers[devId];

            if (loggedSocket) {
                req.io.to(loggedSocket).emit('match', targetDev);
            }

            if (targetSocket) {
                req.io.to(targetSocket).emit('match', loggedDev);
            }
        }

        await loggedDev.save();

        return res.json(loggedDev);
    }
}