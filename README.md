# YG GeoPortal 2.0 — Sprint 1

Fondasi aplikasi baru yang berjalan terpisah dari WebGIS produksi.

## Fitur Sprint 1

- Dashboard Master Database
- Ringkasan program, layer, objek, desa, luas, dan monitoring
- Spatial Manager tiga panel
- Filter Program
- Filter Layer
- Filter Kabupaten
- Filter Kecamatan
- Filter Desa
- Pencarian objek
- Peta objek langsung dari Apps Script API
- Panel informasi objek
- Monitoring terintegrasi dasar

## API

Aplikasi membaca:

`https://script.google.com/macros/s/AKfycbxUe4QyBvSiL9UJsL-nsJ5XrohDabwqhYYR9q5CTgLYiW1ZCfVy429iMlpU-lCDUSvvRg/exec?page=objects`

dan:

`https://script.google.com/macros/s/AKfycbxUe4QyBvSiL9UJsL-nsJ5XrohDabwqhYYR9q5CTgLYiW1ZCfVy429iMlpU-lCDUSvvRg/exec?page=dashboard-summary`

## Instalasi

Upload seluruh isi folder ini ke repository baru, misalnya:

`mulyadibagan/yg-geoportal-v2`

Aktifkan GitHub Pages dari branch `main`, folder root.

Buka:

`https://mulyadibagan.github.io/yg-geoportal-v2/`

## Catatan

- Repository lama tetap menjadi produksi.
- Sprint 1 belum mengubah data.
- Tombol “Buka editor polygon lama” masih mengarah ke editor yang ada.
- Sprint 2 akan menambahkan edit polygon/line/point, undo/redo, dan riwayat revisi.
