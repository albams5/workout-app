import dotenv from 'dotenv'

type TConfig = {
    [key:string]: EnvironmentConfig
}

type EnvironmentConfig = {
    app: AppConfig;
    db: DBConfig;
}

type AppConfig = {
    PORT: string | number
}

type DBConfig = {
    URI: string
}

if(process.env.NODE_ENV === 'production'){
    dotenv.config({path: '.env.production'})
} else {
    dotenv.config({path: '.env.development'})
}

const ENV = process.env.NODE_ENV ?? 'development'
const {
    PORT,
    DB_URI
} = process.env


const CONFIG:TConfig = {
    development: {
        app: {
            PORT: PORT || 4001
        },
        db: {
            URI: DB_URI || "postgres://postgres:password@127.0.0.1:5432/workout_app"
        }
    },
    production: {
        app: {
            PORT: PORT || 8081
        },
        db: {
            URI: DB_URI || "postgres://postgres:password@127.0.0.1:5432/workout_app"
        }
    }
}

export default CONFIG[ENV]