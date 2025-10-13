# 🎨 TaskBuddy Design System

Полная документация дизайн-системы приложения TaskBuddy

---

## 📋 Оглавление
1. [Брендинг](#брендинг)
2. [Цветовая палитра](#цветовая-палитра)
3. [Типографика](#типографика)
4. [Компоненты](#компоненты)
5. [Макеты экранов](#макеты-экранов)
6. [User Flow](#user-flow)
7. [Инструкция по переносу в Figma](#инструкция-по-переносу-в-figma)

---

## 🎯 Брендинг

### Название
**TaskBuddy** — твой помощник в управлении задачами

### Логотип
- **Иконка**: Квадрат с галочкой (CheckSquare от Lucide)
- **Цвет фона**: Градиент от синего к фиолетовому (`from-blue-500 to-purple-600`)
- **Цвет иконки**: Белый
- **Размер**: 32×32px в навигации

### Философия дизайна
- **Минимализм**: Чистый, незагроможденный интерфейс
- **Продуктивность**: Быстрый доступ ко всем функциям
- **Визуальная иерархия**: Приоритетные задачи выделяются цветом
- **Дружелюбность**: Использование эмодзи и понятных подписей

---

## 🎨 Цветовая палитра

### Light Theme (Основная тема)

#### Основные цвета
```
Background:     hsl(222, 47%, 97%)   #F5F7FA
Foreground:     hsl(222, 47%, 11%)   #0F1729
```

#### Брендовые цвета
```
Primary:        hsl(217, 91%, 60%)   #4C9AFF (Синий)
Primary Hover:  hsl(217, 91%, 50%)   #3182F6
Accent:         hsl(38, 92%, 50%)    #F59E0B (Оранжевый)
```

#### UI элементы
```
Card:           hsl(0, 0%, 100%)     #FFFFFF
Border:         hsl(220, 13%, 91%)   #E5E7EB
Input:          hsl(220, 13%, 91%)   #E5E7EB
Muted:          hsl(220, 13%, 95%)   #F3F4F6
Muted Text:     hsl(220, 9%, 46%)    #6B7280
```

#### Семантические цвета
```
Success:        hsl(160, 84%, 39%)   #10B981 (Зелёный)
Destructive:    hsl(0, 84%, 60%)     #EF4444 (Красный)
Warning:        hsl(38, 92%, 50%)    #F59E0B (Жёлтый)
```

#### Приоритеты задач
```
High Priority:
  Background:   #FEE2E2 (red-100)
  Text:         #991B1B (red-700)
  Border:       #FCA5A5 (red-300)
  Emoji:        🔴

Medium Priority:
  Background:   #FEF3C7 (yellow-100)
  Text:         #92400E (yellow-700)
  Border:       #FCD34D (yellow-300)
  Emoji:        🟡

Low Priority:
  Background:   #D1FAE5 (green-100)
  Text:         #065F46 (green-700)
  Border:       #6EE7B7 (green-300)
  Emoji:        🟢
```

### Dark Theme

#### Основные цвета
```
Background:     hsl(222, 47%, 11%)   #0F1729
Foreground:     hsl(222, 47%, 97%)   #F5F7FA
Card:           hsl(217, 33%, 17%)   #1E293B
Border:         hsl(217, 33%, 24%)   #334155
```

---

## 📝 Типографика

### Шрифт
**Inter** — современный, читабельный, поддерживает кириллицу

```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Размеры и веса

```
Заголовок H1 (страницы):
  Size: 30px (3xl)
  Weight: 700 (Bold)
  Line height: 1.2
  Example: "Привет! 👋"

Заголовок H2 (карточки):
  Size: 24px (2xl)
  Weight: 700 (Bold)
  Line height: 1.3
  Example: "Мои задачи"

Заголовок H3 (задачи):
  Size: 16px (base)
  Weight: 500 (Medium)
  Line height: 1.5
  Example: "Подготовить презентацию"

Body текст:
  Size: 14px (sm)
  Weight: 400 (Regular)
  Line height: 1.5
  Example: Описания, подписи

Small текст:
  Size: 12px (xs)
  Weight: 400 (Regular)
  Line height: 1.4
  Example: Даты, метки
```

---

## 🧩 Компоненты

### 1. Кнопки

#### Primary Button
```
Background: hsl(217, 91%, 60%) #4C9AFF
Text: White
Padding: 8px 16px
Border radius: 12px
Font size: 14px
Font weight: 500
Hover: brightness(110%)
```

#### Secondary Button
```
Background: hsl(220, 13%, 95%) #F3F4F6
Text: hsl(222, 47%, 11%) #0F1729
Padding: 8px 16px
Border radius: 12px
Font size: 14px
Font weight: 500
```

#### Ghost Button
```
Background: Transparent
Text: Inherit
Padding: 8px 16px
Border radius: 12px
Hover: hsl(220, 13%, 95%)
```

#### Icon Button
```
Size: 40×40px
Border radius: 12px
Icon size: 18px
Background: Transparent
Hover: hsl(220, 13%, 95%)
```

### 2. Карточки (Cards)

```
Background: White
Border: 2px solid hsl(220, 13%, 91%)
Border radius: 16px
Padding: 24px
Shadow: 0 1px 3px rgba(0,0,0,0.1)
Hover shadow: 0 4px 12px rgba(0,0,0,0.15)
Transition: all 0.3s ease
```

### 3. Бейджи (Badges)

#### Категория (Secondary)
```
Background: hsl(220, 13%, 95%)
Text: hsl(222, 47%, 11%)
Padding: 4px 12px
Border radius: 6px
Font size: 12px
Gap: 4px (для иконки)
```

#### Приоритет (Outline)
```
Background: Зависит от приоритета
Text: Зависит от приоритета
Border: 1px solid
Padding: 4px 12px
Border radius: 6px
Font size: 12px
```

### 4. Поля ввода (Inputs)

```
Background: White
Border: 1px solid hsl(220, 13%, 91%)
Border radius: 8px
Padding: 10px 12px
Font size: 14px
Placeholder: hsl(220, 9%, 46%)

Focus:
  Border: 2px solid hsl(217, 91%, 60%)
  Ring: 0 0 0 4px hsl(217, 91%, 60%, 0.1)
```

### 5. Чекбоксы

```
Size: 20×20px
Border: 2px solid hsl(220, 13%, 91%)
Border radius: 4px

Checked:
  Background: hsl(217, 91%, 60%)
  Border: hsl(217, 91%, 60%)
  Icon: White checkmark
```

### 6. Выпадающие меню (Dropdowns)

```
Background: White
Border: 1px solid hsl(220, 13%, 91%)
Border radius: 8px
Shadow: 0 4px 12px rgba(0,0,0,0.15)
Padding: 4px

Item:
  Padding: 8px 12px
  Border radius: 6px
  Hover: hsl(220, 13%, 95%)
  Icon size: 16px
  Gap: 8px
```

### 7. Диалоговые окна (Modals)

```
Overlay: rgba(0, 0, 0, 0.5)
Container:
  Background: White
  Border radius: 16px
  Padding: 24px
  Max width: 500px
  Shadow: 0 20px 60px rgba(0,0,0,0.3)

Анимация входа: fade-in + scale 0.95→1
Анимация выхода: fade-out + scale 1→0.95
Duration: 200ms
```

### 8. Навигация

```
Background: White (с backdrop-blur)
Border bottom: 1px solid hsl(220, 13%, 91%)
Height: 64px
Padding: 12px 16px
Position: Sticky top
Z-index: 50

Logo section:
  Gap: 24px
  
Nav buttons:
  Gap: 4px
  Padding: 6px 12px
  Active: hsl(220, 13%, 95%) background
```

### 9. Календарь

```
Grid: 7 columns (дни недели)
Cell size: 40×40px
Border radius: 8px

States:
  Today: Blue border
  Selected: Blue background
  Has tasks: Orange dot below date
  Hover: Light gray background
```

### 10. Progress Bar

```
Height: 8px
Background: hsl(220, 13%, 95%)
Fill: hsl(217, 91%, 60%)
Border radius: 999px
Transition: width 0.3s ease
```

---

## 📱 Макеты экранов

### 1. Landing Page (/)

**Layout:** Centered, single column
**Max width:** 1200px

**Sections:**

1. **Hero Section**
   - Logo + название (центр)
   - Заголовок: "Управляй задачами легко" (H1)
   - Подзаголовок: текст описание
   - CTA кнопка: "Начать работу" (Primary, large)
   - Spacing: 32px между элементами

2. **Features Grid** (3 колонки)
   - Иконка (48px)
   - Заголовок (H3)
   - Описание (Body)
   - Gap: 24px между карточками
   - Card padding: 32px

3. **Footer**
   - Копирайт + ссылки
   - Height: 80px

### 2. App Page (/app)

**Layout:** Grid (3 колонки: 2fr + 1fr)
**Max width:** 1400px

**Components:**

1. **Навигация** (sticky top)
   - Logo + название (слева)
   - Меню: Главная | Календарь | Настройки
   - Иконки: Уведомления, Профиль (справа)

2. **Заголовок секции**
   - "Привет! 👋" (H1)
   - "Сегодня отличный день..." (Body)
   - Margin bottom: 32px

3. **Переключатель режимов** (Tabs)
   - "Личные цели" | "Учёба"
   - Width: 400px
   - Margin bottom: 32px

4. **Карточки статистики** (3 колонки)
   - Выполнено задач (с Progress)
   - Активных задач (с бейджами)
   - Срочных задач (красный акцент)
   - Height: 140px

5. **Основная область** (2fr)
   - Заголовок "Мои задачи" + кнопка "Добавить"
   - Панель фильтров (3 select'а + кнопка сброса)
   - Список задач (вертикально)

6. **Боковая панель** (1fr)
   - Календарь (компактный)
   - Задачи на выбранную дату

**Задача (Task Card):**
```
Height: auto (padding 16px)
Layout: Flex (row)
Gap: 12px

Structure:
├─ Checkbox (20px)
├─ Content (flex-1)
│  ├─ Title (H3)
│  └─ Badges row
│     ├─ Priority badge
│     ├─ Category badge
│     └─ Date (12px, gray)
└─ Menu button (32px)
```

### 3. Calendar Page (/calendar)

**Layout:** Grid (2 колонки: 1fr + 1fr)

**Sections:**

1. **Календарь** (большой, левая колонка)
   - Месяц/год (H2)
   - Сетка дней (7×5)
   - Индикаторы задач (точки)

2. **Задачи выбранной даты** (правая колонка)
   - Заголовок с датой
   - Панель фильтров
   - Список задач (вертикально)

3. **Задачи на неделю** (внизу, 7 колонок)
   - Grid по дням недели
   - Компактные карточки задач

---

## 🔄 User Flow

### Основные сценарии

```
1. Создание задачи
   ┌─────────────┐
   │ /app        │
   └──────┬──────┘
          │ Клик "Добавить задачу"
          ▼
   ┌─────────────┐
   │ Диалог      │
   │ AddTask     │
   └──────┬──────┘
          │ Заполнение формы
          │ - Название
          │ - Категория
          │ - Приоритет
          │ - Дата
          │ - Описание
          ▼
   ┌─────────────┐
   │ Клик        │
   │ "Создать"   │
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │ Toast       │
   │ "Создано!"  │
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │ Задача в    │
   │ списке      │
   └─────────────┘

2. Редактирование задачи
   ┌─────────────┐
   │ Задача      │
   └──────┬──────┘
          │ Клик ⋮ → "Редактировать"
          ▼
   ┌─────────────┐
   │ Диалог      │
   │ EditTask    │
   └──────┬──────┘
          │ Изменение данных
          ▼
   ┌─────────────┐
   │ Клик        │
   │ "Сохранить" │
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │ Toast       │
   │ "Обновлено!"│
   └─────────────┘

3. Удаление задачи
   ┌─────────────┐
   │ Задача      │
   └──────┬──────┘
          │ Клик ⋮ → "Удалить"
          ▼
   ┌─────────────┐
   │ Диалог      │
   │ подтвержд.  │
   └──────┬──────┘
          │ Клик "Удалить"
          ▼
   ┌─────────────┐
   │ Toast       │
   │ "Удалено!"  │
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │ Задача      │
   │ исчезла     │
   └─────────────┘

4. Фильтрация задач
   ┌─────────────┐
   │ Список      │
   │ задач       │
   └──────┬──────┘
          │ Выбор фильтра
          │ - Статус
          │ - Приоритет
          │ - Категория
          ▼
   ┌─────────────┐
   │ Список      │
   │ обновляется │
   └──────┬──────┘
          │ Если пусто →
          ▼
   ┌─────────────┐
   │ Пустое      │
   │ состояние   │
   │ + кнопка    │
   │ "Сбросить"  │
   └─────────────┘

5. Переключение режимов
   ┌─────────────┐
   │ Личные цели │◄─┐
   └──────┬──────┘  │
          │         │
          │ Клик    │ Клик
          │ "Учёба" │ "Личные"
          ▼         │
   ┌─────────────┐  │
   │ Учёба       │──┘
   └─────────────┘
   
   Фильтрует задачи по mode
   Обновляет статистику
```

### Навигация

```
Landing (/)
  │
  ├─► App (/app)
  │   ├─► Создать задачу
  │   ├─► Редактировать задачу
  │   ├─► Удалить задачу
  │   └─► Фильтровать задачи
  │
  ├─► Calendar (/calendar)
  │   ├─► Выбрать дату
  │   ├─► Создать задачу на дату
  │   └─► Фильтровать задачи
  │
  ├─► Settings (/settings)
  ├─► Notifications (/notifications)
  └─► Profile (/profile)
```

---

## 🎯 Инструкция по переносу в Figma

### Шаг 1: Подготовка

1. **Создай новый файл в Figma**
   - Название: "TaskBuddy Design System"

2. **Создай страницы:**
   - 🎨 Design System (цвета, типографика, компоненты)
   - 📱 Screens (макеты экранов)
   - 🔄 User Flow (схемы навигации)

### Шаг 2: Настрой цвета (Color Styles)

1. Нажми на иконку стилей (4 кружка) → Local Styles → + (Create Style)

2. **Создай следующие стили:**

**Foundation Colors:**
```
Background       #F5F7FA
Foreground       #0F1729
Card             #FFFFFF
Border           #E5E7EB
```

**Brand Colors:**
```
Primary          #4C9AFF
Primary Hover    #3182F6
Accent           #F59E0B
```

**Semantic Colors:**
```
Success          #10B981
Destructive      #EF4444
Warning          #F59E0B
Muted            #F3F4F6
Muted Text       #6B7280
```

**Priority Colors:**
```
High BG          #FEE2E2
High Text        #991B1B
High Border      #FCA5A5

Medium BG        #FEF3C7
Medium Text      #92400E
Medium Border    #FCD34D

Low BG           #D1FAE5
Low Text         #065F46
Low Border       #6EE7B7
```

### Шаг 3: Настрой типографику (Text Styles)

1. Импортируй шрифт Inter (Google Fonts плагин или вручную)

2. **Создай текстовые стили:**

```
H1 - Page Title
  Font: Inter Bold
  Size: 30px
  Line: 36px
  Color: Foreground

H2 - Card Title
  Font: Inter Bold
  Size: 24px
  Line: 32px
  Color: Foreground

H3 - Task Title
  Font: Inter Medium
  Size: 16px
  Line: 24px
  Color: Foreground

Body - Regular
  Font: Inter Regular
  Size: 14px
  Line: 21px
  Color: Foreground

Small - Metadata
  Font: Inter Regular
  Size: 12px
  Line: 18px
  Color: Muted Text
```

### Шаг 4: Создай компоненты

#### 4.1 Button Component

1. Нарисуй прямоугольник:
   - Width: 120px (Auto layout)
   - Height: 40px
   - Border radius: 12px

2. Добавь Auto Layout (Shift + A):
   - Padding: 8px horizontal, 8px vertical
   - Gap: 8px
   - Align: Center

3. Добавь текст внутри

4. Создай компонент (Ctrl/Cmd + Alt + K)

5. **Создай варианты:**
   - Primary (blue background)
   - Secondary (gray background)
   - Ghost (transparent)
   - Destructive (red)

6. Добавь состояния:
   - Default
   - Hover (измени opacity на 90%)
   - Disabled (opacity 50%)

#### 4.2 Card Component

1. Нарисуй прямоугольник:
   - Width: 400px
   - Height: auto
   - Border radius: 16px
   - Fill: Card color
   - Stroke: 2px Border color

2. Добавь Auto Layout:
   - Direction: Vertical
   - Padding: 24px
   - Gap: 16px

3. Создай компонент

4. Добавь эффект тени:
   - X: 0, Y: 1, Blur: 3, Color: #00000019

#### 4.3 Badge Component

1. Нарисуй прямоугольник:
   - Height: 24px
   - Border radius: 6px

2. Auto Layout:
   - Padding: 4px horizontal, 8px vertical
   - Gap: 4px

3. Добавь иконку (16px) и текст

4. Создай варианты:
   - Priority High
   - Priority Medium
   - Priority Low
   - Category

#### 4.4 Task Card Component

1. Создай Frame (F):
   - Width: 600px
   - Height: auto
   - Border: 2px Border color
   - Border radius: 12px
   - Fill: Card

2. Auto Layout:
   - Direction: Horizontal
   - Padding: 16px
   - Gap: 12px

3. **Добавь элементы:**
   - Checkbox (20×20px)
   - Content (Auto Layout vertical)
     - Title (H3)
     - Badges row (Auto Layout horizontal)
   - Menu button (32×32px, 3 dots)

4. Создай компонент

5. Добавь состояния:
   - Active
   - Completed (с line-through)

#### 4.5 Input Component

1. Нарисуй прямоугольник:
   - Width: 300px
   - Height: 40px
   - Border radius: 8px
   - Border: 1px Border color

2. Добавь текст с padding 12px

3. Создай варианты состояний:
   - Default
   - Focus (border: Primary, добавь внешнюю обводку)
   - Error (border: Destructive)

#### 4.6 Dialog Component

1. Создай Frame:
   - Width: 500px
   - Height: auto
   - Border radius: 16px
   - Fill: Card

2. Auto Layout:
   - Direction: Vertical
   - Padding: 24px
   - Gap: 16px

3. **Добавь секции:**
   - Header (title + close button)
   - Content (forms, text)
   - Footer (buttons)

4. Добавь overlay (черный фон, 50% opacity)

### Шаг 5: Создай макеты экранов

#### 5.1 Landing Page

1. Создай Frame:
   - Name: "Landing"
   - Size: Desktop (1440×1024)

2. Используй компоненты:
   - Hero section (center aligned)
   - Feature cards (3 columns grid)
   - Footer

#### 5.2 App Page

1. Создай Frame:
   - Name: "App"
   - Size: Desktop (1440×1024)

2. **Структура:**
   - Navigation (sticky, full width)
   - Header section (title + tabs)
   - Stats cards (3 columns)
   - Main grid (2 columns: tasks + sidebar)

3. Используй компоненты:
   - Task cards (10-12 штук)
   - Calendar component
   - Filter selects

#### 5.3 Calendar Page

1. Создай Frame:
   - Name: "Calendar"
   - Size: Desktop (1440×1024)

2. **Структура:**
   - Navigation
   - 2 column grid (calendar + tasks)
   - Week overview (7 columns)

### Шаг 6: Создай интерактивные прототипы

1. **Переключись в режим Prototype** (правая панель)

2. **Создай connections:**
   - "Добавить задачу" → Dialog появляется
   - "Сохранить" → Dialog закрывается
   - Task menu → Edit dialog
   - Filter select → обновление списка

3. **Настрой анимации:**
   - Open dialog: Dissolve, 200ms, Ease Out
   - Close dialog: Dissolve, 200ms, Ease In
   - Hover: Smart Animate, 100ms

4. **Создай flows:**
   - Landing → App
   - App → Calendar
   - Create task flow
   - Edit task flow

### Шаг 7: Организуй файл

1. **Структура страниц:**
```
📄 Design System
  ├─ Colors
  ├─ Typography
  ├─ Components
  │  ├─ Buttons
  │  ├─ Cards
  │  ├─ Badges
  │  ├─ Inputs
  │  └─ Dialogs
  └─ Icons

📄 Screens
  ├─ Landing
  ├─ App
  ├─ Calendar
  ├─ Settings (empty)
  └─ Modals
     ├─ Add Task
     ├─ Edit Task
     └─ Delete Confirm

📄 User Flow
  └─ Flow diagrams

📄 Prototypes
  └─ Interactive versions
```

2. **Используй Auto Layout везде** - это позволит компонентам адаптироваться

3. **Создай Component Library:**
   - Publish components (правый клик → Publish)
   - Другие файлы смогут использовать твои компоненты

### Шаг 8: Экспорт ассетов

1. **Для разработчиков:**
   - Выбери элемент → Export
   - Format: SVG (для иконок), PNG (для скриншотов)
   - 1x, 2x, 3x (для мобильных)

2. **Иконки:**
   - Используй плагин "Lucide Icons" для Figma
   - Все иконки будут в едином стиле

3. **Инспект код:**
   - Dev Mode в Figma (платная)
   - Или используй плагин "CSS Inspector"

---

## 💡 Полезные плагины Figma

### Обязательные:
- **Auto Layout** (встроен) - адаптивные компоненты
- **Content Reel** - генерация тестового контента
- **Unsplash** - бесплатные изображения
- **Lucide Icons** - иконки из нашего проекта
- **Stark** - проверка доступности (contrast)

### Рекомендуемые:
- **Fig Jam** - для User Flow диаграмм
- **Figma to Code** - экспорт в HTML/CSS
- **Color Blind** - проверка цветовой слепоты
- **Contrast** - проверка контрастности текста

---

## 📸 Скриншоты для референса

После создания компонентов в Figma, можешь использовать реальное приложение для сверки:

1. **Открой приложение в браузере**
2. **Сделай скриншоты:** (Cmd/Ctrl + Shift + S или DevTools)
   - Landing page (/)
   - App page (/app) - все состояния
   - Calendar page (/calendar)
   - Все модальные окна
   - Hover states
   - Empty states

3. **Импортируй в Figma** как reference images

---

## ✅ Checklist переноса

### Design Tokens
- [ ] Все цвета добавлены как Color Styles
- [ ] Все текстовые стили созданы
- [ ] Border radius определён (12px глобально)
- [ ] Spacing scale определён (4px base unit)
- [ ] Shadow styles созданы

### Components
- [ ] Button (4 варианта)
- [ ] Card
- [ ] Badge (4 варианта)
- [ ] Input (3 состояния)
- [ ] Checkbox
- [ ] Select/Dropdown
- [ ] Dialog (3 типа)
- [ ] Task Card (2 состояния)
- [ ] Navigation
- [ ] Calendar

### Screens
- [ ] Landing page
- [ ] App page (личные / учёба)
- [ ] Calendar page
- [ ] All modals
- [ ] Empty states
- [ ] Loading states

### Prototypes
- [ ] Navigation flow
- [ ] Create task flow
- [ ] Edit task flow
- [ ] Delete task flow
- [ ] Filter flow
- [ ] Mode switch flow

### Documentation
- [ ] Component descriptions
- [ ] Usage guidelines
- [ ] Spacing rules
- [ ] Responsive breakpoints

---

## 🚀 Следующие шаги

После создания в Figma:

1. **Поделись ссылкой** с командой (View only / Can edit)
2. **Версионируй изменения** (Cmd/Ctrl + Alt + S)
3. **Собери feedback** через комментарии
4. **Экспортируй ассеты** для разработки
5. **Поддерживай синхронизацию** с кодом

---

## 📚 Дополнительные ресурсы

- **Figma официальные туториалы:** figma.com/resources/learn-design/
- **Design System checklist:** designsystemchecklist.com
- **Color palette generator:** coolors.co
- **Accessibility checker:** webaim.org/resources/contrastchecker/

---

**Создано для TaskBuddy**
Version 1.0 | October 2025
