import '../../styles/globals.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';  // Tema do PrimeReact
import 'primereact/resources/primereact.min.css';                  // Estilos básicos do PrimeReact
import 'primeicons/primeicons.css';                                // Ícones do PrimeReact

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProps }                         from 'next/app';
import { useRouter }                        from 'next/router';
import { Menu }                             from 'primereact/menu'; // Menu da barra lateral
import { Sidebar }                          from 'primereact/sidebar'; // Importando o Sidebar
import { Button }                           from 'primereact/button'; // Importando o botão para abrir o menu
import { useState }                         from 'react';

// Criando o layout global
const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  // Itens do menu de navegação
  const menuItems = [
    { label: 'Página Inicial', icon: 'pi pi-fw pi-home', command: () => { router.push('/');         setVisibleSidebar(false); } },
    { label: 'Produtos',       icon: 'pi pi-fw pi-list', command: () => { router.push('/produtos'); setVisibleSidebar(false); } },
  ];

  // Controle da visibilidade do Sidebar
  const [visibleSidebar, setVisibleSidebar] = useState(false);

  return (
    <div className="p-grid">
      {/* Barra lateral com menu */}
      <div className="p-col-12 p-md-3">
        {/* Sidebar com largura ajustada */}
        <Sidebar 
          visible={visibleSidebar} 
          onHide={() => setVisibleSidebar(false)} 
          position="left" 
          className="p-sidebar-md p-sidebar-custom" // Classe personalizada para controle de largura
        >
          <Menu model={menuItems} />
        </Sidebar>

        {/* Botão para abrir a Sidebar em telas pequenas */}
        <Button 
          icon="pi pi-bars" 
          onClick={() => setVisibleSidebar(true)} 
          className="p-button-lg p-button-rounded p-button-primary p-d-md-none" 
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="p-col-12 p-md-9">
        <div className="content">
          {/* Exibindo o conteúdo da página */}
          {children}
        </div>
      </div>
    </div>
  );
};

// Criando o cliente do React Query
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Aplicando o layout global */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
}

export default MyApp;
