# SiGMA GAMES – Oyun Portalı

350+ ücretsiz tarayıcı oyunu tek yerde: kendi yaptığımız SiGMA oyunları + dev iframe oyun arşivi.

## Özellikler
- 🟢 Yeşil START kapısı + arka plan müziği
- 🔍 Arama, kategoriler, favoriler, geçmiş, popüler/yeni
- 🤖 Sigma AI: ne tür oyun istediğini yaz, yapay zekâ katalogdan önersin
- 👍👎 Her oyun için bulutta (Supabase) like/dislike
- 🖥️ Tam ekran iframe oynatıcı, rastgele oyun, tema seçimi

## Kurulum
1. `tr/index.html` dosyasını sitenize koyun (ör. GitHub Pages'te `/tr/` altına).
2. Oylama için `vote_game.sql` dosyasını Supabase SQL editöründe **1 kez** çalıştırın (API/Anon Key değişmez).
3. AI önerileri Lovable üzerinden yayınlanan siteden otomatik çalışır.

## Canlı
- Portal: `tr/index.html`
- Oyunlar: thesigmagames.github.io üzerinden yüklenir, portal her yerde çalışır.
