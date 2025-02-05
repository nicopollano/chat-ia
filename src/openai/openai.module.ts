import { forwardRef, Module } from "@nestjs/common";
import { OpenAiController } from "./openai.controller";
import { OpenAiService } from "./openai.service";
import { OpenAiCallbacks } from "./openai.callbacks";
import { ProductModule } from "src/product/product.module";

@Module({
    imports: [forwardRef(()=>ProductModule)],
    controllers: [OpenAiController],
    providers: [OpenAiService, OpenAiCallbacks],
})
export class OpenAiModule{}