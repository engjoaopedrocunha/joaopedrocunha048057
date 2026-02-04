import { useRoutes } from "react-router-dom";
import { routes } from "./routes";
import { Suspense } from "react";
import Footer from "./components/Footer"; 
// Componente pai. Aqui que a mágica acontece e o layout (main + footer) é montado.
function App() {
  const element = useRoutes(routes);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow"> 
        <Suspense fallback={<div className="p-8 text-center">Carregando...</div>}>
          {element}
        </Suspense>
      </main>
      
      <Footer /> 
    </div>
  );
}
// Nessa etapa foi configurado para o footer aparecer em todas as páginas
export default App;
