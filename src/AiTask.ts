import type AiPrompt from "./AiPrompt"
import type AiModel from "./AiModel"
import { retryWithTimeout, type RetryOptions } from "./utils"

type RetryStrategy = RetryOptions

interface AiServiceArgs<T> {
    prompt: AiPrompt<T>
    model: AiModel
    retryStrategy?: RetryOptions
}

class AiTask<T> {
    #model: AiModel
    #prompt: AiPrompt<T>
    #retryStrategy: RetryStrategy

    constructor(args: AiServiceArgs<T>) {
        this.#model = args.model
        this.#prompt = args.prompt
        this.#retryStrategy = args.retryStrategy || {
            msInterval: 0,
            retries: 0,
            msTimeout: 0,
        }
    }

    async execute() {
        const prompts = await this.#prompt.getPrompts()

        const resp = await retryWithTimeout(
            () => this.#model.sendPrompt(prompts.system, prompts.user),
            this.#retryStrategy
        )

        if (!resp) return

        const data = await this.#prompt.parseResponse(resp)

        if (!this.#prompt.isResponseValid(data)) return

        return data
    }
}

export default AiTask
