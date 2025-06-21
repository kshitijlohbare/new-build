# Tailwind CSS Cheat Sheet

## Layout

### Container
- `container` - Set max-width based on screen size
- `mx-auto` - Center horizontally

### Display
- `block` - `display: block`
- `inline` - `display: inline`
- `inline-block` - `display: inline-block`
- `flex` - `display: flex`
- `inline-flex` - `display: inline-flex`
- `grid` - `display: grid`
- `hidden` - `display: none`

### Flexbox
- `flex-row` - `flex-direction: row`
- `flex-col` - `flex-direction: column`
- `flex-wrap` - `flex-wrap: wrap`
- `flex-nowrap` - `flex-wrap: nowrap`
- `flex-grow` - `flex-grow: 1`
- `flex-shrink` - `flex-shrink: 1`
- `flex-1` - `flex: 1 1 0%`
- `items-start` - `align-items: flex-start`
- `items-center` - `align-items: center`
- `items-end` - `align-items: flex-end`
- `justify-start` - `justify-content: flex-start`
- `justify-center` - `justify-content: center`
- `justify-end` - `justify-content: flex-end`
- `justify-between` - `justify-content: space-between`

### Grid
- `grid-cols-1` to `grid-cols-12` - Grid template columns
- `gap-1` to `gap-12` - Grid gap

### Position
- `static` - `position: static`
- `fixed` - `position: fixed`
- `absolute` - `position: absolute`
- `relative` - `position: relative`
- `sticky` - `position: sticky`

## Spacing

### Padding
- `p-0` to `p-12` - Padding on all sides
- `px-0` to `px-12` - Horizontal padding
- `py-0` to `py-12` - Vertical padding
- `pt-0` to `pt-12` - Padding top
- `pr-0` to `pr-12` - Padding right
- `pb-0` to `pb-12` - Padding bottom
- `pl-0` to `pl-12` - Padding left

### Margin
- `m-0` to `m-12` - Margin on all sides
- `mx-0` to `mx-12` - Horizontal margin
- `my-0` to `my-12` - Vertical margin
- `mt-0` to `mt-12` - Margin top
- `mr-0` to `mr-12` - Margin right
- `mb-0` to `mb-12` - Margin bottom
- `ml-0` to `ml-12` - Margin left
- `-m-1` to `-m-12` - Negative margin

## Typography

### Font Size
- `text-xs` - 0.75rem
- `text-sm` - 0.875rem
- `text-base` - 1rem
- `text-lg` - 1.125rem
- `text-xl` - 1.25rem
- `text-2xl` to `text-9xl` - Larger text sizes

### Font Weight
- `font-thin` - 100
- `font-extralight` - 200
- `font-light` - 300
- `font-normal` - 400
- `font-medium` - 500
- `font-semibold` - 600
- `font-bold` - 700
- `font-extrabold` - 800
- `font-black` - 900

### Text Alignment
- `text-left` - Left aligned text
- `text-center` - Center aligned text
- `text-right` - Right aligned text
- `text-justify` - Justified text

### Text Color
- `text-transparent`
- `text-black`
- `text-white`
- `text-gray-[50-900]`
- `text-red-[50-900]`
- `text-primary` - Our primary brand color

## Backgrounds

### Background Color
- `bg-transparent`
- `bg-black`
- `bg-white`
- `bg-gray-[50-900]`
- `bg-red-[50-900]`
- `bg-primary` - Our primary brand color

### Background Opacity
- `bg-opacity-0` to `bg-opacity-100`

## Borders

### Border Width
- `border` - 1px border
- `border-0` - No border
- `border-2` to `border-8` - Thicker borders
- `border-t`, `border-r`, `border-b`, `border-l` - Side-specific borders

### Border Color
- `border-transparent`
- `border-black`
- `border-white`
- `border-gray-[50-900]`
- `border-primary`

### Border Radius
- `rounded-none` - No border radius
- `rounded-sm` - 0.125rem
- `rounded` - 0.25rem
- `rounded-md` - 0.375rem
- `rounded-lg` - 0.5rem
- `rounded-xl` - 0.75rem
- `rounded-2xl` - 1rem
- `rounded-3xl` - 1.5rem
- `rounded-full` - 9999px

## Effects

### Opacity
- `opacity-0` to `opacity-100`

### Shadow
- `shadow-sm` - Small shadow
- `shadow` - Default shadow
- `shadow-md` - Medium shadow
- `shadow-lg` - Large shadow
- `shadow-xl` - Extra large shadow
- `shadow-2xl` - 2x extra large shadow
- `shadow-none` - No shadow

## Responsive Prefixes
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up
- `2xl:` - 1536px and up

Example: `md:text-lg` means text-lg on medium screens and up.

## State Variants
- `hover:` - When hovered
- `focus:` - When focused
- `active:` - When active
- `disabled:` - When disabled
- `dark:` - In dark mode

Example: `hover:bg-blue-500` applies blue background on hover.

## Recommended Tools
- [Tailwind Play](https://play.tailwindcss.com/) - Interactive sandbox
- [Tailwind Docs](https://tailwindcss.com/docs) - Official documentation
