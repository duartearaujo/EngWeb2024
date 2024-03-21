var express = require('express');
var router = express.Router();
var axios = require('axios')

function getCompositores(){
    return axios.get('http://localhost:17001/compositores?periodo=' + req.params.idPeriodo)
    
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:17001/periodos?_sort=nome')
    .then(resp => {
      var periodos = resp.data
      res.status(200).render('periodosListPage', {'lPeriodos': periodos, 'date': d})
    })
    .catch(erro => {
      res.status(501).render('error', {error: erro})
    })
});

router.get('/registo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  res.status(200).render('periodoFormPage', {'date': d})
});

router.post('/registo', function(req, res, next) {
  var result = req.body
  axios.post('http://localhost:17001/periodos', result)
    .then(resp => {
      res.status(200).redirect('/periodos')
    })
    .catch(erro => {
      res.status(502).render('error', {error: erro})
    })
});

router.get('/:idPeriodo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:17001/periodos/' + req.params.idPeriodo)
    .then(resp => {
      var periodo = resp.data
      axios.get('http://localhost:17001/compositores?periodo=' + req.params.idPeriodo)
        .then(resp => {
            var compositores = resp.data
            res.status(200).render('periodoPage', {'periodo': periodo, 'date': d, 'compositores': compositores})
        })
        .catch(erro => {
            res.status(503).render('error', {error: erro})
        })
    })
    .catch(erro => {
      res.status(503).render('error', {error: erro})
    })
});

router.get('/edit/:idPeriodo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get('http://localhost:17001/periodos/' + req.params.idPeriodo)
    .then(resp => {
      var periodo = resp.data
      res.status(200).render('periodoFormEditPage', {'periodo': periodo, 'date': d})
    })
    .catch(erro => {
      res.status(504).render('error', {error: erro})
    })
});

router.get('/delete/:idPeriodo', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.delete('http://localhost:17001/periodos/' + req.params.idPeriodo)
    .then(resp => {
      res.status(200).redirect('/periodos')
    })
    .catch(erro => {
      res.status(505).render('error', {error: erro})
    })
});

router.post('/edit/:idPeriodo', function(req, res, next) {
  var result = req.body
  axios.put('http://localhost:17001/periodos/' + req.params.idPeriodo, result)
    .then(resp => {
      res.status(200).redirect('/periodos')
    })
    .catch(erro => {
      res.status(506).render('error', {error: erro})
    })
});

module.exports = router;
