import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { OpenAiService } from "./openai.service";
import { Public } from "src/common/decorators/public.decorator";
import { OpenAiMessageDTO } from "./dtos/openai-message.dto";
import { ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { OpenAiChatClientDTO } from "./dtos/openai-chatclient.dto";

@Controller("openai")
@ApiBearerAuth()
export class OpenAiController{
    constructor(
        private openaiService: OpenAiService,
    ){}

    @Post()
    @ApiBody({ type: OpenAiMessageDTO })
    async message(@Body() message: OpenAiMessageDTO){
        return await this.openaiService.message(message);
    }

    @Post("/getchat")
    async getChat(@Body() client: OpenAiChatClientDTO){
        return await this.openaiService.readChat(client);
    }

    @Post("/redefinechat")
    async postChat(@Body() client: OpenAiMessageDTO){
        return await this.openaiService.postChat(client);
    }

    @Post("login/:username")
    async login(@Param("username") username: string){

    }


} 