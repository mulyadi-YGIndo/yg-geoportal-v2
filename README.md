# YG GeoPortal V2

YG GeoPortal adalah aplikasi WebGIS, monitoring, pelaporan, dan pengelolaan data spasial Yayasan Gambut.

## Status proyek

- Repository produksi: `mulyadi-YGIndo/yg-geoportal-v2`
- Branch produksi: `main`
- Publikasi: GitHub Pages
- Backend saat ini: Google Apps Script
- Database saat ini: Google Sheets / Master Database
- Penyimpanan lampiran: Google Drive

## Halaman utama

- `index.html` — dashboard dan pintu masuk aplikasi
- `webgis.html` — peta dan layer spasial
- `report.html` — formulir kirim laporan
- `monitoring.html` — data dan riwayat monitoring
- `object-manager.html` — pengelolaan objek WebGIS
- `polygon-editor.html` — editor polygon

## File aktif utama

- `js/map-v4.js`
- `js/dashboard-v3.js`
- `js/report-v6.js`
- `js/monitoring.js`
- `js/object-manager.js`
- `js/polygon-editor.js`
- `css/webgis-v3.css`
- `css/dashboard-v3.css`
- `css/report-v6.css`
- `css/monitoring.css`

File versi lama tetap dipertahankan sementara untuk kompatibilitas dan audit. Jangan dihapus sebelum seluruh dependensi diperiksa.

## Prinsip pengembangan

1. Versi 2 dikembangkan terlebih dahulu di GitHub Pages.
2. Database dan laporan lama tidak diubah tanpa backup serta pengujian staging.
3. Integrasi dengan domain Blogger dilakukan setelah aplikasi stabil.
4. Setiap perubahan besar harus menaikkan versi cache pada `service-worker.js` dan `js/pwa.js`.
5. Endpoint Google Apps Script tidak boleh dimasukkan ke cache.

## URL GitHub Pages

- Beranda: `https://mulyadi-ygindo.github.io/yg-geoportal-v2/`
- WebGIS: `https://mulyadi-ygindo.github.io/yg-geoportal-v2/webgis.html`
- Laporan: `https://mulyadi-ygindo.github.io/yg-geoportal-v2/report.html`
- Monitoring: `https://mulyadi-ygindo.github.io/yg-geoportal-v2/monitoring.html`

## Integrasi Blogger

Gunakan `BLOGGER-LAUNCHER.html` sebagai halaman peluncur di Blogger. Blogger berfungsi sebagai pintu masuk, sedangkan aplikasi utama tetap dijalankan dari GitHub Pages.

## Catatan keamanan data

- Jangan menghapus atau mengganti Spreadsheet produksi tanpa backup.
- Jangan mengganti `Object_ID` yang sudah dipakai laporan lama.
- Jangan memindahkan folder Drive lampiran sebelum seluruh tautan diperiksa.
- Uji pengiriman laporan baru di database staging sebelum diarahkan ke produksi.
