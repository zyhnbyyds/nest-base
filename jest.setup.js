const dotenv = require('dotenv')

dotenv.config({ path: ['.env', '.env.dev'] })

process.env.NODE_ENV = 'dev'
