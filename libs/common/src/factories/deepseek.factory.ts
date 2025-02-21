import { Provider } from '@nestjs/common'
import OpenApi from 'openai'
import { FactoryName } from '../enums/factory'

const DeepSeekFactory: Provider = {
  provide: FactoryName.DeepSeekFactory,
  useFactory: () => {
    const deepSeek = new OpenApi({
      apiKey: process.env.ALI_DEEPDEEK_APP_KEY,
      baseURL: process.env.ALI_DEEPSEEK_APP_BASE_URL,
    })
    return deepSeek
  },
}

export default DeepSeekFactory
