const espresso = require('express'); // importando o express - "npm install express"
const meuServidor = espresso();      // executar a função
meuServidor.use(espresso.json());    // usar metodo JSON [thunderClient - body (comunicação)]

// Consulta de todos os cargos:
const listaCargos = [
    {
        codigo: 1,
        nome: 'Desenvolvedor',
        descricao: 'Responsável pelo desenvolvimento de software.'
    },
    {
        codigo: 2,
        nome: 'Gerente de Projetos',
        descricao: 'Responsável pelo planejamento e execução de projetos.'
    }
];

meuServidor.get('/cargos', (requisicao, resposta) => {
    resposta.send(listaCargos);
});

const listaUsuarios = [
    {
        id: 1,
        nome: 'Leandro',
        idade: 15,
        CPF: '12345678911',
        codigoCargo: 1        // novo campo
    },
    {
        id: 2,
        nome: 'Pedro',
        idade: 16,
        CPF: '12335678911'
    },
    {
        id: 3,
        nome: 'João',
        idade: 55,
        CPF: '1111111111'
    }
];

// Definindo rota de "Get" - rota de consulta - fez requisisao e foi retornado no site: http://localhost:4300/usuarios
meuServidor.get('/usuarios', (requisicao, resposta) => {
    let respostaUsuarios = '';                                
    for (let index = 0; index < listaUsuarios.length; index++) { 
        const usuario = listaUsuarios[index];
        respostaUsuarios += '<p>';
        respostaUsuarios += 'Código: ';
        respostaUsuarios += usuario.id;
        respostaUsuarios += '</br>Nome: ';
        respostaUsuarios += usuario.nome;
        respostaUsuarios += '</br>Idade: ';
        respostaUsuarios += usuario.idade;
        respostaUsuarios += '</br>CPF: ';
        respostaUsuarios += usuario.CPF;
        respostaUsuarios += '</br>Cargo: ';
        const CargoEncontrado = listaCargos.find((CargoAtual) => {  // 
            return cargoAtual.id == codigocargo;
        });
        respostaUsuarios += cargoEncontrado.descricao;
        respostaUsuarios += '</p>';
    }
    resposta.send(respostaUsuarios);
});

// rota post - cadastro - enviar informações
meuServidor.post('/usuarios', (requisicao, resposta) => {
    const nome = requisicao.body.nome;
    const idade = requisicao.body.idade;
    const cpf = requisicao.body.cpf;
    let codigo = -99999999999999999;
    for (let index = 0; index < listaUsuarios.length;index++) {
        const usuarioAtual = listaUsuarios[index];
        if (usuarioAtual.id > codigo) {
            codigo = usuarioAtual.id;
        }
    }
    if (codigo < 0) {
        codigo = 0;
    }
    const novoUsuario = {
        id: codigo + 1,
        nome: nome,
        idade: idade,
        CPF: cpf
    };
    listaUsuarios.push(novoUsuario);
    resposta.send();
});

// rota put (para alterar)
meuServidor.put('/usuarios/:usuarioId', (requisicao, resposta) => {   //parametro "usuarioId" usase o paramns
    const codigoUsuario = requisicao.params.usuarioId;                // paramns 
    const usuarioEncontrado = listaUsuarios.find((usuarioAtual) => {  // 
        return usuarioAtual.id == codigoUsuario;
    });
    const nome = requisicao.body.nome;     
    const idade = requisicao.body.idade;  
    const cpf = requisicao.body.cpf;
    usuarioEncontrado.nome = nome;
    usuarioEncontrado.idade = idade;
    usuarioEncontrado.CPF = cpf;  
    resposta.send();
});




// Atualização de um usuário pelo código do usuário:
meuServidor.put('/usuarios/:usuarioId', (requisicao, resposta) => {
    const codigoUsuario = requisicao.params.usuarioId;
    const usuarioEncontrado = listaUsuarios.find(usuario => usuario.id === parseInt(codigoUsuario));
    if (!usuarioEncontrado) {
        resposta.status(404).send('Usuário não encontrado');
        return;
    }
    usuarioEncontrado.nome = requisicao.body.nome;
    usuarioEncontrado.idade = requisicao.body.idade;
    usuarioEncontrado.CPF = requisicao.body.cpf;
    resposta.send('Usuário atualizado com sucesso');
});

// Remoção de um usuário pelo código do usuário:
meuServidor.delete('/usuarios/:usuarioId', (requisicao, resposta) => {
    const codigoUsuario = requisicao.params.usuarioId;
    const indiceUsuario = listaUsuarios.findIndex(usuario => usuario.id === parseInt(codigoUsuario));
    if (indiceUsuario === -1) {
        resposta.status(404).send('Usuário não encontrado');
        return;
    }
    listaUsuarios.splice(indiceUsuario, 1);    // primeiro parametro (qual quero começar), segundo (quantos a partir dele)
    resposta.send('Usuário removido com sucesso');
});




// Consulta de um usuário pelo código de usuário:
meuServidor.get('/usuarios/:usuarioId', (requisicao, resposta) => {
    const codigoUsuario = requisicao.params.usuarioId;
    const usuarioEncontrado = listaUsuarios.find(usuario => usuario.id === parseInt(codigoUsuario));
    if (!usuarioEncontrado) {
        resposta.status(404).send('Usuário não encontrado');
        return;
    }
    resposta.send(usuarioEncontrado);
});




//----------------CARGOS-------------------
meuServidor.get('/cargos', (requisicao, resposta) => {
    let respostaCargos = '';
    for (let index = 0; index < listaCargos.length; index++) {
        const cargo = listaCargos[index];
        respostaCargos += '<p>';
        respostaCargos += 'CÃ³digo: ';
        respostaCargos += cargo.id;
        respostaCargos += '</br>Descricao: ';
        respostaCargos += cargo.descricao;
        respostaCargos += '</br>Usuarios: ';
        respostaCargos += '</br>[';
        const usuariosEncontrados = listaUsuarios.filter(function(usuarioAtual) {
            return usuarioAtual.codigoCargo == cargo.id;
        });
        for (let usuarioIndex = 0; usuarioIndex < usuariosEncontrados.length; usuarioIndex++) {
            const usuarioDoCargo = usuariosEncontrados[usuarioIndex];
            respostaCargos += usuarioDoCargo.nome;
            respostaCargos += ' / ';
        }
        respostaCargos += ']';
        respostaCargos += '</p>';
    }
    resposta.send(respostaCargos);
});

meuServidor.post('/cargos', (requisicao, resposta) => {
    const descricao = requisicao.body.descricao;
    let codigo = -99999999999999999;
    for (let index = 0; index < listaCargos.length;index++) {
        const cargoAtual = listaCargos[index];
        if (cargoAtual.id > codigo) {
            codigo = cargoAtual.id;
        }
    }
    if (codigo < 0) {
        codigo = 0;
    }
    const novoCargo = {
        id: codigo + 1,
        descricao: descricao
    };
    listaCargos.push(novoCargo);
    resposta.send();
});

meuServidor.put('/cargos/:cargoId', (requisicao, resposta) => {
    const codigoCargo = requisicao.params.cargoId;
    const cargoEncontrado = listaCargos.find((cargoAtual) => {
        return cargoAtual.id == codigoCargo;
    });
    const descricao = requisicao.body.descricao;
    cargoEncontrado.descricao = descricao;
    resposta.send();
});

meuServidor.delete('/cargos/:cargoId', (requisicao, resposta) => {
    const codigoCargo = requisicao.params.cargoId;
    const indiceCargo = listaCargos.findIndex((cargoAtual) => {
        return cargoAtual.id == codigoCargo;
    });
    listaCargos.splice(indiceCargo, 1);
    resposta.send();
});

meuServidor.get('/cargos/:cargoId', (requisicao, resposta) => {
    const codigoCargo = requisicao.params.cargoId;
    resposta.send(listaCargos.find((cargoAtual) => {
        return cargoAtual.id == codigoCargo;
    }));
    return;
});


meuServidor.listen(4300, () => {
    console.log('Meu primeiro servidor na porta 4300.');
});