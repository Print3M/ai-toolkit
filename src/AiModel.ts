import OpenAI from "openai"
import { AiEmptyResponseError } from "./errors"

interface AiModelConstructor {
    apiKeyEnv: string
    model: string
    baseUrl?: string
    temperature?: number
    responseFormat?: string
}

export class AiModel {
    #client: OpenAI
    #args: AiModelConstructor

    constructor(args: AiModelConstructor) {
        const apiKey = process.env[args.apiKeyEnv]

        if (!apiKey) throw Error(`${args.apiKeyEnv} environ is empty or undefined`)

        this.#client = new OpenAI({
            apiKey: apiKey,
            baseURL: args.baseUrl,
        })
        this.#args = args
    }

    async sendPrompt(system: string, user: string) {
        const resp = await this.#client.chat.completions.create({
            model: this.#args.model,
            messages: [
                {
                    role: "system",
                    content: system,
                },
                {
                    role: "user",
                    content: user,
                },
            ],
            temperature: this.#args.temperature,
            response_format: { type: "json_object" },
        })

        const { content } = resp.choices[0].message

        if (!content) throw new AiEmptyResponseError()

        return content
    }
}
