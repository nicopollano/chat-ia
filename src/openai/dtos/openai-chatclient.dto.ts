import { OmitType } from "@nestjs/swagger";
import { OpenAiMessageDTO } from "./openai-message.dto";

export class OpenAiChatClientDTO extends OmitType(OpenAiMessageDTO, ['message']) {
    
}