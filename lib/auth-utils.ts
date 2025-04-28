import { randomBytes, pbkdf2Sync } from "crypto"

// Generate a secure password hash using PBKDF2
export async function hashPassword(password: string): Promise<string> {
  // Generate a random salt
  const salt = randomBytes(16).toString("hex")

  // Hash the password with the salt using PBKDF2
  const hash = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")

  // Return the salt and hash combined
  return `${salt}:${hash}`
}

// Compare a password with a hash
export async function comparePasswords(plainPassword: string, storedHash: string): Promise<boolean> {
  // Split the stored hash into salt and hash
  const [salt, hash] = storedHash.split(":")

  // Hash the plain password with the same salt
  const calculatedHash = pbkdf2Sync(plainPassword, salt, 1000, 64, "sha512").toString("hex")

  // Compare the calculated hash with the stored hash
  return calculatedHash === hash
}
