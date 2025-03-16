import readline from "node:readline"
import { services } from "../../config"
import { ScriptsController } from "../../controllers"
import { IError } from "../../interfaces"
import { CreateUser } from "../../use-cases/user"
import { User } from "../../entities"

const consoleReader = readline.createInterface({ input: process.stdin, output: process.stdout });
function getInput(prompt: string): Promise<string> {
  return new Promise<string>((resolve, _reject) => {
    consoleReader.question(prompt, (answer: string) => {
      resolve(answer)
    })
  })
}
const createUser = new CreateUser(services.user.validators.create, new services.user.DAO(), services.utils.encryptPassword)
const controller = new ScriptsController(createUser)

const createAdmin = async (body: { email: string, password: string }) => {
    try {
      await controller.createAdmin({ body }).then((admin: User) => {
        console.log('Admin Created!')
        console.log(`You can now login with: ${admin.email}`)
      })
    } catch (error) {
      const response = error as IError
      console.log(`${response.name}: ${response.message}`)
      if (response.details) {
        console.log(response.details)
      }
    }
}

const cli = async () => {
  const command = process.argv[2]
  switch (command) {
    case 'create-admin':
      console.log('Executing admin creation process...')

      const body = {
        email: await getInput('Enter Admin email address: '),
        password: await getInput('Create Admin password: '),
      }
      consoleReader.close()

      await createAdmin(body)
      break
    default:
      console.error(`Don't know how to handle command: ${command}. Supported commands: create-admin`)
      break
    }
  process.exit()
}

export default cli
