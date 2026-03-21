import { Logger } from "borgen";



function seedDatabase() {
  Logger.info({ message: "Initializing database..." });
  try {
    return true;
  } catch (err) {
    Logger.error({ message: "Database initialization failed : " + err });
    return false;
  }
}

export default seedDatabase;




