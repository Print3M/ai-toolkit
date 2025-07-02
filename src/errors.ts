export class AiEmptyResponseError extends Error {
    constructor() {
        super("The response from AI API is empty or undefined")
        this.name = "AiEmptyResponseError"
    }
}

export class AiInvalidResponse extends Error {
    constructor() {
        super("The response from AI API is invalid")
        this.name = "AiInvalidResponse"
    }
}
