import { Controller, Get, Query, Res } from "@nestjs/common";
import * as fs from 'fs'
import { Public } from "./common/decorators/public.decorator";
import * as path from 'path';

@Controller()
export class AppController{
    @Get()
    @Public()
    async main(@Query('requestfile') filepath: string, @Res() res) {
        try {
            const basePath = path.resolve('./src/');
            const safePath = filepath
                ? path.resolve(basePath, filepath)
                : path.join(basePath, 'web/html/index.html');

            // Validar que el archivo está dentro del directorio permitido
            if (!safePath.startsWith(basePath)) {
                return res.status(400).send('Invalid file path');
            }

            // Leer el archivo
            const fileContent = await fs.promises.readFile(safePath);

            // Configurar encabezado correcto para SVG o HTML
            const contentType = filepath?.endsWith('.svg')
                ? 'image/svg+xml'
                : filepath?.endsWith('.js')
                    ? 'application/json' : filepath?.endsWith('.css')
                        ? 'text/css' : 'text/html';
            res.setHeader('Content-Type', contentType);

            // Enviar contenido
            res.setHeader('Cache-Control', 'no-store');  // No almacenar en caché
            res.setHeader('Pragma', 'no-cache');         // Asegura que no se use la caché
            res.setHeader('Expires', '0'); 
            return res.send(fileContent);
        } catch (error) {
            console.error(error);
            return res.status(404).send('File not found');
        }
    }

}