import './LoadEnv'; // Must be the first import
import app from '@server';
import logger from 'src/utils/Logger';

// Start the server
const port = Number(4000);
app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});
