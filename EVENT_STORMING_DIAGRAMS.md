# Event Storming - Diagramas Mermaid

Este arquivo contém os diagramas do Event Storming em formato Mermaid, que podem ser visualizados no GitHub, VS Code (com extensão), ou em https://mermaid.live

---

## 1. Diagrama de Contextos (Context Map)

```mermaid
flowchart TB
    subgraph FCG["FIAP Cloud Games"]
        subgraph UC["Bounded Context: Gestao de Usuarios"]
            U[("Usuario")]
        end

        subgraph JC["Bounded Context: Catalogo de Jogos"]
            J[("Jogo")]
        end

        subgraph BC["Bounded Context: Biblioteca/Compras"]
            IB[("ItemBiblioteca")]
        end
    end

    U -->|"possui"| IB
    J -->|"comprado em"| IB

    style UC fill:#FFE066,stroke:#333
    style JC fill:#90EE90,stroke:#333
    style BC fill:#87CEEB,stroke:#333
```

---

## 2. Fluxo de Autenticacao

```mermaid
sequenceDiagram
    actor U as Usuario
    participant API as API
    participant US as UsuarioService
    participant CR as CryptoService
    participant TS as TokenService
    participant DB as Database

    U->>API: POST /usuario/Auth (email, senha)
    API->>US: AuthAsync(email, senha)
    US->>DB: GetByEmailAsync(email)
    DB-->>US: Usuario (com SenhaHash)
    US->>CR: Decrypt(SenhaHash)
    CR-->>US: senha descriptografada

    alt Senha Valida
        US->>TS: GenerateToken(usuario)
        TS-->>US: JWT Token
        US-->>API: Token + Usuario
        API-->>U: 200 OK + Token
        Note over U,DB: Evento: UsuarioAutenticado
    else Senha Invalida
        US-->>API: throw Exception
        API-->>U: 401 Unauthorized
    end
```

---

## 3. Fluxo de Compra de Jogo

```mermaid
sequenceDiagram
    actor U as Usuario
    participant API as BibliotecaController
    participant BS as BibliotecaService
    participant JR as JogoRepository
    participant BR as BibliotecaRepository
    participant DB as Database

    U->>API: POST /biblioteca/BuyGame (jogoId)
    API->>BS: BuyGameAsync(jogoId)

    BS->>JR: GetByIdAsync(jogoId)
    JR->>DB: SELECT * FROM Jogos WHERE Id = jogoId
    DB-->>JR: Jogo
    JR-->>BS: Jogo

    alt Jogo Nao Existe
        BS-->>API: throw Exception("Jogo nao encontrado")
        API-->>U: 404 Not Found
    else Jogo Existe
        BS->>BR: CreateAsync(ItemBiblioteca)
        Note over BS,BR: PrecoPago = Jogo.Preco (snapshot)
        BR->>DB: INSERT INTO ItemBiblioteca

        alt Usuario Ja Possui Jogo
            DB-->>BR: Unique Constraint Violation
            BR-->>BS: throw Exception
            BS-->>API: Error
            API-->>U: 400 Bad Request
        else Sucesso
            DB-->>BR: ItemBiblioteca criado
            BR-->>BS: ItemBiblioteca
            BS-->>API: ItemBiblioteca
            API-->>U: 200 OK
            Note over U,DB: Evento: JogoComprado
        end
    end
```

---

## 4. Modelo de Dominio (Entidades)

```mermaid
erDiagram
    USUARIO {
        int Id PK
        string Nome
        string Email UK
        string SenhaHash
        int Nivel
        datetime CadastradoEm
        bool Ativo
    }

    JOGO {
        int Id PK
        string Titulo
        string Descricao
        decimal Preco
        datetime CadastradoEm
    }

    ITEMBIBLIOTECA {
        int Id PK
        int UsuarioId FK
        int JogoId FK
        decimal PrecoPago
        datetime AdquiridoEm
    }

    USUARIO ||--o{ ITEMBIBLIOTECA : "possui"
    JOGO ||--o{ ITEMBIBLIOTECA : "comprado em"
```

---

## 5. Fluxo de Eventos - Gestao de Usuarios

```mermaid
flowchart LR
    subgraph Atores
        A1[/"Admin"/]
        A2[/"Usuario"/]
    end

    subgraph Comandos
        C1["CriarUsuario"]
        C2["AtualizarUsuario"]
        C3["ExcluirUsuario"]
        C4["Autenticar"]
        C5["ConsultarMeusDados"]
    end

    subgraph Agregado
        AG["Usuario"]
    end

    subgraph Eventos
        E1(["UsuarioCriado"])
        E2(["UsuarioAtualizado"])
        E3(["UsuarioExcluido"])
        E4(["UsuarioAutenticado"])
    end

    subgraph Politicas
        P1{{"Email Unico"}}
        P2{{"Senha Criptografada"}}
        P3{{"Validar Credenciais"}}
    end

    A1 --> C1 --> P1 --> AG --> E1
    A1 --> C2 --> P1 --> AG --> E2
    A1 --> C3 --> AG --> E3
    A2 --> C4 --> P3 --> AG --> E4
    A2 --> C5 --> AG

    C1 --> P2

    style C1 fill:#0066CC,color:#fff
    style C2 fill:#0066CC,color:#fff
    style C3 fill:#0066CC,color:#fff
    style C4 fill:#0066CC,color:#fff
    style C5 fill:#0066CC,color:#fff
    style AG fill:#FFCC00
    style E1 fill:#FF9900
    style E2 fill:#FF9900
    style E3 fill:#FF9900
    style E4 fill:#FF9900
    style P1 fill:#9933FF,color:#fff
    style P2 fill:#9933FF,color:#fff
    style P3 fill:#9933FF,color:#fff
```

---

## 6. Fluxo de Eventos - Catalogo de Jogos

```mermaid
flowchart LR
    subgraph Atores
        A1[/"Admin"/]
        A2[/"Usuario/Admin"/]
    end

    subgraph Comandos
        C1["CadastrarJogo"]
        C2["AtualizarJogo"]
        C3["ExcluirJogo"]
        C4["ListarJogos"]
        C5["BuscarJogoPorId"]
    end

    subgraph Agregado
        AG["Jogo"]
    end

    subgraph Eventos
        E1(["JogoCadastrado"])
        E2(["JogoAtualizado"])
        E3(["JogoExcluido"])
    end

    subgraph Politicas
        P1{{"Titulo Obrigatorio"}}
        P2{{"Preco > 0"}}
        P3{{"Cascade Delete"}}
    end

    subgraph ReadModels
        R1[["Catalogo de Jogos"]]
        R2[["Detalhe do Jogo"]]
    end

    A1 --> C1 --> P1 --> AG --> E1
    C1 --> P2
    A1 --> C2 --> P1 --> AG --> E2
    C2 --> P2
    A1 --> C3 --> AG --> E3 --> P3
    A2 --> C4 --> AG --> R1
    A2 --> C5 --> AG --> R2

    style C1 fill:#0066CC,color:#fff
    style C2 fill:#0066CC,color:#fff
    style C3 fill:#0066CC,color:#fff
    style C4 fill:#0066CC,color:#fff
    style C5 fill:#0066CC,color:#fff
    style AG fill:#FFCC00
    style E1 fill:#FF9900
    style E2 fill:#FF9900
    style E3 fill:#FF9900
    style P1 fill:#9933FF,color:#fff
    style P2 fill:#9933FF,color:#fff
    style P3 fill:#9933FF,color:#fff
    style R1 fill:#33CC33
    style R2 fill:#33CC33
```

---

## 7. Fluxo de Eventos - Biblioteca/Compras

```mermaid
flowchart LR
    subgraph Atores
        A1[/"Usuario"/]
        A2[/"Admin"/]
    end

    subgraph Comandos
        C1["ComprarJogo"]
        C2["ConsultarMeusJogos"]
        C3["ConsultarJogosDeUsuario"]
    end

    subgraph Agregado
        AG["ItemBiblioteca"]
    end

    subgraph Eventos
        E1(["JogoComprado"])
    end

    subgraph Politicas
        P1{{"Jogo Deve Existir"}}
        P2{{"Jogo Unico na Biblioteca"}}
        P3{{"Snapshot do Preco"}}
    end

    subgraph ReadModels
        R1[["Minha Biblioteca"]]
        R2[["Biblioteca do Usuario"]]
    end

    A1 --> C1 --> P1 --> AG --> E1
    C1 --> P2
    C1 --> P3
    A1 --> C2 --> AG --> R1
    A2 --> C3 --> AG --> R2

    style C1 fill:#0066CC,color:#fff
    style C2 fill:#0066CC,color:#fff
    style C3 fill:#0066CC,color:#fff
    style AG fill:#FFCC00
    style E1 fill:#FF9900
    style P1 fill:#9933FF,color:#fff
    style P2 fill:#9933FF,color:#fff
    style P3 fill:#9933FF,color:#fff
    style R1 fill:#33CC33
    style R2 fill:#33CC33
```

---

## 8. Arquitetura em Camadas

```mermaid
flowchart TB
    subgraph Presentation["Camada de Apresentacao (API)"]
        UC["UsuarioController"]
        JC["JogoController"]
        BC["BibliotecaController"]
        MW["Middlewares"]
    end

    subgraph Application["Camada de Aplicacao"]
        US["UsuarioService"]
        JS["JogoService"]
        BS["BibliotecaService"]
    end

    subgraph Domain["Camada de Dominio"]
        E1["Usuario"]
        E2["Jogo"]
        E3["ItemBiblioteca"]
        I1["IUsuarioRepository"]
        I2["IJogoRepository"]
        I3["IBibliotecaRepository"]
    end

    subgraph Infrastructure["Camada de Infraestrutura"]
        UR["UsuarioRepository"]
        JR["JogoRepository"]
        BR["BibliotecaRepository"]
        DB[("SQL Server")]
        TS["TokenService"]
        CR["CryptoUtils"]
    end

    UC --> US --> I1
    JC --> JS --> I2
    BC --> BS --> I3

    I1 -.-> UR --> DB
    I2 -.-> JR --> DB
    I3 -.-> BR --> DB

    US --> TS
    US --> CR

    style Presentation fill:#E6F3FF,stroke:#0066CC
    style Application fill:#FFF3E6,stroke:#FF9900
    style Domain fill:#FFFDE6,stroke:#FFCC00
    style Infrastructure fill:#E6FFE6,stroke:#33CC33
```

---

## 9. Fluxo Completo - Jornada do Usuario

```mermaid
flowchart TB
    subgraph Registro["1. REGISTRO"]
        A1[/"Admin"/] --> C1["CriarUsuario"] --> E1(["UsuarioCriado"])
    end

    subgraph Login["2. LOGIN"]
        A2[/"Usuario"/] --> C2["Autenticar"] --> E2(["UsuarioAutenticado"])
        E2 --> T["Token JWT"]
    end

    subgraph Catalogo["3. CATALOGO"]
        T --> C3["ListarJogos"] --> R1[["Catalogo"]]
    end

    subgraph Compra["4. COMPRA"]
        R1 --> C4["ComprarJogo"] --> E3(["JogoComprado"])
    end

    subgraph Biblioteca["5. BIBLIOTECA"]
        E3 --> C5["ConsultarMeusJogos"] --> R2[["Minha Biblioteca"]]
    end

    style C1 fill:#0066CC,color:#fff
    style C2 fill:#0066CC,color:#fff
    style C3 fill:#0066CC,color:#fff
    style C4 fill:#0066CC,color:#fff
    style C5 fill:#0066CC,color:#fff
    style E1 fill:#FF9900
    style E2 fill:#FF9900
    style E3 fill:#FF9900
    style R1 fill:#33CC33
    style R2 fill:#33CC33
    style T fill:#FF66B2
```

---

## 10. Matriz de Permissoes (RBAC)

```mermaid
flowchart TB
    subgraph Roles["Niveis de Acesso"]
        R1["Administrador (Nivel 2)"]
        R2["Usuario (Nivel 1)"]
        R3["Anonimo"]
    end

    subgraph AdminOnly["Apenas Admin"]
        A1["CRUD Usuarios"]
        A2["CRUD Jogos"]
        A3["Ver biblioteca de outros"]
    end

    subgraph AuthRequired["Usuarios Autenticados"]
        B1["Listar Jogos"]
        B2["Comprar Jogos"]
        B3["Ver propria biblioteca"]
        B4["Ver proprio perfil"]
    end

    subgraph Public["Publico"]
        C1["Autenticar"]
    end

    R1 --> AdminOnly
    R1 --> AuthRequired
    R2 --> AuthRequired
    R3 --> Public

    style R1 fill:#FF6B6B,color:#fff
    style R2 fill:#4ECDC4,color:#fff
    style R3 fill:#95A5A6,color:#fff
    style AdminOnly fill:#FFE6E6
    style AuthRequired fill:#E6FFF9
    style Public fill:#F0F0F0
```

---

## Como Visualizar

### Opcao 1: GitHub
Basta fazer push deste arquivo para o repositorio. O GitHub renderiza Mermaid automaticamente.

### Opcao 2: VS Code
Instale a extensao "Markdown Preview Mermaid Support" ou "Mermaid Preview".

### Opcao 3: Mermaid Live Editor
Acesse https://mermaid.live e cole o codigo de qualquer diagrama.

### Opcao 4: Exportar para Imagem
No Mermaid Live Editor, voce pode exportar os diagramas como PNG ou SVG.

---

*Diagramas gerados para o Event Storming - FIAP Cloud Games*
