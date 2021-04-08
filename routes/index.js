const router = require('express').Router()
const User = require('../models/User')
const Question = require('../models/Question')
const { isConnected, isNotConnected } = require("../middleware/security");

// Get index page
router.get('/', isNotConnected, (req, res) => {
    res.render('home/index')
})
// Get about page
router.get('/about', isNotConnected, (req, res) => {
    res.render('home/about', {
        title: 'About'
    })
})
// Get questions page
router.get('/questions', isConnected, async (req, res) => {
    let search = req.query.search
    let questions;
    if (typeof search == 'undefined') questions = await Question.find()
    else questions = await Question.find({subject: {$regex: search, $options: 'gi'}  })
    let errors = []
    let success = ""
    let categories = getCategories(req.session.user.team)
    res.render('app/questions', {
        title: 'Questions',
        questions, errors, success, categories
    })
})
// Post Question 
router.post('/questions', isConnected, async (req, res) => {
    let {subject, body, category} = req.body
    let errors = []
    let success = ""
    if (!subject || !body) errors.push('All fields are required')
    if (errors.length == 0) {
        let question = new Question({
            user: req.session.user.email,
            subject, body, category
        })
        question.save()
        success = "Question added successfully"
    }
    let questions = await Question.find()
    let categories = getCategories(req.session.user.team)
    res.render('app/questions', {
        title: 'Questions',
        questions, errors, success, categories
    })
})
// Get Chat Room Page
router.get('/chat', isConnected, (req, res) => {
    res.render('app/chat', {
        title: 'Chat Room'
    })
})

const getCategories = (team) => {
    switch (team) {
        case 'Dev':
            return ['NodeJS', 'PHP', 'Python', 'Java']
        case 'Security':
            return ['Social Engineering', 'Network Scanning', 'Exploitation', 'Password Cracking']
        case 'SysAdmin':
            return ['Linux', 'Windows Server', 'Ansible', 'CLI']
        case 'Network':
            return ['Cisco', 'DNS', 'DHCP', 'TCP IP']
        case 'DBA':
            return ['ORACLE', 'MySQL', 'PostgreSQL', 'Mongodb']
    }
}
module.exports = router