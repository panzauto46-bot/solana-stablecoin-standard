# ⚖️ COMPLIANCE.md (Buku Saku Regulasi / Audit Trail)

SSS-Forge dibangun untuk menjembatani **Gap (Celah Kepercayaan)** antara institusi Fiat (Bank) dan ruang publik Decentralized Finance (DeFi) di atas Solana. Ini adalah landasan operasional agar Kepatuhan Regulasi Internasional ditegakkan dengan *Zero-Knowledge Proofs* yang disokong **Watchtower Backend**.

## A. Kebijakan KYC (Know Your Customer)
Untuk token berbasis SSS-2 (The Regulary Grade), sebuah dompet publik di Solana tidak dapat mengirim uang sebelum di Verifikasi Identitas Dunia Nyata.
*   Buka akun dengan *default account state* `Frozen` dengan menyalakan opsi `Default Account State` Token 2022.
*   Setelah Backend menyetujui dokumen KYC dari klien pengguna, Watchtower menembak API `POST /api/mint` yang diawali dengan rutinitas `Unfreeze` ke SDK ke Smart Contract.

## B. Penegakan AML (Anti-Money Laundering) 
*   Di saat transfer `Instruct` dijalankan oleh aktor mana pun di *Ledger*, **Transfer Hook** program melakukan verifikasi otomatis terhadap PDA `BlacklistEntry`.
*   Jika salah satu dompet berlabel Merah, transaksi itu Langsung Gagal *Reverted* (bahkan tidak masuk mempool - aman dari pengeksploitasi Jaringan).

## C. Seize Funds (Penyitaan Darurat Kriminal Hacking) 
*   Ini adalah fitur eksklusif yang disokong *Permanent Delegate*, namun dengan pembatasan bahwa **Seizer Authority hanyalah PDA dari Multisig / Court Order**, bukan dompet milik perorangan, sehingga peretas dari internal SSS-Forge (*Rug pull*) mustahil mencuri dana publik.
*   Semua kejadian `Seize` ditulis otomatis ke *File log Winston Backend*. Laporan yang dihasilkan tidak dapat diputar karena terkunci Hash waktu riil (*audit log off-chain timestamp*). 

## Mekanisme Peringatan Jaringan (Webhook Service) 
Backend melayani sebagai sistem kekebalan dengan mengekspos notifikasi: 
*   **Discord:** Jika ada panggilan *Mint* atau pencetakan *Stablecoin SSS2* bernilai > \$10.000.
*   **Slack:** Deteksi otomatis alamat *suspicious transfer* jika _address_ tercurigai (Algorithmic Heuristics). Webhook ini akan masuk ke tim *Analisis Penipuan* untuk menentukan _Seize/Blacklist_ secara manual menggunakan CLI SSS-Forge.
