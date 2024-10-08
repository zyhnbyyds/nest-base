import type { Options } from 'nodemailer/lib/mailer'
import { randomCode } from './random'

/**
 * Generate email options
 * @param options
 * @returns
 */
export function combineEmailOptions(options: Options): [Options, string] {
  const code = randomCode(6)
  const { text, subject } = options
  return [{
    from: process.env.EMAIL_USER,
    subject: text as string || 'Verification code',
    text: subject || `text - Your verification code is <h3 style="color: red">${code}</h3>`,
    to: options.to,
  }, code]
}
