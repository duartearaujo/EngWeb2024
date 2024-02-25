var http = require('http');
var meta = require('./ex');
var url = require('url');
var axios = require('axios');
const { error } = require('console');


http.createServer(function (req, res) {
    console.log(req.method + ' ' + req.url);

    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})

    var q = url.parse(req.url, true)

    if (q.pathname == '/'){
        //Lista de cidades
        axios.get('http://localhost:3000/cidades')
        .then( (resp) => {
            let lista = resp.data
            res.write('<ul>')
            for (elem in lista){
                res.write(`<li><a href="/cidades/${lista[elem].id}/">${lista[elem].nome}</a></li>`)
            }
            res.write('</ul>')
            res.end()
        }).catch(error => {
            console.log('Erro na obtenção da lista de cidades: ' + error)
            res.end()
        })
    }
    else if (q.pathname.startsWith('/cidades/')){
        var id = q.pathname.split('/')[2]
        axios.get('http://localhost:3000/cidades')
        .then( (resp) => {
            let cidades = resp.data
            let cidade = cidades.find(c => c.id == id)
            res.write(`<h2>${cidade.nome}</h2>`)
            res.write(`<p>População: ${cidade.população}</p>`)
            res.write(`<p>Distrito: ${cidade.distrito}</p>`)
            res.write(`<p>Descrição: ${cidade.descrição}</p>`)
            res.write('<p>Ligação para: </p>')
            axios.get(`http://localhost:3000/ligações?origem=${id}`, {cidades})
            .then( (resp) => {
                let ligacoes = resp.data
                res.write('<ul>')
                for (l in ligacoes){
                    for (c in cidades){
                        if (cidades[c].id == ligacoes[l].destino){
                            res.write(`<li><a href="/cidades/${cidades[c].id}/">${cidades[c].nome}</a></li>`)
                            res.write(`<p>Distância: ${ligacoes[l].distância}</p>`)
                            //res.write('<li><a href="/cidades/' + cidades[c].id + '/">' + cidades[c].nome + '</a></li>')
                        }
                    }
                }
                res.write('</ul>')
                res.write(`<p><a href="/">Voltar</a></p>`)
                res.end()
            }).catch(error => {
                console.log('Erro na obtenção das ligações: ' + error)
                res.end()
            })
        }).catch(error => {
            console.log('Erro na obtenção da cidade: ' + error)
            res.end()
        })
    }
    else{
        res.write('Operação desconhecida')
        res.end()
    }
    
}).listen(1902);

console.log('Servidor à escuta na porta 1902...');