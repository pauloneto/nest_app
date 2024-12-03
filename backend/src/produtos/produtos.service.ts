import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProdutosService {
  constructor(private readonly prisma: PrismaService) {}

  private validateProduto(data: { nome: string; preco: number; quantidade: number }) {
    let msg_error = '';
    
    // Verificar se o nome do produto é fornecido e não é vazio
    if (!data.nome || data.nome.trim() === '') {
      msg_error += 'O nome do produto é obrigatório. ';
    }

    // Verificar se o preço é um valor válido (não negativo)
    if (data.preco < 0) {
      msg_error += 'O preço do produto não pode ser menor que zero. ';
    }

    // Verificar se a quantidade é válida (não negativa)
    if (data.quantidade < 0) {
      msg_error += 'A quantidade do produto não pode ser menor que zero. ';
    }

    // Se houver erros de validação, lançar uma exceção com a mensagem detalhada
    if (msg_error !== '') {
      throw new BadRequestException({
        statusCode: 422,
        message: 'Erro de validação',
        details: msg_error.trim(),
      });
    }
  }

  // Criação de um novo produto
  async create(data: { nome: string; preco: number; quantidade: number }) {
    this.validateProduto(data);  // Validação antes de criar o produto

    try {
      return await this.prisma.produto.create({
        data: {
          nome: data.nome,
          preco: data.preco,
          quantidade: data.quantidade,
        },
      });
    } catch (error) {
      throw new BadRequestException({
        statusCode: 422,
        message: 'Erro ao criar o produto.',
        details: error.message,
      });
    }
  }

  // Retornar todos os produtos
  async findAll() {
    try {
      return await this.prisma.produto.findMany({
        orderBy: {
          updatedAt: 'desc',  // Ordena os produtos pela data de atualização em ordem decrescente
        },
    })
    } catch (error) {
      throw new BadRequestException({
        statusCode: 422,
        message: 'Erro ao buscar produtos.',
        details: error.message,
      });
    }
  }

  // Encontrar um produto por ID
  async findOne(id: number) {
    try {
      const produto = await this.prisma.produto.findUnique({ where: { id: id } });
      
      if (!produto) {
        throw new NotFoundException({
          statusCode: 404,
          message: 'Erro ao buscar produto.',
          details: `Produto com id ${id} não encontrado.`,
        });
      }

      return produto;
    } catch (error) {
      throw new BadRequestException({
        statusCode: 422,
        message: 'Erro ao buscar o produto.',
        details: error.message,
      });
    }
  }

  // Atualizar um produto existente
  async update(id: number, produtoData: { nome: string; preco: number; quantidade: number }) {
    this.validateProduto(produtoData);  // Validação antes de atualizar o produto

    try {
      return await this.prisma.produto.update({
        where: { id },
        data: {
          ...produtoData,
          updatedAt: new Date(),  // Atualizando o campo updatedAt manualmente
        },
      });
    } catch (error) {
      throw new BadRequestException({
        statusCode: 422,
        message: 'Erro ao atualizar o produto.',
        details: error.message,
      });
    }
  }

  // Excluir um produto
  async delete(id: number) {
    try {
      const produto = await this.prisma.produto.findUnique({
        where: { id: id },
      });

      if (!produto) {
        throw new NotFoundException({
          statusCode: 404,
          message: 'Erro ao excluir o produto.',
          details: `Produto com id ${id} não encontrado.`
        });
      }

      await this.prisma.produto.delete({
        where: { id: id },
      });
      return { message: `Produto com id ${id} excluído com sucesso.` };
    } catch (error) {
      throw new BadRequestException({
        statusCode: 422,
        message: 'Erro ao excluir o produto.',
        details: error.message,
      });
    }
  }
}
