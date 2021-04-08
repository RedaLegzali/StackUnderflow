const router = require('express').Router()
const {isConnected} = require('../middleware/security')

// Get Chat Room Page
router.get('/', isConnected, (req, res) => {
    res.render('app/chat', {
        title: 'Chat Room',
        image: req.session.user.image,
    })
})

module.exports = router