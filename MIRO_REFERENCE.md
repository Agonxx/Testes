# Miro Reference - Event Storming FIAP Cloud Games

Guia rapido para criar o Event Storming no Miro. Copie os textos e crie sticky notes com as cores indicadas.

---

## Configuracao do Board no Miro

### Cores dos Sticky Notes (Hex)

| Elemento | Cor Miro | Hex Code |
|----------|----------|----------|
| Eventos de Dominio | Laranja | `#FF9900` ou `#FAA94C` |
| Comandos | Azul | `#0066CC` ou `#4A90D9` |
| Agregados | Amarelo | `#FFCC00` ou `#F5D128` |
| Politicas | Roxo | `#9933FF` ou `#9B51E0` |
| Read Models | Verde | `#33CC33` ou `#7ED321` |
| Sistemas Externos | Rosa | `#FF66B2` ou `#F06292` |
| Atores | Amarelo claro | `#FFE066` ou `#FFF176` |
| Hot Spots | Vermelho | `#FF3333` ou `#E53935` |

---

## STICKY NOTES PARA COPIAR

### EVENTOS DE DOMINIO (Laranja #FF9900)

```
UsuarioCriado
---
Id, Nome, Email
Nivel, CadastradoEm
```

```
UsuarioAtualizado
---
Id, Nome, Email
Nivel, Ativo
```

```
UsuarioExcluido
---
Id
```

```
UsuarioAutenticado
---
Id, Nome, Email
Nivel, Token JWT
```

```
JogoCadastrado
---
Id, Titulo, Descricao
Preco, CadastradoEm
```

```
JogoAtualizado
---
Id, Titulo
Descricao, Preco
```

```
JogoExcluido
---
Id
```

```
JogoComprado
---
UsuarioId, JogoId
PrecoPago, AdquiridoEm
```

---

### COMANDOS (Azul #0066CC)

```
CriarUsuario
---
POST /api/usuario/Create
Admin Only
```

```
AtualizarUsuario
---
PUT /api/usuario/Update
Admin Only
```

```
ExcluirUsuario
---
DELETE /api/usuario/DeleteById
Admin Only
```

```
Autenticar
---
POST /api/usuario/Auth
Publico
```

```
ConsultarMeusDados
---
GET /api/usuario/GetMe
Autenticado
```

```
ListarUsuarios
---
GET /api/usuario/GetAll
Admin Only
```

```
BuscarUsuarioPorId
---
GET /api/usuario/GetById
Admin Only
```

```
CadastrarJogo
---
POST /api/jogo/Create
Admin Only
```

```
AtualizarJogo
---
PUT /api/jogo/Update
Admin Only
```

```
ExcluirJogo
---
DELETE /api/jogo/DeleteById
Admin Only
```

```
ListarJogos
---
GET /api/jogo/GetAll
Usuario/Admin
```

```
BuscarJogoPorId
---
GET /api/jogo/GetById
Usuario/Admin
```

```
ComprarJogo
---
POST /api/biblioteca/BuyGame
Usuario/Admin
```

```
ConsultarMeusJogos
---
GET /api/biblioteca/GetMyGames
Usuario/Admin
```

```
ConsultarJogosDeUsuario
---
GET /api/biblioteca/GetUserGamesById
Admin Only
```

---

### AGREGADOS (Amarelo #FFCC00)

```
USUARIO
===
Id (PK)
Nome (max 150)
Email (unique)
SenhaHash (AES)
Nivel (1=User, 2=Admin)
CadastradoEm
Ativo
```

```
JOGO
===
Id (PK)
Titulo (max 150, index)
Descricao (max 500)
Preco (decimal)
CadastradoEm
```

```
ITEMBIBLIOTECA
===
Id (PK)
UsuarioId (FK)
JogoId (FK)
PrecoPago (decimal)
AdquiridoEm
---
UNIQUE(UsuarioId, JogoId)
```

---

### POLITICAS / REGRAS (Roxo #9933FF)

```
Email Unico
---
Nao podem existir
dois usuarios com
o mesmo email
```

```
Senha Criptografada
---
Toda senha deve ser
criptografada com AES
antes de salvar
```

```
Validar Credenciais
---
Email deve existir e
senha deve corresponder
ao hash armazenado
```

```
Token JWT Valido
---
Token deve ter
assinatura valida e
nao estar expirado
```

```
Titulo Obrigatorio
---
Todo jogo deve
ter um titulo
preenchido
```

```
Preco Maior que Zero
---
Preco do jogo
deve ser > 0
```

```
ID Deve Existir
---
Para update/delete
o ID deve existir
no banco
```

```
Jogo Deve Existir
---
So pode comprar
jogos que existem
no catalogo
```

```
Jogo Unico na Biblioteca
---
Usuario nao pode
comprar o mesmo
jogo duas vezes
```

```
Snapshot do Preco
---
PrecoPago guarda o
preco do jogo no
momento da compra
```

```
Cascade Delete
---
Ao excluir jogo/usuario
os itens da biblioteca
sao excluidos
```

---

### READ MODELS (Verde #33CC33)

```
InfoToken (GetMe)
---
Id, Nome, Email
Nivel, CadastradoEm
```

```
Lista de Usuarios
---
Todos os usuarios
do sistema
(Admin only)
```

```
Catalogo de Jogos
---
Todos os jogos
disponiveis para
compra
```

```
Detalhe do Jogo
---
Informacoes completas
de um jogo especifico
```

```
Minha Biblioteca
---
JogoDto: Titulo,
Descricao, Preco,
PrecoPago, AdquiridoEm
```

```
Biblioteca do Usuario
---
Jogos de um usuario
especifico + nome
(Admin only)
```

---

### SISTEMAS EXTERNOS (Rosa #FF66B2)

```
JWT TokenService
---
Gera tokens JWT
com claims do usuario
(HS256)
```

```
CryptoService (AES)
---
Criptografa e
descriptografa senhas
Key: 7F3D9A1B4C6E8F2D
```

```
SQL Server
---
Banco de dados
via Entity Framework
Core
```

```
Swagger / OpenAPI
---
Documentacao
interativa da API
```

---

### ATORES (Amarelo claro #FFE066)

```
ADMINISTRADOR
(Nivel = 2)
---
* CRUD Usuarios
* CRUD Jogos
* Ver biblioteca de outros
* Tudo que usuario pode
```

```
USUARIO
(Nivel = 1)
---
* Autenticar
* Ver proprio perfil
* Listar/buscar jogos
* Comprar jogos
* Ver propria biblioteca
```

```
ANONIMO
---
* Autenticar
(unica acao permitida)
```

---

## LAYOUT SUGERIDO PARA O MIRO

### Estrutura em Swimlanes

```
+------------------------------------------------------------------+
|                    FIAP CLOUD GAMES - EVENT STORMING             |
+------------------------------------------------------------------+
|                                                                   |
|  +--------------------+  +--------------------+  +---------------+|
|  | GESTAO DE USUARIOS |  | CATALOGO DE JOGOS  |  | BIBLIOTECA    ||
|  +--------------------+  +--------------------+  +---------------+|
|  |                    |  |                    |  |               ||
|  | [Fluxos Usuario]   |  | [Fluxos Jogo]      |  | [Fluxo Compra]||
|  |                    |  |                    |  |               ||
|  +--------------------+  +--------------------+  +---------------+|
|                                                                   |
+------------------------------------------------------------------+
```

### Fluxo de Leitura (Esquerda para Direita)

```
ATOR --> COMANDO --> AGREGADO --> EVENTO --> POLITICA (se houver)
                        |
                        v
                   READ MODEL (se query)
```

### Exemplo de Fluxo no Miro

```
+--------+    +---------------+    +---------+    +---------------+
| Admin  | -> | CriarUsuario  | -> | Usuario | -> | UsuarioCriado |
+--------+    +---------------+    +---------+    +---------------+
   (amarelo)      (azul)           (amarelo)         (laranja)
                    |
                    v
              +----------------+
              | Email Unico    |
              +----------------+
                  (roxo)
              +----------------+
              | Senha          |
              | Criptografada  |
              +----------------+
                  (roxo)
```

---

## DICAS PARA O MIRO

1. **Use Frames** para separar os Bounded Contexts
2. **Use Connectors (setas)** para ligar os elementos
3. **Agrupe elementos** relacionados
4. **Use cores consistentes** conforme a legenda
5. **Adicione uma legenda** no canto do board

### Template de Legenda

```
LEGENDA
=======
[Laranja] Evento de Dominio
[Azul]    Comando
[Amarelo] Agregado
[Roxo]    Politica/Regra
[Verde]   Read Model
[Rosa]    Sistema Externo
[Amarelo claro] Ator
```

---

## CHECKLIST DE ELEMENTOS

### Usuarios
- [ ] Ator: Admin
- [ ] Ator: Usuario
- [ ] Ator: Anonimo
- [ ] Comando: CriarUsuario
- [ ] Comando: AtualizarUsuario
- [ ] Comando: ExcluirUsuario
- [ ] Comando: Autenticar
- [ ] Comando: ConsultarMeusDados
- [ ] Comando: ListarUsuarios
- [ ] Comando: BuscarUsuarioPorId
- [ ] Agregado: Usuario
- [ ] Evento: UsuarioCriado
- [ ] Evento: UsuarioAtualizado
- [ ] Evento: UsuarioExcluido
- [ ] Evento: UsuarioAutenticado
- [ ] Politica: Email Unico
- [ ] Politica: Senha Criptografada
- [ ] Politica: Validar Credenciais
- [ ] Read Model: InfoToken
- [ ] Read Model: Lista de Usuarios
- [ ] Sistema: TokenService
- [ ] Sistema: CryptoService

### Jogos
- [ ] Comando: CadastrarJogo
- [ ] Comando: AtualizarJogo
- [ ] Comando: ExcluirJogo
- [ ] Comando: ListarJogos
- [ ] Comando: BuscarJogoPorId
- [ ] Agregado: Jogo
- [ ] Evento: JogoCadastrado
- [ ] Evento: JogoAtualizado
- [ ] Evento: JogoExcluido
- [ ] Politica: Titulo Obrigatorio
- [ ] Politica: Preco > 0
- [ ] Politica: Cascade Delete
- [ ] Read Model: Catalogo de Jogos
- [ ] Read Model: Detalhe do Jogo

### Biblioteca
- [ ] Comando: ComprarJogo
- [ ] Comando: ConsultarMeusJogos
- [ ] Comando: ConsultarJogosDeUsuario
- [ ] Agregado: ItemBiblioteca
- [ ] Evento: JogoComprado
- [ ] Politica: Jogo Deve Existir
- [ ] Politica: Jogo Unico na Biblioteca
- [ ] Politica: Snapshot do Preco
- [ ] Read Model: Minha Biblioteca
- [ ] Read Model: Biblioteca do Usuario

### Sistemas Externos
- [ ] JWT TokenService
- [ ] CryptoService (AES)
- [ ] SQL Server
- [ ] Swagger/OpenAPI

---

## LINKS UTEIS

- **Miro Templates**: https://miro.com/templates/event-storming/
- **Event Storming Reference**: https://www.eventstorming.com/
- **Cores Miro**: No Miro, use o color picker e insira os codigos hex

---

*Referencia rapida para Event Storming no Miro - FIAP Cloud Games*
