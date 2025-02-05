export interface OpenAIInterface{
    res: {
        role: string,
        content: string
        tools: [{
            name: string,
            arguments: object
        }]
    },
    
}

export interface OpenAiToolsInterface{
    name: string,
    arguments: object
}