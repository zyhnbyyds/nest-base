import { registerAs } from '@nestjs/config'

export default registerAs('wx', () => ({
  appid: process.env.WX_APPID_GZ,
  secret: process.env.WX_SECRET_GZ,
  token: process.env.WX_TOKEN,
  templateId: process.env.WX_TEST_TEMPLATE_ID,
}))
