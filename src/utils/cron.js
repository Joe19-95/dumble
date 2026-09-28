const cron = require('node-cron')
const Connection = require('../models/connectionRequest')
const { subDays, startOfDay, endOfDay } = require('date-fns/subDays')
const { run } = require('./sendEmail')

cron.schedule('0 8 * * *', async () => {
    const yesterday = subDays(new Date(), 1)
    const startOfYesterday = startOfDay(yesterday)
    const endOfYesterday = endOfDay(yesterday)
    let connections = await Connection.find({
        status: 'interested',
        createdAt: {
            $gte: startOfYesterday,
            $lte: endOfYesterday
        }
    }).populate('from to')
    let uniqto= [...new Set(connections.map(item => item.to.email))]
    console.log('unique to users', uniqto)
    for (const toUserId of uniqto) {
        try{
            // let res = await run()
            // console.log('email sent to user', toUserId, res)
        }catch(err){
            console.log('error in sending email to user', toUserId, err.message)
        }
    }
})