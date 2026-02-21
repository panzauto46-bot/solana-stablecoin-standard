# 🚔 Spesifikasi SSS-2 (Compliant Stablecoin)

Standarisasi hukum untuk institusi finansial global yang tunduk pada kebijakan **KYC**, **AML** (Anti Money Laundering), hingga putusan penyitaan dana hasil kriminal dari *Court Order*. SSS-2 dioptimasi untuk koin fiat-terpatok seperti (USDC, BUSD).

## 1. Extension yang Aktif Secara Kaku
Mewajibkan tingkat otorisasi (RBAC) tinggi untuk mengurangi kejahatan dalam internal pengelola stablecoin. Semua aset **HANYA** dapat dicetak dan diteruskan jika terverifikasi oleh *Transfer Hook*:

*   `Mint Authority` & `Freeze Authority`: Dikelola oleh Role `Minter` dan `Pauser`.
*   `Permanent Delegate`: Memberi yurisdiksi abadi kepada Role `Seizer` untuk mengambil koin fiat dari dompet warga negara manapun.
*   `Transfer Hook`: (Otomatis) Intersepsi setiap pergerakan dana pada ekstensi Token-2022. Membaca PDA (*Program Derived Address*) *Blacklist* eksternal sebelum *Transfer* sukses.
*   `Default Account State`: (Opsional) Jika diaktifkan menjadi *Frozen*, user di bawah pengawasan regulasi tidak bisa menyentuh transfer uang sebelum di-*Approve/KYC-verified* (Thaw).

## 2. Tingkat Otoritas Khusus (Role-Based Access)
Pengurus aset SSS-2 dilarang keras untuk dikendalikan 1 orang (SPOF - *Single Point of Failure*).

| Role | Spesialisasi Regulasi/Operabilitas |
| :--- | :--- |
| **Master** | Konfigurator Tertinggi, satu-satunya yang bisa menetapkan anggota Role lain. Tidak dapat Mint/Burn. |
| **Minter/Burner** | Mengontrol peredaran *Supply* sesuai ketersediaan Fiat dunia nyata. |
| **Pauser** | Reaksi darurat menahan laju transaksi akun (Membekukan sebuah dompet secara individu). |
| **Blacklister** | Mencatat dompet peretas atau buronan kriminal masuk daftar cekal *Transfer Hook*. |
| **Seizer** | Penegak hukum; Sangat jarang digunakan kecuali diperintah Pengadilan Tinggi Internasional secara darurat. Mengambil hak kepemilikan dompet. |

## 3. Implementasi Kode SSS-2

```javascript
import { SolanaStablecoin } from '@stbr/sss-token';
const sdk = await SolanaStablecoin.create(conn, wallet, programId);

// Menginisialisasikan SSS-2 token lengkap dengan konfigurasi Delegate, state dan Hook Authorities
const fiatMintAddress = await sdk.initMint('sss-2', 'Institutional Fiat', 'USD+');
```
