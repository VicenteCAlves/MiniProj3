const expertRoutes = ( app, fs ) => {

    const caminhoBD = './db/experts.json';

    const leExperts = () => {
        const dadosTexto = fs.readFileSync( caminhoBD );
        return JSON.parse( dadosTexto );
    };
    // Guarda os dados dos Experts no ficheiro experts.json
    const guardaExperts = ( dados ) => {
	    const converteDadosTexto = JSON.stringify( dados );
	    fs.writeFileSync( caminhoBD, converteDadosTexto );
    }

    app.get('/experts', (req, res ) => {
        res.send( leExperts() );
    });

    app.post('/experts/adiciona', ( req, res ) => {
        // Carrega os Experts existentes
        const experts = leExperts();
        
        // Carrega os dados do novo Expert
        const dadosExpert = req.body;
        
        // Valida se os dados necessários para os Sponsors estão todos preenchidos
        if (dadosExpert.nome === null || dadosExpert.classe === null || dadosExpert.tipo === null) {
            return res.status( 401 ).send( {erro: true, mensagem: 'Faltam preencher dados'} );
        }
        
        // Verifica se o nome do Expert já existe
        const validaExpert = experts.find( expert => expert.nome === dadosExpert.nome );
        
        if ( validaExpert ){
            return res.status( 409 ).send( {erro: true, mensagem: 'O Expert já existe'} );
        }
        
        // Adiciona o novo Expert
        experts.push( dadosExpert );
        
        // Guarda os dados dos Experts
        guardaExperts( experts );
        
        res.status( 201 ).send( {erro: false, mensagem: "O Expert foi adicionado com sucesso"} );
    });

    app.put('/experts/modifica/:nome', ( req, res ) => {
        const nome = req.params.nome;
        
        const dadosExpert = req.body;
        
        const experts = leExperts();
        
        const validaExpert = experts.find( expert => expert.nome === nome );
        
        if (!validaExpert){
            return res.status( 409 ).send( {erro:true, mensagem: 'O Expert não existe'} );
        }
        
        const modificaExpert = experts.filter( expert => expert.nome !== nome );
        
        modificaExpert.push( dadosExpert );
        
        guardaExperts( modificaExpert );
        
        res.status( 200 ).send( {erro: false, mensagem: 'O Expert foi modificado'} );
    });

    /* Elimina Expert - uso do método DELETE*/
    app.delete('/experts/elimina/:nome', ( req, res ) => {
        const nome = req.params.nome;
        
        const experts = leExperts();
        
        const validaExpert = experts.filter( expert => expert.nome !== nome );
        
        if ( experts.length === validaExpert.length ){
            return res.status( 409 ).send( {erro: true, mensagem: 'Expert não existe'} );
        }
        
        guardaExperts( validaExpert );
        
        res.status( 200 ).send( {erro:false, mensagem: 'O Expert foi removido'} );
    });
};

module.exports = expertRoutes;