import mongoose from 'mongoose'
import { Logger } from 'borgen'
import seedDatabase from './seedDb.ts'
import { ENV } from '../lib/environments.ts'

mongoose.set('strictQuery', true)

const connectDb = (server: () => void): void => {
	mongoose
		.connect(ENV.MONGO_URI)
		.then(() => {
			let isInitialized = seedDatabase()

			if (isInitialized) {
				server()
			} else {
				process.exit(1)
			}
		})
		.catch((err) => {
			Logger.error({ message: 'connectDb' + err.message })
			console.log(err)
		})
}

export default connectDb


