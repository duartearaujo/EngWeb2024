var http = require('http');
//var meta = require('./ex');
var url = require('url');
var axios = require('axios');
const { error } = require('console');

http.createServer(function (req, res) {
    console.log(req.method + ' ' + req.url);

    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})

    var q = url.parse(req.url, true)

    if (q.pathname == '/'){
        axios.get('http://localhost:3000/filmes')
        .then( (resp) => {
            let lista = resp.data
            res.write('<ul>')
            for (elem in lista){
                res.write(`<li><a href="/filmes/${lista[elem]._id}/">${lista[elem].title}</a></li>`)
            }
            res.write('</ul>')
            res.end()
        }).catch(error => {
            console.log('Erro na obtenção da lista de filmes: ' + error)
            res.end()
        })
    }
    else if (q.pathname.startsWith('/filmes/')){
        var id = q.pathname.split('/')[2]
        axios.get(`http://localhost:3000/filmes?_id=${id}`)
        .then( (resp) => {
            let filme = resp.data[0]
            res.write(`<h2>${filme.title}</h2>`)
            res.write(`<p>Year: ${filme.year}</p>`)
            res.write(`<p>Genre: </p>`)
            res.write('<ul>')
            for (genre in filme.genres){
                res.write(`<li><a href="/generos/${filme.genres[genre]}/">${filme.genres[genre]}</a></li>`)
            }
            res.write('</ul>')
            res.write(`<p>Cast: </p>`)
            res.write('<ul>')
            for (actor in filme.cast){
                res.write(`<li><a href="/atores/${filme.cast[actor]}/">${filme.cast[actor]}</a></li>`)
            }
            res.write('</ul>')
            res.end()
        }).catch(error => {
            console.log('Erro na obtenção do filme: ' + error)
            res.end()
        })
    }
    else if (q.pathname.startsWith('/atores/')){
        var name = q.pathname.split('/')[2]
        name = name.replace(/%20/g, ' ')
        axios.get(`http://localhost:3000/filmes`)
        .then( (resp) => {
            let lista = resp.data
            let filmes = lista.filter(filme => filme.cast.includes(name))
            res.write(`<h2>${name}</h2>`)
            res.write(`<p>Movies: </p>`)
            res.write('<ul>')
            for (f in filmes){
                res.write(`<li><a href="/filmes/${filmes[f]._id}/">${filmes[f].title}</a></li>`)
            }
            res.write('</ul>')
            res.end()
        }).catch(error => {
            console.log('Erro na obtenção do ator: ' + error)
            res.end()
        })
    }
    else if (q.pathname.startsWith('/generos/')){
        var name = q.pathname.split('/')[2]
        axios.get('http://localhost:3000/filmes')
        .then( (resp) => {
            let lista = resp.data
            let filmes = lista.filter(filme => filme.genres.includes(name))
            res.write(`<h2>${name}</h2>`)
            res.write(`<p>Movies: </p>`)
            res.write('<ul>')
            for (f in filmes){
                res.write(`<li><a href="/filmes/${filmes[f]._id}/">${filmes[f].title}</a></li>`)
            }
            res.write('</ul>')
            res.end()
        }).catch(error => {
            console.log('Erro na obtenção da lista de géneros: ' + error)
            res.end()
        })
    }
    else{
        res.write('Operação desconhecida')
        res.end()
    }
}).listen(4000);

console.log('Servidor à escuta na porta 4000...');