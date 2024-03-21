var http = require('http')
var axios = require('axios')
const { parse } = require('querystring');

var templates = require('./templates.js')          // Necessario criar e colocar na mesma pasta
var static = require('./static.js')             // Colocar na mesma pasta

// Aux functions
function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}

// Server creation

var composersServer = http.createServer((req, res) => {

    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                if(req.url == "/"){
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.write(templates.mainPage(d))
                    res.end()
                }
                else if(req.url == "/composers"){
                    axios.get("http://localhost:3000/compositores?_sort=nome")
                    .then((resp) => {
                        var composers = resp.data
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write(templates.composersListPage(composers, d))
                        res.end()
                    })
                    .catch((erro) => {
                        res.writeHead(501, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write("<p>Erro na obtenção da lista de compositores...")
                        res.end()
                    })
                }
                else if(/\/composers\/C[0-9]+$/.test(req.url)){
                    var id = req.url.split("/")[2]
                    axios.get("http://localhost:3000/compositores/" + id)
                    .then((resp) => {
                        var composer = resp.data
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write(templates.composerPage(composer, d))
                        res.end()
                    })
                    .catch((erro) => {
                        res.writeHead(501, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write("<p>Erro na obtenção do compositor...")
                        res.end()
                    })
                }
                else if(req.url == "/composers/registo"){
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.write(templates.composerFormPage(d))
                    res.end()
                }
                else if(/\/composers\/edit\/C[0-9]+$/.test(req.url)){
                    var id = req.url.split("/")[3]
                    axios.get("http://localhost:3000/compositores/" + id)
                    .then((resp) => {
                        var composer = resp.data
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write(templates.composerFormEditPage(composer, d))
                        res.end()
                    })
                    .catch((erro) => {
                        res.writeHead(501, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write("<p>Erro na obtenção do compositor...")
                        res.end()
                    })
                }
                else if(/\/composers\/delete\/C[0-9]+$/.test(req.url)){
                    var id = req.url.split("/")[3]
                    axios.delete("http://localhost:3000/compositores/" + id)
                    .then((resp) => {
                        var composer = resp.data
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write(templates.composersListPage(composer, d))
                        res.end()
                    })
                    .catch((erro) => {
                        res.writeHead(501, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write("<p>Erro na obtenção do compositor...")
                        res.end()
                    })
                }
                if(req.url == "/periods"){
                    axios.get("http://localhost:3000/periodos")
                    .then((resp) => {
                        var periods = resp.data
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write(templates.periodsListPage(periods, d))
                        res.end()
                    })
                    .catch((erro) => {
                        res.writeHead(501, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write("<p>Erro na obtenção da lista de períodos...")
                        res.end()
                    })
                }
                else if(/\/periods\/\b\w+\b$/.test(req.url)){
                    var period = req.url.split("/")[2]
                    axios.get("http://localhost:3000/compositores?periodo=" + period)
                    .then((resp) => {
                        var composers = resp.data
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write(templates.periodPage(period, composers, d))
                        res.end()
                    })
                    .catch((erro) => {
                        res.writeHead(501, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write("<p>Erro na obtenção da lista de compositores...")
                        res.end()
                    })
                }
                else if(req.url == "/periods/registo"){
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.write(templates.periodFormPage(d))
                    res.end()
                }
                else if(/\/periods\/edit\/\b\w+\b$/.test(req.url)){
                    var period = req.url.split("/")[3]
                    axios.get("http://localhost:3000/periodos/" + period)
                    .then((resp) => {
                        var period = resp.data
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write(templates.periodFormEditPage(period, d))
                        res.end()
                    })
                    .catch((erro) => {
                        res.writeHead(501, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write("<p>Erro na obtenção do periodo...")
                        res.end()
                    })
                }
                else if(/\/periods\/delete\/\b\w+\b$/.test(req.url)){
                    var period = req.url.split("/")[3]
                    axios.delete("http://localhost:3000/periodos/" + period)
                    .then((resp) => {
                        var period = resp.data
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write(templates.periodsListPage(period, d))
                        res.end()
                    })
                    .catch((erro) => {
                        res.writeHead(501, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write("<p>Erro na obtenção do periodo...")
                        res.end()
                    })
                }
                else{
                    res.writeHead(501, {'Content-Type': 'text/html; charset=utf-8'})
                    res.write("<p>" + req.method + " não suportado neste serviço.</p>")
                    res.end()
                }
                break
            case "POST":
                if(req.url == "/composers"){
                    collectRequestBodyData(req, (result) => {
                        if(result){
                            axios.post('http://localhost:3000/compositores', result)
                            .then(resp => {
                                res.writeHead(201, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write(templates.composersListPage(resp.data, d))
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(503, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write("<p>Não foi possível inserir o registo...")
                                res.end()
                            })
                        }
                    })
                }
                else if(req.url == "/periods"){
                    collectRequestBodyData(req, (result) => {
                        if(result){
                            axios.post('http://localhost:3000/periodos', result)
                            .then(resp => {
                                res.writeHead(201, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write(templates.periodsListPage(resp.data, d))
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(503, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write("<p>Não foi possível inserir o registo...")
                                res.end()
                            })
                        }
                    })
                }
                else if(req.url == "/composers/registo"){
                    collectRequestBodyData(req, (result) => {
                        if(result){
                            axios.post('http://localhost:3000/compositores', result)
                            .then(resp => {
                                console.log(resp.data)
                                res.writeHead(201, {'Content-Type': 'text/html; charset=utf-8'})
                                res.end('<p>Registo inserido: ' + JSON.stringify(resp.data) + '</p>')
                            })
                            .catch(erro => {
                                res.writeHead(503, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write("<p>Não foi possível inserir o registo...")
                                res.end()
                            })
                        }
                        else{
                            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write("<p>" + req.method + " não suportado neste serviço.</p>")
                            res.end()
                        }
                    })
                }
                else if(req.url == "/periods/registo"){
                    collectRequestBodyData(req, (result) => {
                        if(result){
                            axios.post('http://localhost:3000/periodos', result)
                            .then(resp => {
                                console.log(resp.data)
                                res.writeHead(201, {'Content-Type': 'text/html; charset=utf-8'})
                                res.end('<p>Registo inserido: ' + JSON.stringify(resp.data) + '</p>')
                            })
                            .catch(erro => {
                                res.writeHead(503, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write("<p>Não foi possível inserir o registo...")
                                res.end()
                            })
                        }
                        else{
                            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write("<p>" + req.method + " não suportado neste serviço.</p>")
                            res.end()
                        }
                    })
                    
                }
                else if(/\/composers\/edit\/C[0-9]+$/.test(req.url)){
                    collectRequestBodyData(req, (result) => {
                        if(result){
                            axios.put('http://localhost:3000/compositores/' + result.id, result)
                            .then(resp => {
                                res.writeHead(201, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write(templates.composersListPage(resp.data, d))
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(503, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write("<p>Não foi possível editar o registo...")
                                res.end()
                            })
                        }
                    })
                }
                else if(/\/periods\/edit\/\b\w+\b$/.test(req.url)){
                    collectRequestBodyData(req, (result) => {
                        if(result){
                            axios.put('http://localhost:3000/periodos/' + result.id, result)
                            .then(resp => {
                                res.writeHead(201, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write(templates.periodsListPage(resp.data, d))
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(503, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write("<p>Não foi possível editar o registo...")
                                res.end()
                            })
                        }
                    })
                }
                else if(/\/composers\/delete\/C[0-9]+$/.test(req.url)){
                    var id = req.url.split("/")[3]
                    axios.delete("http://localhost:3000/compositores/" + id)
                    .then((resp) => {
                        var composer = resp.data
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write(templates.composersListPage(composer, d))
                        res.end()
                    })
                    .catch((erro) => {
                        res.writeHead(501, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write("<p>Erro na obtenção do compositor...")
                        res.end()
                    })
                }
                else if(/\/periods\/delete\/\b\w+\b$/.test(req.url)){
                    var period = req.url.split("/")[3]
                    axios.delete("http://localhost:3000/periodos/" + period)
                    .then((resp) => {
                        var period = resp.data
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write(templates.periodsListPage(period, d))
                        res.end()
                    })
                    .catch((erro) => {
                        res.writeHead(501, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write("<p>Erro na obtenção do periodo...")
                        res.end()
                    })
                }
                else{
                    res.writeHead(501, {'Content-Type': 'text/html; charset=utf-8'})
                    res.write("<p>" + req.method + " não suportado neste serviço.</p>")
                    res.end()
                }
                break
            default: 
                res.writeHead(501, {'Content-Type': 'text/html; charset=utf-8'})
                res.write("<p>" + req.method + " não suportado neste serviço.</p>")
                res.end()
                break
        }
    }
})

composersServer.listen(7777, ()=>{
    console.log("Servidor à escuta na porta 7777...")
})