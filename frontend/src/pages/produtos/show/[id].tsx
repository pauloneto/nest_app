import { useRouter } from 'next/router';
import { Button }    from 'primereact/button';
import { useQuery }  from '@tanstack/react-query'; // Importando React Query
import { API_URL }   from '../../../config/api';

// Função para buscar o produto pela API
const fetchProduto = async (id: string) => {
  const response = await fetch(`${API_URL}/produtos/${id}`);
  if (!response.ok) {
    throw new Error('Erro ao carregar o produto');
  }
  return response.json();
};

const ShowProduto: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // Pegando o ID do produto da URL

  // Usando React Query para buscar o produto
  const { data: produto, error, isLoading, isError } = useQuery({
    queryKey: ['produto', id], // Chave da consulta, incluindo 'produto' e o ID
    queryFn: () => fetchProduto(id as string), // Função para buscar o produto
    enabled: !!id, // Só executa a consulta quando o ID está presente
  });

  // Caso o produto não seja encontrado ou haja erro, exibe uma mensagem
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
      <div className="form-box">
        <h2>Detalhes do Produto</h2>
        
        <div className="p-field">
          <label htmlFor="nome">Nome</label>
          <div className="p-inputtext">{produto.nome}</div>
        </div>

        <div className="p-field">
          <label htmlFor="preco">Preço</label>
          <div className="p-inputnumber">R$ {produto.preco}</div>
        </div>

        <div className="p-field">
          <label htmlFor="quantidade">Quantidade</label>
          <div className="p-inputnumber">{produto.quantidade}</div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            label="Voltar"
            className="p-button-secondary"
            style={{ width: '100%' }}
            icon="pi pi-arrow-left"
            onClick={() => router.push('/produtos')}
          />
        </div>
      </div>
    </div>
  );
};

export default ShowProduto;
