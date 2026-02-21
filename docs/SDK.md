# 💻 @stbr/sss-token: SDK Installation & Usage

Library TypeScript ini mengkompilasi kerumitan _Token-2022 Extensions_, _Anchor CPIs_, dan _Transfer Hooks_ menjadi API Object-Oriented sederhana untuk `SolanaStablecoin`.

## Instalasi
```bash
npm install @stbr/sss-token
yarn add @stbr/sss-token
```

## Memulai Cepat (SDK Init)
SDK membutuhkan _Wallet_ valid dan URL _Connection_ RPC (Mainnet, Devnet, atau Local). 
Direkomendasikan meletakkan *Private Key* `Mint Authority` di _Environment Variables_.

```typescript
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { SolanaStablecoin } from "@stbr/sss-token";

// Program ID Smart Contract Solana Devnet (Anchor)
const PROGRAM_ID = new PublicKey("sssFeG1j3c5xU2aXZK1T8M2VfQf4wJpG6P8N9gYqA");

async function main() {
    const conn = new Connection("https://api.devnet.solana.com", "confirmed");
    // Simulasi keypair - DI PRODUKSI GUNAKAN process.env.PRIVATE_KEY
    const operatorWallet = Keypair.generate(); 

    // Instansiasi Panel Kendali (Jembatan) ke Protocol
    const protocol = await SolanaStablecoin.create(conn, operatorWallet, PROGRAM_ID);

    // Membuat Aset Fiat SSS-2 compliancy standard
    const fiatToken = await protocol.initMint('sss-2', 'XYZ Dollar', 'XYZD');
    
    // Memberikan Dana Baru setelah KYC
    await protocol.mint(fiatToken, new PublicKey('USER_ADDRESS'), 50000000); 

    console.log("Deployed Mint:", fiatToken.toBase58());
}

main();
```

## Referensi Method Utama
*   `protocol.initMint(preset, name, symbol)`: Membuat _Token-2022 Stablecoin_ di Devnet.
*   `protocol.mint(mintAddress, targetPubKey, amount_raw)`: Menambah sirkulasi koin ke pengguna.
*   `protocol.burn(mintAddress, sourcePubKey, amount_raw)`: Mereduksi / Memusnahkan sirkulasi koin dari dompet Kas *(Treasury)*.
*   `protocol.freeze(mintAddress, userAccount)`: Status darurat membekukan dompet spesifik.
*   `protocol.thaw(mintAddress, userAccount)`: Mencabut status kebekuan dompet pengguna.
*   **(Tindakan Kepatuhan / _Compliance_)**
    *   `protocol.blacklistAdd(hackerAddress)`: Menginspeksi dan Menolak otomatis (_Revert_) setiap `Transfer` dompet ini pada *hook*.
    *   `protocol.seize(mintAddress, hackerAddress, treasuryAddress)`: Memaksa `Permanent Delegate` untuk menyedot koin fiat kembali ke dompet regulasi pengembang SSS-Forge.
