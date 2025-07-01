import OpenAI from "openai"

interface AiModelConstructor {
    apiKeyEnv: string
    model: string
    baseUrl?: string
    temperature?: number
}

export class AiModel {
    #client: OpenAI
    #args: AiModelConstructor

    constructor(args: AiModelConstructor) {
        const apiKey = process.env[args.apiKeyEnv]

        if (!apiKey) throw Error(`${args.apiKeyEnv} environ is not defined`)

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
        })

        const { content } = resp.choices[0].message

        if (!content) return

        return content
    }
}
