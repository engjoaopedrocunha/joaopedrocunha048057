import { Heart, Github, Mail } from "lucide-react";
// Rodapé padrão. Se precisar mudar o e-mail de contato ou o nome nos créditos, é só mexer aqui.
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t bg-blue-900 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white-900">RegistrePETGOV</h3>
            <p className="text-sm text-white-600 leading-relaxed">
            Sistema desenvolvido pelo governo do estado para o controle de PET's e tutores.
            </p>
          </div>

         
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-black-500">Atalhos</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/" className="text-white hover:text-blue-200 transition-colors">Início / Listagem</a>
</li>
             <li><a href="/pet-form" className="text-white hover:text-blue-200 transition-colors">Cadastrar Pet</a></li>
              <li><a href="/tutor-form" className="text-white hover:text-blue-200 transition-colors">Novo Tutor</a></li>
            </ul>
          </div>

        
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white-500">Contato</h4>
            <div className="flex flex-col space-y-2 text-sm text-gray-600">
  <a href="mailto:governodemt@gov.br" className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors">
  <Mail size={16} /> governodemt@gov.br
</a>

              <div className="flex items-center gap-4 pt-2">
<a href="#" className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors">
      <Github size={20} className="text-white" /> govdemt
    </a>
              </div>
            </div>
          </div>
        </div>

       
        <div className="mt-8 border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white-500">
          <p>© {currentYear} RegistrePETGOV. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Feito com <Heart size={15} className="text-red-500 fill-red-500" /> por 
            <span className="font-medium text-gray-700 ml-1">GovMT</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
