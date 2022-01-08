const sponsorRoutes = require('./sponsors');

const expertRoutes = require('./experts');

const appRouter = ( app, fs ) => {

    app.get('/', ( req, res ) => {

        res.status(200).send('Default route');

    });

    sponsorRoutes( app, fs );

    expertRoutes( app, fs );

};

module.exports = appRouter;