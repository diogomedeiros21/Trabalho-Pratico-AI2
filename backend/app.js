const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');

// IMPORTAÇÕES DE ROTAS
// ficheiros que dizem ao servidor o que fazer quando o site pede alguma coisa
const authRoutes = require('./src/routes/authRoutes');
const avaliacoesRoutes = require('./src/routes/avaliacoesRoutes');
const favoritosRoutes = require('./src/routes/favoritosRoutes');
const jogoRoutes = require('./src/routes/jogoRoutes');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const denunciasRoutes = require('./src/routes/denunciasRoutes');
const auditoriaRoutes = require('./src/routes/auditoriaRoutes');

// IMPORTAÇÕES DE MODELOS
// tabelas da base de dados para criar as ligações entre elas
const User = require('./src/models/User');
const Avaliacao = require('./src/models/Avaliacao');
const Favorito = require('./src/models/Favorito');
const Jogo = require('./src/models/Jogo');
const Categoria = require('./src/models/Categoria');
const Denuncia = require('./src/models/Denuncia');
const Auditoria = require('./src/models/Auditoria');

const app = express();

// MIDDLEWARES (Ferramentas de ajuda)
app.use(cors()); // Permite que o site (Frontend) consiga falar com o servidor sem o browser bloquear
app.use(express.json()); // Ensina o servidor a ler a informação que chega em formato JSON

// RELAÇÕES DA BASE DE DADOS
//base de dados como as tabelas se misturam umas com as outras

// Avaliações
// Um utilizador pode fazer várias avaliações mas cada avaliação pertence a um só utilizador
User.hasMany(Avaliacao, { foreignKey: 'userId' }); 
Avaliacao.belongsTo(User, { foreignKey: 'userId' });

// Um jogo pode receber várias avaliações mas cada avaliação é só para um jogo específico
Jogo.hasMany(Avaliacao, { foreignKey: 'jogoId' }); 
Avaliacao.belongsTo(Jogo, { foreignKey: 'jogoId' });

// Um utilizador pode ter vários jogos favoritos e um jogo pode ser favorito de várias pessoas
User.belongsToMany(Jogo, { through: Favorito, foreignKey: 'userId' });
Jogo.belongsToMany(User, { through: Favorito, foreignKey: 'jogoId' });

// Categorias
// Uma categoria tem vários jogos e cada jogo pertence a uma categoria
Categoria.hasMany(Jogo, { foreignKey: 'categoriaId', as: 'Jogos' });
Jogo.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'Categoria' });

// Denúncias
// Um utilizador pode fazer várias queixas
User.hasMany(Denuncia, { foreignKey: 'userId', as: 'DenunciasFeitas' });
Denuncia.belongsTo(User, { foreignKey: 'userId', as: 'Denunciador' });

// Um comentário pode receber várias queixas
Avaliacao.hasMany(Denuncia, { foreignKey: 'avaliacaoId' }); 
Denuncia.belongsTo(Avaliacao, { foreignKey: 'avaliacaoId' });

// Auditoria
// Um admin vai fazer várias ações e cada ação regista quem foi o admin que a fez
User.hasMany(Auditoria, { foreignKey: 'userId', as: 'AcoesRegistadas' }); 
Auditoria.belongsTo(User, { foreignKey: 'userId', as: 'Admin' }); 


// ROTAS DA API
// Endereços que o site vai chamar para ir buscar ou guardar dados
app.use('/auth', authRoutes);
app.use('/avaliacoes', avaliacoesRoutes);
app.use('/favoritos', favoritosRoutes);
app.use('/jogos', jogoRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/denuncias', denunciasRoutes);
app.use('/auditoria', auditoriaRoutes);

// Para saber que o servidor está vivo se abrirmos o link no browser
app.get('/', (req, res) => {
  res.send('API do Mundo Gaming a funcionar em pleno!');
});

// INICIALIZAÇÃO 
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Base de dados sincronizada com sucesso!');
    app.listen(3000, () => {
      console.log('🚀 Servidor a correr na porta 3000');
    });
  })
  .catch((erro) => {
    console.error('❌ Erro ao sincronizar a base de dados:', erro);
  });