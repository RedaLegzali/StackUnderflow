const router = require('express').Router()
const { isNotConnected } = require("../middleware/security");

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
module.exports = router