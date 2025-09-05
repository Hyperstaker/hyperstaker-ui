# Hyperstaker Smart Contract Architecture

```mermaid
graph TB
    subgraph "External Protocols"
        HC[Hypercerts Protocol<br/>ERC-1155 Certificates]
        ALLO[Allo Protocol<br/>Funding Allocation]
        USDC[USDC Token<br/>ERC-20]
    end

    subgraph "Core Factory Contracts"
        HFF[HyperfundFactory<br/>Factory Contract]
        HSF[HyperstakerFactory<br/>Factory Contract] 
        HSTF[HyperstrategyFactory<br/>Strategy Factory]
    end

    subgraph "Project Contracts (Per Hypercert)"
        HF[Hyperfund<br/>Project Treasury]
        HS[Hyperstaker<br/>Staking & Rewards]
        HSTRAT[Hyperstrategy<br/>Allo Strategy Implementation]
    end

    subgraph "Allo Protocol Integration"
        AR[Allo Registry<br/>Profile Management]
        AP[Allo Pool<br/>Funding Pool]
        AS[Allo Strategy<br/>Distribution Logic]
    end

    subgraph "External Integrations"
        IPFS[IPFS<br/>Metadata Storage]
        PINATA[Pinata<br/>IPFS Gateway]
    end

    %% Factory Relationships
    HFF -->|creates| HF
    HSF -->|creates| HS
    HSTF -->|creates| HSTRAT

    %% Project Creation Flow
    HFF -->|createProject| HSF
    HFF -.->|deploys both| HF
    HFF -.->|deploys both| HS

    %% Hypercert Integration
    HC -->|hypercert_id| HF
    HC -->|hypercert_id| HS
    HC -->|validates ownership| HSTRAT

    %% Allo Protocol Integration
    AR -->|creates profiles| AP
    AP -->|uses strategy| HSTRAT
    HSTRAT -->|allocates funds| HF
    HSTRAT -->|allocates funds| HS

    %% Token Flows
    USDC -->|donations| HF
    USDC -->|rewards| HS
    USDC -->|pool funding| AP

    %% Funding Flow
    AP -->|distribute funds| HF
    AP -->|distribute funds| HS
    HF -->|redeem hypercerts| USDC
    HS -->|staking rewards| USDC

    %% Metadata and Storage
    IPFS -->|stores metadata| HC
    PINATA -->|gateway| IPFS

    %% Interactions
    HF -->|allowlist tokens| USDC
    HF -->|track contributions| HC
    HS -->|stake hypercerts| HC
    HS -->|reward distribution| HC

    %% Styling
    classDef factory fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef project fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef external fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef allo fill:#fff3e0,stroke:#e65100,stroke-width:2px

    class HFF,HSF,HSTF factory
    class HF,HS,HSTRAT project
    class HC,USDC,IPFS,PINATA external
    class AR,AP,AS allo
```

## Contract Descriptions

### Factory Contracts
- **HyperfundFactory**: Deploys Hyperfund and Hyperstaker contracts for each project
- **HyperstakerFactory**: Creates staking contracts linked to specific hypercerts  
- **HyperstrategyFactory**: Deploys Allo strategy contracts for funding distribution

### Core Project Contracts
- **Hyperfund**: Project treasury that holds donations and allows hypercert redemption
- **Hyperstaker**: Staking contract where users can stake hypercerts for rewards
- **Hyperstrategy**: Allo strategy implementation for fair fund distribution

### Key Functions by Contract

#### Hyperfund
- `donate()`: Accept USDC donations
- `allowlistToken()`: Approve new tokens for donations
- `redeem()`: Allow hypercert holders to claim funds
- `nonfinancialContribution()`: Track non-monetary contributions

#### Hyperstaker  
- `stake()`: Stake hypercert for rewards
- `unstake()`: Remove hypercert from staking
- `setReward()`: Distribute rewards to stakers

#### Hyperstrategy
- `allocate()`: Distribute pool funds between Hyperfund and Hyperstaker
- `registerRecipient()`: Register projects as funding recipients
- `distribute()`: Execute fund distribution

### Integration Points
1. **Hypercerts Protocol**: Provides proof-of-impact certificates (ERC-1155)
2. **Allo Protocol**: Handles funding pools and allocation strategies
3. **USDC**: Primary currency for donations and rewards
4. **IPFS/Pinata**: Decentralized metadata storage

### Deployment Networks
- **Sepolia Testnet** (11155111): Development and testing
- **Celo Mainnet** (42220): Production deployment