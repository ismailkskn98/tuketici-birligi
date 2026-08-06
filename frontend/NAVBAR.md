# Reusable Navbar (shadcn tarzı)

Özlem Biçer projesindeki hover/dropdown navbar’ın temiz, projeye taşınabilir hali.
Dışarıdan `items` vererek kullanırsın; stilleri `className` prop’larıyla özelleştirirsin.

## Kurulum

Hedef projede şu paketler gerekli:

```bash
npm install motion clsx tailwind-merge
```

Proje zaten Next.js + Tailwind kullanıyorsa ekstra bir şey yok.
`next/link` default; `next-intl` varsa kendi `Link`’ini `linkComponent` ile verirsin.

## Dosyaları kopyala

Şu dosyaları hedef projeye taşı:

```
src/lib/utils.js
src/components/ui/navbar-menu.jsx
src/components/navbar/index.jsx
```

`@/` alias’ının `src/*`’e işaret ettiğinden emin ol (`jsconfig.json` / `tsconfig.json`).

`utils.js` zaten varsa sadece `cn` fonksiyonunun olduğundan emin ol.

## Menü verisi

```js
// örn. src/data/navigationMenu.js
export const navigationMenu = [
  {
    item: 'About Us',
    href: '/about-us', // opsiyonel — top-level link
    links: [
      { label: 'Team', href: '/about-us/team' },
      {
        label: 'Services',
        href: '/services',
        submenu: [
          { label: 'PRP', href: '/services/prp' },
          { label: 'Mesotherapy', href: '/services/mesotherapy' },
        ],
      },
    ],
  },
  {
    item: 'Contact',
    href: '/contact', // dropdown yok — düz link
  },
];
```

Alanlar:

| Alan | Açıklama |
|------|----------|
| `item` | Top-level etiket |
| `href` | Top-level link (opsiyonel) |
| `links` | Dropdown listesi (opsiyonel) |
| `links[].label` / `href` | Dropdown linki |
| `links[].submenu` | Sağa açılan nested menü |

Özlem Biçer’deki `navigationMenu.js` şekliyle uyumlu — oradaki array’i neredeyse olduğu gibi geçebilirsin.

## Kullanım

### Basit

```jsx
'use client'; // sadece Navbar client; page server kalabilir

import Navbar from '@/components/navbar';
import { navigationMenu } from '@/data/navigationMenu';

export default function Header() {
  return (
    <header className="flex items-center">
      <Navbar items={navigationMenu} />
    </header>
  );
}
```

`Navbar` zaten `'use client'` — Server Component layout/header içinden import edebilirsin.

### Stilleri özelleştir (Özlem Biçer örneği)

```jsx
<Navbar
  items={navigationMenu}
  className="text-ivory-soft"
  itemClassName="hover:bg-wine-brown"
  dropdownPanelClassName="bg-coffee-dark"
  linkClassName="hover:bg-wine-brown"
  nestedLinkClassName="hover:bg-wine-brown"
  submenuClassName="bg-coffee-dark"
/>
```

### next-intl Link

```jsx
import { Link } from '@/i18n/navigation';

<Navbar items={navigationMenu} linkComponent={Link} />
```

### İleri seviye — primitive’lerle elle kur

Tek `Navbar` yetmezse building block’ları doğrudan kullan:

```jsx
import { useState } from 'react';
import { Menu, MenuItem, HoveredLink, NestedHoveredLink } from '@/components/ui/navbar-menu';

export default function CustomNav() {
  const [active, setActive] = useState(null);

  return (
    <Menu setActive={setActive}>
      <MenuItem setActive={setActive} active={active} item="Products" hasDropdown>
        <HoveredLink href="/a">Product A</HoveredLink>
        <NestedHoveredLink
          href="/b"
          submenu={
            <>
              <HoveredLink href="/b/1">B1</HoveredLink>
              <HoveredLink href="/b/2">B2</HoveredLink>
            </>
          }
        >
          Product B
        </NestedHoveredLink>
      </MenuItem>
    </Menu>
  );
}
```

## Prop referansı (`Navbar`)

| Prop | Tip | Açıklama |
|------|-----|----------|
| `items` | `array` | Menü verisi |
| `linkComponent` | component | Default: `next/link`. i18n için kendi Link’in |
| `className` | string | `<nav>` |
| `menuClassName` | string | `Menu` wrapper |
| `itemClassName` | string | Top-level item |
| `dropdownClassName` | string | Dropdown konum wrapper |
| `dropdownPanelClassName` | string | Dropdown panel (bg, border…) |
| `linkClassName` | string | Dropdown linkleri |
| `nestedLinkClassName` | string | Nested parent link |
| `submenuClassName` | string | Nested flyout panel |

## Ne temizlendi?

Orijinalden taşınırken proje-özel şeyler çıkarıldı:

- `lenis` scroll bağımlılığı
- `next-intl` hardcode → `linkComponent` prop
- Sayfa-özel scroll (`/hair-transplant`) davranışı
- Hardcoded `wine-brown` / `coffee-dark` → default nötr + className ile override

Hover delay / nested menü açık kalma mantığı aynı kaldı.

## Dosya rolleri

| Dosya | Rol |
|-------|-----|
| `ui/navbar-menu.jsx` | Primitive’ler (`Menu`, `MenuItem`, `HoveredLink`, `NestedHoveredLink`) |
| `navbar/index.jsx` | Data-driven wrapper — çoğu projede sadece bunu kullanırsın |
| `data/navigationMenu.js` | Örnek veri (projene göre değiştir) |
