import axios                   from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver }         from '@hookform/resolvers/zod';
import { Button }              from 'primereact/button';
import { InputText }           from 'primereact/inputtext';
import { InputNumber }         from 'primereact/inputnumber';
import { API_URL }             from '../../config/api';
import { Produto }             from '../../models/produto';
import { useRouter }           from 'next/router';
import { z }                   from 'zod';
import { useMutation }         from '@tanstack/react-query';

// Definindo o schema do Zod para validação com mensagens personalizadas
export const produtoSchema = z.object({
  nome:       z.string().min(1,    { message: 'Nome é obrigatório' }),
  preco:      z.number().min(0.01, { message: 'Preço deve ser maior que 0' }).positive({ message: 'Preço deve ser um valor positivo' }),
  quantidade: z.number().min(1,    { message: 'Quantidade deve ser maior que 0' }).int({ message: 'Quantidade deve ser um número inteiro' }),
});

// Função que vai criar o produto
const createProduto = async (produto: Produto) => {
  const response = await axios.post(`${API_URL}/produtos`, produto, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

const CreateProduto = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<Produto>({
    resolver: zodResolver(produtoSchema),
  });
  const router = useRouter();

  // Tipando corretamente a mutação
  const { mutate, isError, isSuccess, error } = useMutation({
    mutationFn: createProduto,
    onSuccess: () => {
      router.push('/produtos');
    },
    onError: (err: unknown) => {
      console.error('Erro ao criar o produto:', err);
    },
  });

  const onSubmit = async (data: Produto) => {
    mutate(data);
  };

  // Função para extrair a mensagem de erro
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Erro desconhecido';
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)} className="form-box">
        <h2>Cadastrar Produto</h2>

        {/* Nome */}
        <div className="p-field">
          <label htmlFor="nome">Nome</label>
          <Controller
            name="nome"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <InputText
                id="nome"
                {...field}
                placeholder="Nome"
                className={`p-inputtext ${error ? 'p-invalid' : ''}`}
              />
            )}
          />
          {errors.nome && <div style={{ color: 'red' }}>{errors.nome?.message}</div>}
        </div>

        {/* Preço */}
        <div className="p-field">
          <label htmlFor="preco">Preço R$</label>
          <Controller
            name="preco"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <InputNumber
                id="preco"
                value={field.value ?? 0}
                onValueChange={(e) => field.onChange(e.value ?? 0)} // Garantindo que o valor seja sempre um número
                mode="decimal"
                placeholder="Preço"
                className={`p-inputnumber ${error ? 'p-invalid' : ''}`}
              />
            )}
          />
          {errors.preco && <div style={{ color: 'red' }}>{errors.preco?.message}</div>}
        </div>

        {/* Quantidade */}
        <div className="p-field">
          <label htmlFor="quantidade">Quantidade</label>
          <Controller
            name="quantidade"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <InputNumber
                id="quantidade"
                value={field.value || 0}
                onValueChange={(e) => field.onChange(e.value)}
                mode="decimal"
                placeholder="Quantidade"
                className={`p-inputnumber ${error ? 'p-invalid' : ''}`}
              />
            )}
          />
          {errors.quantidade && <div style={{ color: 'red' }}>{errors.quantidade?.message}</div>}
        </div>

        {/* Exibindo o status de carregamento, erro e sucesso */}
        {isError && <div style={{ color: 'red' }}>Erro: {getErrorMessage(error)}</div>}
        {isSuccess && <div>Produto criado com sucesso!</div>}

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button type="submit" className="p-button-success p-mr-2" style={{ width: '100%' }} label="Cadastrar" />
          <Button label="Voltar" className="p-button-secondary" style={{ width: '100%' }} icon="pi pi-arrow-left" onClick={() => router.push('/produtos')} />
        </div>
      </form>
    </div>
  );
};

export default CreateProduto;
