const express = require('express')
const router = express.Router()
//urllib
const moment = require('moment')
const Expense = require('../model/Expense')


// const data = require('../../expenses.json')
// for(let item of data){
//     const expense = new Expense({ name: item.item, ...item })
//     expense.save()
// }

// router.get('/expenses',function(req,res){
//     Expense.find({}).sort({date:-1}).then(expenses => res.send(expenses))
// })


router.get('/expenses',function(req,res){
    const d1 = req.query.d1
    const d2 = req.query.d2
    if(d1 && d2){
        Expense.find({
            $and:[
                {date:{$gt:d1}},
                {date:{$lt:d2}}
            ]
        }).sort({date:-1}).then(expenses => res.send(expenses))
    } else if(d1 && !d2){
        Expense.find({
            date:{$gt:d1}
        }).sort({date:-1}).then(expenses => res.send(expenses))
    } else {
        Expense.find({}).sort({date:-1}).then(expenses => res.send(expenses))
    }
})




router.post('/new',function(req,res){
    const name = req.body.name
    const amount = req.body.amount
    const group = req.body.group
    const date = req.body.date ? moment(req.body.date).format('LLLL') : moment().format('LLLL')
    const newExpense = new Expense({name:name, amount:amount, group:group, date:date})
    newExpense.save().then( () => console.log(`Spent ${amount}$ on ${name}`))
    res.end()
})


router.put('/update',function(req,res){
    const group1 = req.body.group1
    const group2 = req.body.group2
    mongoose.set('useFindAndModify', false)
    Expense.findOneAndUpdate({group:group1},{group:group2})
    .then(updated => res.send(`${updated.name} was changed from ${group1} group to ${group2} group`))
})


// router.get('/expenses/:group',function(req,res){
//     const group = req.params.group
//     Expense.find({group:group}).then(groups => res.send(groups))
// })


router.get('/expenses/:group',function(req,res){
    const group = req.params.group
    const total = req.query.total || 'false'          //t or f as string
    if(total === 'true'){
        Expense.aggregate([
            {$match: {
                group:group
                     }
            },
            {$group: {
                    _id: null, 
                    totalAmount: {$sum: '$amount'} 
                    }
            }
        ]).then(totalAmount => res.send(totalAmount))
    } else {
        Expense.find({group:group}).then(groups => res.send(groups))
    }
})





module.exports = router