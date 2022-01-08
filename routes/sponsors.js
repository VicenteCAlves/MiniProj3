const sponsorRoutes = ( app, fs ) => {
    //Caminho do ficheiro JSON correspondente aos Sponsors
    const caminhoBD = './db/sponsors.json';

    // Retorna os sponsors lidos do ficheiro sponsors.json
    const leSponsors = () => {
        const dadosTexto = fs.readFileSync( caminhoBD );
        return JSON.parse( dadosTexto );
    };

    // Guarda os dados dos Sponsors no ficheiro sponsors.json
    const guardaSponsors = ( dados ) => {
	    const converteDadosTexto = JSON.stringify( dados );
	    fs.writeFileSync( caminhoBD, converteDadosTexto );
    }

    app.get('/sponsors', (req, res ) => {
        res.send( leSponsors() );
    });

    app.post('/sponsors/adiciona', ( req, res ) => {
        // Carrega os Sponsors existentes
        const sponsors = leSponsors();
        
        // Carrega os dados do novo Sponsor
        const dadosSponsor = req.body;
        
        // Valida se os dados necessários para os Sponsors estão todos preenchidos
        if (dadosSponsor.nome === null || dadosSponsor.percentagem === null || dadosSponsor.tipo === null) {
            return res.status( 401 ).send( {erro: true, mensagem: 'Faltam preencher dados'} );
        }
        
        // Verifica se o nome do Sponsor já existe
        const validaSponsor = sponsors.find( sponsor => sponsor.nome === dadosSponsor.nome );
        
        if ( validaSponsor ){
            return res.status( 409 ).send( {erro: true, mensagem: 'O Sponsor já existe'} );
        }
        
        // Adiciona o novo Sponsor
        sponsors.push( dadosSponsor );
        
        // Guarda os dados dos Sponsors
        guardaSponsors( sponsors );
        
        res.status( 201 ).send( {erro: false, mensagem: 'O Sponsor foi adicionado com sucesso'} );
    });

    app.put('/sponsors/modifica/:nome', ( req, res ) => {
        const nome = req.params.nome;
        
        const dadosSponsor = req.body;
        
        const sponsors = leSponsors();
        
        const validaSponsor = sponsors.find( sponsor => sponsor.nome === nome );
        
        if (!validaSponsor){
            return res.status( 409 ).send( {erro:true, mensagem: 'O Sponsor não existe'} );
        }
        
        const modificaSponsor = sponsors.filter( sponsor => sponsor.nome !== nome );
        
        modificaSponsor.push( dadosSponsor );
        
        guardaSponsors( modificaSponsor );
        
        res.status( 200 ).send( {erro: false, mensagem: 'O Sponsor foi modificado'} );
    });

    /* Elimina Sponsor - uso do método DELETE*/
    app.delete('/sponsors/elimina/:nome', ( req, res ) => {
        const nome = req.params.nome;
        
        const sponsors = leSponsors();
        
        const validaSponsor = sponsors.filter( sponsor => sponsor.nome !== nome );
        
        if ( sponsors.length === validaSponsor.length ){
            return res.status( 409 ).send( {erro: true, mensagem: 'Sponsor não existe'} );
        }
        
        guardaSponsors( validaSponsor );
        
        res.send( {erro:false, mensagem: 'O Sponsor foi removido'} );
    });
};

module.exports = sponsorRoutes;