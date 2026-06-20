const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// ==========================================
// 1. IMPORTAÇÕES DE ROTAS
// ==========================================
const authRoutes = require('./routes/authRoutes');
const avaliacoesRoutes = require('./routes/avaliacoesRoutes');
const favoritosRoutes = require('./routes/favoritosRoutes');
const jogoRoutes = require('./routes/jogoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');

// ==========================================
// 2. IMPORTAÇÕES DOS MODELOS
// ==========================================
const User = require('./models/User');
const Avaliacao = require('./models/Avaliacao');
const Favorito = require('./models/Favorito');

const Jogo = require('./models/Jogo');
const Categoria = require('./models/Categoria');

const app = express();

// ==========================================
// MIDDLEWARES
// ==========================================
app.use(cors()); // Permite que o frontend faça pedidos à API sem bloqueios de segurança do browser
app.use(express.json()); // Permite que a API perceba dados enviados em formato JSON

// ==========================================
// RELAÇÕES DA BASE DE DADOS
// ==========================================

// Um Utilizador faz várias Avaliações
User.hasMany(Avaliacao, { foreignKey: 'userId' });
Avaliacao.belongsTo(User, { foreignKey: 'userId' });

// Um Jogo tem várias Avaliações
Jogo.hasMany(Avaliacao, { foreignKey: 'jogoId' });
Avaliacao.belongsTo(Jogo, { foreignKey: 'jogoId' });

// FAVORITOS (N:M) - Utilizadores e Jogos
User.belongsToMany(Jogo, { through: Favorito, foreignKey: 'userId' });
Jogo.belongsToMany(User, { through: Favorito, foreignKey: 'jogoId' });

// Uma Categoria tem vários Jogos
Categoria.hasMany(Jogo, { foreignKey: 'categoriaId' });
Jogo.belongsTo(Categoria, { foreignKey: 'categoriaId' });


// ==========================================
// ROTAS DA API
// ==========================================
app.use('/auth', authRoutes);
app.use('/avaliacoes', avaliacoesRoutes);
app.use('/favoritos', favoritosRoutes);
app.use('/jogos', jogoRoutes);
app.use('/categorias', categoriaRoutes);

app.get('/', (req, res) => {
  res.send('API do JogoAvalia a funcionar em pleno!');
});

// ==========================================
// INICIALIZAÇÃO (Sincronizar BD e Ligar Servidor)
// ==========================================
// O sync({ alter: true }) lê os modelos e cria/atualiza as tabelas automaticamente
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