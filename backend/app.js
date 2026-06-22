const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');

// ==========================================
// importações de routes
// ==========================================
const authRoutes = require('./src/routes/authRoutes');
const avaliacoesRoutes = require('./src/routes/avaliacoesRoutes');
const favoritosRoutes = require('./src/routes/favoritosRoutes');
const jogoRoutes = require('./src/routes/jogoRoutes');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const denunciasRoutes = require('./src/routes/denunciasRoutes');

// ==========================================
// importações de models
// ==========================================
const User = require('./src/models/User');
const Avaliacao = require('./src/models/Avaliacao');
const Favorito = require('./src/models/Favorito');
const Jogo = require('./src/models/Jogo');
const Categoria = require('./src/models/Categoria');
const Denuncia = require('./src/models/Denuncia');
const Auditoria = require('./src/models/Auditoria');
const app = express();

// ==========================================
// middlewares
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
Categoria.hasMany(Jogo, { foreignKey: 'categoriaId', as: 'Jogos' });
Jogo.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'Categoria' });

// Um utilizador pode fazer várias denúncias
User.hasMany(Denuncia, { foreignKey: 'userId', as: 'DenunciasFeitas' });
Denuncia.belongsTo(User, { foreignKey: 'userId', as: 'Denunciador' });

// Uma avaliação pode ter várias denúncias
Avaliacao.hasMany(Denuncia, { foreignKey: 'avaliacaoId' });
Denuncia.belongsTo(Avaliacao, { foreignKey: 'avaliacaoId' });

// Relações de auditoria
// Um admin pode ter várias ações registadas
User.hasMany(Auditoria, { foreignKey: 'userId', as: 'AcoesRegistadas' });
Auditoria.belongsTo(User, { foreignKey: 'userId', as: 'Admin' });


// ==========================================
// ROTAS DA API
// ==========================================
app.use('/auth', authRoutes);
app.use('/avaliacoes', avaliacoesRoutes);
app.use('/favoritos', favoritosRoutes);
app.use('/jogos', jogoRoutes);
app.use('/categorias', categoriaRoutes);
app.get('/', (req, res) => {
  res.send('API do Mundo Gaming a funcionar em pleno!');
});
app.use('/denuncias', denunciasRoutes);
const auditoriaRoutes = require('./src/routes/auditoriaRoutes');
app.use('/auditoria', auditoriaRoutes);

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