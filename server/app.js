const path = require('path');
const ROUTES_DIR = path.join(__dirname, 'routes');
const MODELS_DIR = path.join(__dirname, 'models');
const config = require('config');
const PORT = config.get('port') || 5000;
const db = require(path.join(MODELS_DIR, 'db'));

const dbConnection = db();
app = require(path.join(ROUTES_DIR, 'routes'));
app.listen(PORT, () => console.log(`Server has been started on port ${PORT}...`));