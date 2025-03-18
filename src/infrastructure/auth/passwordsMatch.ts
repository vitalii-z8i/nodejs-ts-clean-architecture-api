import bcrypt from 'bcrypt'

export default async (password: string, encryptedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, encryptedPassword)
}
