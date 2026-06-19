import JogoCard from '../components/JogoCard';

function Home() {
  // Dados de teste (Mais tarde isto virá da base de dados do Medeiros!)
  const jogosDeTeste = [
    { id: 1, nome: "Counter-Strike 2", categoria: "Shooter", notaMedia: 4.8, imagem: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/730/capsule_616x353.jpg" },
    { id: 2, nome: "Minecraft", categoria: "Aventura", notaMedia: 5.0, imagem: "https://images.immediate.co.uk/production/volatile/sites/3/2022/09/minecraft-30aa052.jpg?resize=1200%2C630" },
    { id: 3, nome: "Virtua Tennis 4", categoria: "Desporto", notaMedia: 4.5, imagem: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/71390/capsule_616x353.jpg" }
  ];

  return (
    <div className="container mt-5">
      <h2 className="mb-4 fw-bold">Catálogo de Jogos</h2>
      
      <div className="row g-4">
        {/* O React vai percorrer a nossa lista e criar um cartão para cada jogo */}
        {jogosDeTeste.map((jogo) => (
          <div className="col-md-4" key={jogo.id}>
            <JogoCard jogo={jogo} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;