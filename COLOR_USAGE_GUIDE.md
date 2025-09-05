# HyperStaker Color Usage Guide

## ✅ Single Source of Truth

All colors are now defined in **`/lib/design-tokens.ts`** and automatically configured for both Mantine and Tailwind CSS.

## 🎨 How to Use Colors

### **1. Mantine Components (Recommended)**

Use Mantine's semantic color props:

```tsx
// ✅ CORRECT - Use semantic color names
<Button color="brand">Primary Button</Button>  // #4F45E4
<Card bg="surface.8" c="dark.0">Content</Card>
<Text c="brand.5">Accent Text</Text>
<Paper bg="surface.6" style={{ borderColor: theme.colors.surface[5] }}>
```

### **2. Tailwind Classes**

Use semantic Tailwind classes:

```tsx
// ✅ CORRECT - Use semantic names
<div className="bg-surface-800 text-neutral-50 border-surface-500">
<div className="bg-brand-500 hover:bg-brand-600"> // Primary button color #4F45E4
<div className="text-brand-500"> // Accent text
```

### **3. Direct Design Token Access (When Needed)**

```tsx
import { designTokens } from '@/lib/design-tokens';

// ✅ CORRECT - Use semantic tokens
<div style={{ 
  backgroundColor: designTokens.semantic.background.primary,
  color: designTokens.semantic.text.primary,
  borderColor: designTokens.semantic.border.primary
}}>
```

## 🚫 What NOT to Use

### **❌ NEVER Use These:**
```tsx
// ❌ Hard-coded hex values
<div style={{ backgroundColor: '#4F45E4' }}>

// ❌ Generic gray colors  
<div className="bg-gray-800 text-gray-300">

// ❌ Old color imports
import { colors } from '@/lib/colors'; // DEPRECATED

// ❌ Non-semantic color names
<Button color="purple">
```

## 🎯 Color Reference

### **Primary Colors**
- **Button Primary**: `#4F45E4` (brand.500)
- **Button Hover**: `#4338CA` (brand.600)  
- **Button Active**: `#3730A3` (brand.700)

### **Backgrounds**
- **Primary**: `#0E1525` (surface.800)
- **Secondary**: `#1A2332` (surface.600)
- **Borders**: `#242b3d` (surface.500)

### **Text Colors**
- **Primary**: `#FCE9DE` (neutral.50)
- **Secondary**: `#D6CAF1` (neutral.100) 
- **Muted**: `#B8A6E8` (neutral.200)

## 📋 Migration Checklist

When updating existing components:

1. ✅ Replace `import { colors }` with `import { designTokens }`
2. ✅ Update hard-coded hex values with semantic tokens
3. ✅ Convert `colors.brand.primary` → `designTokens.semantic.interactive.primary`
4. ✅ Convert `colors.surface.muted` → `designTokens.semantic.border.primary`
5. ✅ Test that all buttons use `#4F45E4` primary color

## 🎨 Semantic Color Mapping

| Old Usage | New Semantic Usage |
|-----------|-------------------|
| `colors.brand.primary` | `designTokens.semantic.interactive.primary` |
| `colors.surface.muted` | `designTokens.semantic.border.primary` |
| `colors.text.primary` | `designTokens.semantic.text.primary` |
| `colors.surface.veryDark` | `designTokens.semantic.background.secondary` |
| Hard-coded `#7c3aed` | `designTokens.semantic.interactive.primary` (#4F45E4) |

## 🛡️ Benefits

✅ **Single source of truth** - Change colors in one place  
✅ **Framework agnostic** - Works with both Mantine and Tailwind  
✅ **Semantic naming** - `interactive.primary` instead of `purple-500`  
✅ **Type safety** - TypeScript prevents wrong color usage  
✅ **Consistent theming** - All components automatically use same colors  
✅ **Primary button color** - All buttons consistently use #4F45E4