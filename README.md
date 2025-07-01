# ai-toolkit

Simple TypeScript toolkit to work with atomic AI (LLM) tasks. Automated tasks:

1. Initialize AI model (`openai` package) with API key from environs.
2. Get system and user prompt template.
3. Inject values into prompt templates (`Nunjucks` template engine).
4. Send a prompt to AI model.
5. Get a response from AI model.
6. Parse the response type-safely.
7. Validate the parsed response.

This is the example usage of the toolkit:

```javascript
    type ReturnedData = {
        title: string
        summary: string
    }

    // Create model
    const model = new AiModel({
        apiKeyEnv: "GEMINI_AI_KEY",
        model: "gemini-2.0-flash",
        baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai/",
    })

    // Create prompt
    const prompt = new AiPrompt<ReturnedData>({
        
        promptTemplates: {
            system: "You are world class expert in article summarization.",
            user: "Summary this: {{ title }}, {{ article }}",
        },
        promptParams: {
            user: {
                title: "Hello world!",
                article: "siema"
            },
        },
        responseParser: (v) => JSON.parse(v),
        responseValidator: (v) => v.title.length > 0,
    })

    // Create task
    const task = new AiTask({
        model,
        prompt,
    })

    // Execute task and get result
    const result = await task.execute()
```
