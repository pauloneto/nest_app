import { useForm, Controller }   from 'react-hook-form';
import { zodResolver }           from '@hookform/resolvers/zod';
import { Button }                from 'primereact/button';
import { InputText }             from 'primereact/inputtext';
import { InputNumber }           from 'primereact/inputnumber';
import { useRouter }             from 'next/router';
import { API_URL }               from '../../../config/api';
import { Produto }               from '../../../models/produto';
import { z }                     from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect }             from 'react';

// Definindo o schema do Zod para validação com mensagens personalizadas
export const produtoSchema = z.object({
  id:         z.number(), // Certifique-se de que o id é um campo obrigatório
  nome:       z.string().min(1,    { message: 'Nome é obrigatório' }),
  preco:      z.number().min(0.01, { message: 'Preço deve ser maior que 0' }).positive({ message: 'Preço deve ser um valor positivo' }),
  quantidade: z.number().min(1,    { message: 'Quantidade deve ser maior que 0' }).int({ message: 'Quantidade deve ser um número inteiro' }),
});

// Função para buscar o produto pela API
const fetchProduto = async (id: string ) => {
  const response = await fetch(`${API_URL}/produtos/${id}`);
  if (!response.ok) {
    throw new Error('Erro ao carregar o produto');
  }
  return response.json();
};

// Função para atualizar o produto
const updateProduto = async (produto: Produto) => {
  const response = await fetch(`${API_URL}/produtos/${produto.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(produto),
  });

  if (!response.ok) {
    throw new Error('Erro ao atualizar o produto');
  }
  return response.json();
};

const EditProduto: React.FC = () => {
  const { control, handleSubmit, formState: { errors }, setValue, register } = useForm<Produto>({
    resolver: zodResolver(produtoSchema),
  });
  const router = useRouter();
  const { id } = router.query;

  // Usando React Query para buscar o produto
  const { data: produto, error, isLoading, isError } = useQuery({
    queryKey: ['produto', id],
    queryFn: () => fetchProduto(id as string),
    enabled: !!id, // Só executa a consulta quando o id está presente
  });

  // Usando a mutação para atualizar o produto
  const { mutate, isError: isMutationError, isSuccess, error: mutationError } = useMutation({
    mutationFn: updateProduto,
    onSuccess: () => {
      router.push('/produtos');
    },
    onError: (err: unknown) => {
      console.error('Erro ao atualizar o produto:', err);
    },
  });

  // Função de manipulação de envio de dados
  const onSubmit = async (data: Produto) => {
    console.log('Dados do formulário ao enviar:', data);  // Verifique o valor do produto que está sendo enviado
    mutate(data);
  };

  // Função para verificar se o erro possui a propriedade 'message'
  const getMutationErrorMessage = (error: unknown): string => {
    if (error && typeof error === 'object' && 'message' in error) {
      return (error as { message: string }).message;
    }
    return 'Erro desconhecido';
  };

  // Esse useEffect agora vai rodar sempre que 'produto' for alterado
  useEffect(() => {
    if (produto) {
      const preco = parseFloat(produto.preco.toString()).toFixed(2); 
      const precoNumero = Number(preco);
      setValue('id',         produto.id);  // Garantir que o 'id' seja atribuído corretamente
      setValue('nome',       produto.nome);
      setValue('preco',      precoNumero);
      setValue('quantidade', produto.quantidade);
      console.log('Valor do preço após setValue (useEffect):', produto.preco);
    }
  }, [produto, setValue]);

  // Renderização condicional do JSX
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (isError) {
    return <div>{(error as Error).message}</div>;
  }

  if (!produto) {
    return <div>Produto não encontrado</div>;
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)} className="form-box">
        <h2>Editar Produto</h2>

        {/* Campo ID (hidden) */}
        <input type="hidden" {...register("id")} />

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
                value={field.value ?? 0} // Garantindo que o valor seja um número
                onValueChange={(e) => {
                  console.log('Valor recebido no preço:', e.value); // Verifique o tipo do valor recebido
                  field.onChange(e.value ?? 0); // Garantindo que o valor seja um número
                }}
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
                value={field.value ?? 0} // Garantindo que o valor seja um número
                onValueChange={(e) => field.onChange(e.value ?? 0)} // Garantindo que o valor seja um número
                mode="decimal"
                placeholder="Quantidade"
                className={`p-inputnumber ${error ? 'p-invalid' : ''}`}
              />
            )}
          />
          {errors.quantidade && <div style={{ color: 'red' }}>{errors.quantidade?.message}</div>}
        </div>

        {/* Exibindo o status de carregamento, erro e sucesso */}
        {isMutationError && <div style={{ color: 'red' }}>Erro: {getMutationErrorMessage(mutationError)}</div>}
        {isSuccess && <div>Produto atualizado com sucesso!</div>}

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button type="submit" className="p-button-success p-mr-2" style={{ width: '100%' }} label="Salvar" />
          <Button
            label="Voltar"
            className="p-button-secondary"
            style={{ width: '100%' }}
            icon="pi pi-arrow-left"
            onClick={() => router.push('/produtos')}
          />
        </div>
      </form>
    </div>
  );
};

export default EditProduto;
