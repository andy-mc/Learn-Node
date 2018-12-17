const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  
  res.render('hello', {
    title: 'Andy is growing',
    name: req.query.name,
    dog: req.query.dog
  });
});

router.get('/reverse/:word', (req, res) => {
  var word = req.params.word;
  var reverseWord = reverseString(word);
  res.send(reverseWord);
});

function reverseString(word) {
  return [...word].reverse().join('');
}

module.exports = router;
