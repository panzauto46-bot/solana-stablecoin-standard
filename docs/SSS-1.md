# 🔰 Spesifikasi SSS-1 (Minimal Stablecoin)

Standarisasi ringan aset Stablecoin di ekosistem Solana berbasis Token-2022. Cocok untuk algoritma *Stablecoin Decentralized* (seperti DAI).

## 1. Extension yang Aktif
SSS-1 diinisialisasikan dengan batas fungsional terendah, memaksimalkan fleksibilitas penggunaan DeFi (AAM, *Lending Vault*). 

*   `Mint Authority`: Memungkinkan protokol *smart contract* untuk menambah suplai.
*   `Freeze Authority`: Memungkinkan *Emergency Switch* apabila celah peretasan di jaringan baru ditemukan (menahan likuiditas).
*   `Metadata Pointer`: Mengarahkan nama token *on-chain* secara desentralistik ke alamat dompet Mint (menghindari bergantung ke Token List pihak ketiga).

## 2. Pengecualian dan Batasan
Karena target dari SSS-1 adalah *Trustless Decentralized stablecoin*, ekstensi berikut ini **DILARANG**:
*   🚫 `Transfer Hook` (Tidak boleh dimata-matai atau dihambat).
*   🚫 `Permanent Delegate` (Uang yang dicetak murni milik pengguna mutlak, tidak bisa diretas lewat *Governance* belakang layar).
*   🚫 `Default Account State` Frozen (Setiap akun yang membuka *associated token account* baru dapat langsung mentranser/menerima aset).

## 3. Implementasi Kode
Untuk membuat instance token tipe SSS-1:
```javascript
import { SolanaStablecoin } from '@stbr/sss-token';
const sdk = await SolanaStablecoin.create(conn, wallet, programId);

// Menginisialisasikan token SSS-1 
const mintAddress = await sdk.initMint('sss-1', 'My Algo Stable', 'ALGOS');
```
