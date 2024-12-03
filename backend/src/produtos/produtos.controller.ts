import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProdutosService } from './produtos.service';

@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Post()
  create(@Body() data: { nome: string; preco: number, quantidade: number }) {
    return this.produtosService.create(data);
  }

  @Get()
  findAll() {
    return this.produtosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produtosService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() produtoData: { nome: string; preco: number; quantidade: number }) {
    return this.produtosService.update(+id, produtoData);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.produtosService.delete(+id);
  }
}
