const path = require('path');
const ROUTES_DIR = path.join(__dirname, 'routes');
const config = require('config');
const PORT = config.get('port') || 5000;
const db = require(path.join(__dirname, 'db'));
const messengerIO = require(path.join(__dirname, 'messenger_io'));

const dbConnection = db();
app = require(path.join(ROUTES_DIR, 'routes'));
app.listen(PORT, () => console.log(`Server has been started on port ${PORT}...`));