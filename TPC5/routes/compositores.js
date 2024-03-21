var express = require('express');
var router = express.Router();
var axios = require('axios')

/* GET users listing. */
router.get('/', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:17001/compositores?_sort=nome')
    .then(resp => {
      var compositores = resp.data
      res.status(200).render('compositoresListPage', {'lCompositores': compositores, 'date': d})
    })
    .catch(erro => {
      res.status(501).render('error', {error: erro})
    })
});

router.get('/registo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  res.status(200).render('compositorFormPage', {'date': d})
});

router.post('/registo', function(req, res, next) {
  var result = req.body
  axios.post('http://localhost:17001/compositores', result)
    .then(resp => {
      res.status(200).redirect('/compositores')
    })
    .catch(erro => {
      res.status(502).render('error', {error: erro})
    })
});

router.get('/:idCompositor', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:17001/compositores/' + req.params.idCompositor)
    .then(resp => {
      var compositor = resp.data
      res.status(200).render('compositorPage', {'compositor': compositor, 'date': d})
    })
    .catch(erro => {
      res.status(503).render('error', {error: erro})
    })
});

router.get('/edit/:idCompositor', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:17001/compositores/' + req.params.idCompositor)
    .then(resp => {
      var compositor = resp.data
      res.status(200).render('compositorFormEditPage', {'compositor': compositor, 'date': d})
    })
    .catch(erro => {
      res.status(504).render('error', {error: erro})
    })
});

router.get('/delete/:idCompositor', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.delete('http://localhost:17001/compositores/' + req.params.idCompositor)
    .then(resp => {
      res.status(200).redirect('/compositores')
    })
    .catch(erro => {
      res.status(505).render('error', {error: erro})
    })
});

router.post('/edit/:idCompositor', function(req, res, next) {
  var result = req.body
  axios.put('http://localhost:17001/compositores/' + req.params.idCompositor, result)
    .then(resp => {
      res.status(200).redirect('/compositores')
    })
    .catch(erro => {
      res.status(506).render('error', {error: erro})
    })
});

module.exports = router;
