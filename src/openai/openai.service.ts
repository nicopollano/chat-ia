import { BadRequestException, Body, Injectable, InternalServerErrorException } from "@nestjs/common";
import { promises as fs } from "fs";
import { OpenAiMessageDTO } from "./dtos/openai-message.dto";
import { formatHour } from "src/common/utils/common.utils";
import { OpenAiCallbacks } from "./openai.callbacks";
import { OpenAIInterface, OpenAiToolsInterface } from "src/common/interfaces/response.interface";
import {  } from "express";
import { OpenAiChatClientDTO } from "./dtos/openai-chatclient.dto";
@Injectable()
export class OpenAiService{
    private readonly dir = __dirname + "/../../chats";
    private fCalled = [];
    private fCalledArgs = [];
    private fCalledResults = [];
    private tools_monitor = [];
    

    callbacks = {
        getCat : (stockName: string) =>  "ricota",
        getProduct : (modelName: string) => "No dispone",
        getPrice : async (modelName: string) => await this.openAiCallbacks.getPrice(modelName),
        getQuantity : async (modelName: string) => await this.openAiCallbacks.checkQuantity(modelName),
        checkInventory : async (productoName: string) => await this.openAiCallbacks.checkInventory(productoName),
        checkMarca: async (name: string) => await this.openAiCallbacks.checkBrand(name),
        allProducts: async () =>  await this.openAiCallbacks.getAllProducts()
    }

    constructor(
        private openAiCallbacks : OpenAiCallbacks
    ){
    } 

    async message(@Body() userMessage : OpenAiMessageDTO){
        const {userid, clientNumber, message, app} = userMessage;
        this.fCalled = [];
        this.fCalledArgs = [];
        this.fCalledResults = [];
        this.tools_monitor = [];

        const path = `${this.dir}/${userid}/${app}`;
        const fileId = clientNumber;
        const result = await fs.mkdir(path, {recursive: true})

        const file = await fs.open(`${path}/${fileId}`, "a+");
        
        if(!file) throw new InternalServerErrorException("Cannot save conversation");

        let chathistory;

        chathistory = {
            messages: JSON.parse("["+(await file.readFile()).toString() + "]")
        }
        const clientMessage = this.generateMessage(userMessage);
        chathistory.messages.push(clientMessage);
        //console.log(chathistory);

        const response_raw = await fetch("http://192.168.2.22:3000/chat",{
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                prompt: chathistory.messages.map((t) => {
                    if("tools" in t){
                        delete t.tools
                    }
                    return t
                }),
                max_tokens: 300
            })
        })
        .then((data) => data.text())
        
        let response : OpenAIInterface = this.getJson(response_raw)

        //response = JSON.parse(response as string).res as OpenAIInterface;

        response = await this.checkResponse(response, chathistory, clientMessage, []);

        //console.log(response.choices[0]);

        chathistory.messages.push({
            role: "assistant",
            content: response.res.content || ""
        })

        file.write(",\n" + JSON.stringify(clientMessage));
        file.write(",\n" + JSON.stringify({
            role: "assistant",
            content: response.res.content ?? "",
            tools: JSON.stringify(this.tools_monitor)
        }));



        file.close();
        
        let response_fixed: string = response.res.content.replaceAll('\n', "\n\t\t   ") || "";
        const f_result = null;
        const f = null;
        console.log("\x1b[36mMessage:\x1b[0m " + message);
        console.log(`   | \x1b[33m[${formatHour()}]\x1b[31m ${this.fCalled[0] || ""}\x1b[32m ${this.fCalledArgs[0] || ""} - ${this.fCalledResults[0] || ""}\x1b[0m`)
        for(let i = 1; i < this.fCalled.length; i++){
            console.log(`   |           \x1b[31m ${this.fCalled[i] || ""}\x1b[32m ${this.fCalledArgs[i] || ""} - ${this.fCalledResults[i] || ""}\x1b[0m`);
        }
        console.log("   |");
        console.log("   └--> \x1b[35mResponse: \x1b[0m", response_fixed, null);
        console.log("");

        return {
            "content": response_fixed,
            "tools": this.tools_monitor
        };
    }

    generateMessage(userMessage: OpenAiMessageDTO){
        return {
         role: "user",
         content: userMessage.message
        }
    }

    async CallBacks(func: OpenAiToolsInterface){
        
        let f = func.name
        let i = -1;
        let args : string = "";
        args = JSON.stringify(func.arguments);
        console.log("f: ", f, "\nArgs: ", args);
        const fn = this.callbacks[f];
        this.fCalled.push(f || "undefined");
        this.fCalledArgs.push(args || "void");

        const tool_res = {
            name: f,
            arguments : func.arguments,
            result: ""
        };

        if(fn){
            const result2: string = await fn(args);
            this.fCalledResults.push(result2);    
            tool_res.result = result2;
            this.tools_monitor.push(tool_res);
            return String(result2)
        }
        
        this.fCalledResults.push("");

        this.tools_monitor.push(tool_res);
        return "";
    }

    async checkResponse(response : OpenAIInterface, chathistory, clientMessage, functionsMessage): Promise<OpenAIInterface>{
        if(response.res.tools.length >= 0){
            //let f : string= JSON.parse(response.content.replaceAll("'", '"')).content;
            if(typeof(response.res.tools) == "string"){
                const temp_tool: string = (response.res.tools as string).replaceAll('\n', ",");
                response.res.tools = JSON.parse(`[${temp_tool}]`)
            }
            let f_result: string[] = [];
            for(let f of response.res.tools){
                try{
                    if(!f.name) f = f[0]
                }catch{
                    f = f[0];
                }
                const f_res = await this.CallBacks(f);
                f_result.push(f_res);
            }

            //let f_result = await this.CallBacks(f);
            const message_parameter = {
                role: "user",
                content: `La pregunta del cliente es: ${clientMessage.content}.\n\nEl resultado de la herramienta fue: '${f_result.join('.')}'. Continua con formando la respuesta para la pregunta del cliente. No debes decir que herramientas usaste, solo saca la conclusion.`
            };

            if(f_result.length > 0){
                let response_callbacks: string | OpenAIInterface = await fetch("http://192.168.2.22:3000/chat", {
                    method: 'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({
                        prompt: [
                            //chathistory.messages[0],
                            {
                                "role": "system",
                                "content": "Hablas español. A continuacion se te dara la pregunta del cliente y los resultados de ciertas herramientas, la respuesta esta contenida por los corchetes []; Debes dar una respuesta adecuada al cliente en base a los resultados. Limitate solo a dar la respuesta."
                            },
                            message_parameter
                        ],
                        max_tokens: 300
                    })
                })
                .then((data) => data.text());
                response_callbacks = this.getJson(response_callbacks);
                //console.log("\n=====================\n",f_result, "\n----\n" , response_callbacks.choices[0].message, "\n=!=!=!=!=!=!!=!=!=!=!=\n")
                if(response_callbacks.res.tools.length > 0){
                    functionsMessage.push(message_parameter);
                    functionsMessage.push(response_callbacks.res.tools);
                    return await this.checkResponse(response, chathistory, clientMessage, [])
                }

                return response_callbacks;
            }
        }
        return response;
    }

    getJson(response: any) : OpenAIInterface{
        response = JSON.parse(response);
        try{
            response.res.tools = JSON.parse(response.res.tools);
        }
        catch{ console.log("parse error"); }

        return response
    }

    async readChat(client: OpenAiChatClientDTO){
        const { app, clientNumber, userid } = client;
        const path = `${this.dir}/${userid}/${app}`;
        const fileId = clientNumber;

        const file = await fs.open(`${path}/${fileId}`, "r");

        if(!file) throw new BadRequestException("Client not exist");

        const file_content = (await file.readFile()).toString();

        file.close();

        return file_content;
    }

    async postChat(data: OpenAiMessageDTO){
        const { app, clientNumber, userid, message } = data;
        const path = `${this.dir}/${userid}/${app}`;
        const fileId = clientNumber;

        const file = await fs.open(`${path}/${fileId}`, "w+");

        if(!file) throw new BadRequestException("Client not exist");

        const array = JSON.parse(`[${message}]`);
        const last_content = array.pop();

        for(let msg of array){
            await file.write(JSON.stringify(msg) + ",\n");
        }
        file.write(JSON.stringify(last_content));
        file.close();

        return true;
    }

}

