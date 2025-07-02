import nunjucks from "nunjucks"

interface AiPromptArgs<T> {
    promptTemplates: { system: string; user: string }
    promptParams: { system?: object; user?: object }
    responseParser: (v: string) => T
    responseValidator: (v: T) => boolean
}

export class AiPrompt<T> {
    #args: AiPromptArgs<T>

    constructor(args: AiPromptArgs<T>) {
        this.#args = args
    }

    async buildPrompts() {
        const env = nunjucks.configure({ autoescape: false })
        const templates = this.#args.promptTemplates

        const user = nunjucks.compile(templates.user, env).render({
            ...this.#args.promptParams.user,
        })

        const system = nunjucks.compile(templates.system, env).render({
            ...this.#args.promptParams.system,
        })

        return {
            user,
            system,
        }
    }

    parseResponse(response: string) {
        return this.#args.responseParser(response)
    }

    isResponseValid(response: T) {
        try {
            return this.#args.responseValidator(response)
        } catch {
            return false
        }
    }
}
