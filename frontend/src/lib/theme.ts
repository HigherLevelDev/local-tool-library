// Theme configuration for consistent styling across pages
export const theme = {
  // Background gradients
  gradients: {
    primary: 'bg-gradient-to-b from-blue-300 to-blue-500',
  },
  
  // Colors
  colors: {
    primary: 'blue-600',
    primaryHover: 'blue-700',
    secondary: 'blue-800',
    accent: 'blue-200',
  },

  // Component specific styles
  components: {
    // Card styles
    card: {
      base: 'bg-white/90 shadow-xl backdrop-blur-sm',
    },
    
    // Input styles
    input: {
      base: 'bg-white/50 border-blue-200',
    },
    
    // Button styles
    button: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      link: 'text-blue-600 hover:text-blue-700',
    },
    
    // Text styles
    text: {
      heading: 'text-blue-600',
      body: 'text-blue-800',
    },

    // Navigation styles
    nav: {
      link: 'text-blue-600 hover:text-blue-700 text-sm md:text-base',
      active: 'text-blue-800 font-semibold',
    },

    // Tools specific styles
    tools: {
      container: 'min-h-screen bg-gradient-to-b from-blue-50 to-white px-4',
      header: 'text-2xl font-bold text-blue-800 mb-6',
      grid: 'grid gap-6 md:grid-cols-2 lg:grid-cols-3',
      empty: 'text-blue-600 italic',
    },
  },
}

// Utility function to get theme classes
export const getThemeClass = (path: string): string => {
  const parts = path.split('.')
  let current: any = theme
  
  for (const part of parts) {
    if (current[part] === undefined) {
      console.warn(`Theme path "${path}" not found`)
      return ''
    }
    current = current[part]
  }
  
  return current
}