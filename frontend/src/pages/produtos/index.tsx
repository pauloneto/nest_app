import Link                                      from 'next/link';
import { useState, useRef }                      from 'react';
import { DataTable }                             from 'primereact/datatable';
import { Column }                                from 'primereact/column';
import { Button }                                from 'primereact/button';
import { ContextMenu }                           from 'primereact/contextmenu';
import { useRouter }                             from 'next/router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL }                               from '../../config/api';
import { Produto }                               from '../../models/produto';
import { GetServerSideProps }                    from 'next';

// Tipo para as props que serão passadas para o componente
type ProdutosListProps = {
  produtosData: Produto[];
};

// Função para buscar produtos
const fetchProdutos = async () => {
  const response = await fetch(`${API_URL}/produtos`);
  if (!response.ok) throw new Error('Erro ao buscar produtos');
  return response.json();
};

// Função para excluir produto
const deleteProduto = async (id: number): Promise<number> => {
  const response = await fetch(`${API_URL}/produtos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Erro ao excluir produto');
  return id;
};

const ListProdutos = ({ produtosData }: ProdutosListProps) => {
  const contextMenuRef                            = useRef<ContextMenu>(null);
  const router                                    = useRouter();
  const queryClient                               = useQueryClient();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  // Usando a chave 'produtos' corretamente no React Query
  const { data: produtos, isLoading, isError } = useQuery({
    queryKey:    ['produtos'],
    queryFn:     fetchProdutos,
    initialData: produtosData,
  });

  // Corrigindo a tipagem de useMutation
  const mutationDelete = useMutation<number, Error, number>({
    mutationFn: deleteProduto, // A função de mutação
    onSuccess: (id) => {
      // Correção do uso de invalidateQueries
      console.log(id);
      queryClient.invalidateQueries({ queryKey: ['produtos'] });  // Chamada correta do método
      alert('Produto excluído com sucesso!');
    },
    onError: (error) => {
      console.log(error);
      alert('Erro ao excluir o produto');
    },
  });

  const actions = [
    { label: 'Editar',       value: 'edit'   },
    { label: 'Excluir',      value: 'delete' },
    { label: 'Ver Detalhes', value: 'view  ' },
  ];

  const handleAction = (action: { value: string }) => {
    if (selectedProductId === null) return;

    if (action.value === 'edit') {
      router.push(`/produtos/edit/${selectedProductId}`);
    } else if (action.value === 'delete') {
      mutationDelete.mutate(selectedProductId);  // Executando a mutação
    } else if (action.value === 'view') {
      router.push(`/produtos/show/${selectedProductId}`);
    }
  };

  if (isLoading) return <div>Carregando...</div>;
  if (isError) return <div>Erro ao carregar os produtos.</div>;

  return (
    <div className="p-4">
      <div className="header-container">
        <h1>Lista de Produtos</h1>
        <Link href="/produtos/create">
          <Button label="Criar Produto" icon="pi pi-plus" className="p-button-success" />
        </Link>
      </div>
      <DataTable value={produtos} className="p-datatable-striped p-datatable-sm">
        <Column header="Nome" field="nome" />
        <Column header="Preço" field="preco" className="column-size-default" body={(rowData) => `R$ ${rowData.preco}`} />
        <Column header="Qtd" field="quantidade" className="column-size-default" />
        <Column
          header="Ações"
          className="column-size-default"
          body={(rowData) => (
            <>
              <Button
                icon="pi pi-bars"
                className="p-button-text"
                onClick={(e) => {
                  setSelectedProductId(rowData.id);
                  contextMenuRef.current?.show(e);
                }}
              />
              <ContextMenu
                ref={contextMenuRef}
                model={actions.map((action) => ({
                  label: action.label,
                  icon:
                    action.value === 'edit'
                      ? 'pi pi-pencil'
                      : action.value === 'delete'
                      ? 'pi pi-trash'
                      : 'pi pi-eye',
                  command: () => handleAction(action),
                }))}
              />
            </>
          )}
        />
      </DataTable>
    </div>
  );
};

// Função para obter os dados a cada requisição (com `getServerSideProps`)
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response     = await fetch(`${API_URL}/produtos`);
    const produtosData = await response.json();

    return {
      props: { produtosData },
    };
  } catch (error) {
    console.error('Erro ao buscar os produtos:', error);

    return { props: { produtosData: [] } };
  }
};

export default ListProdutos;
