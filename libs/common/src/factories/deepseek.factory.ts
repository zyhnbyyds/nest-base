import { Provider } from '@nestjs/common'
import OpenApi from 'openai'
import { FactoryName } from '../enums/factory'

const DeepSeekFactory: Provider = {
  provide: FactoryName.DeepSeekFactory,
  useFactory: () => {
    const deepSeek = new OpenApi({
      apiKey: process.env.DEEP_SEEK_APP_KEY,
      baseURL: process.env.DEEP_SEEK_APP_BASE_URL,
    })
    return deepSeek
  },
}

export default DeepSeekFactory
