const config = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,jsx,ts,tsx}',
		'./components/**/*.{js,jsx,ts,tsx}',
		'./app/**/*.{js,jsx,ts,tsx}',
		'./src/**/*.{js,jsx,ts,tsx}'
	],
	prefix: '',
	theme: {
    	container: {
    		center: true,
    		padding: '2rem',
    		screens: {
    			'2xl': '1400px'
    		}
    	},
    	extend: {
    		colors: {
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			primary: {
    				'50': '#FFF7ED',
    				'100': '#FFEDD5',
    				'200': '#FED7AA',
    				'300': '#FDBA74',
    				'400': '#FB923C',
    				'500': '#F97316',
    				'600': '#EA580C',
    				'700': '#C2410C',
    				'800': '#9A3412',
    				'900': '#7C2D12',
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				'50': '#FFFAF0',
    				'100': '#FFEFD6',
    				'200': '#FFE0B2',
    				'300': '#FFD08A',
    				'400': '#FFC062',
    				'500': '#FFB039',
    				'600': '#FF9811',
    				'700': '#F98307',
    				'800': '#E67002',
    				'900': '#CC5F00',
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			info: {
    				DEFAULT: '#0EA5E9',
    				foreground: '#FFFFFF'
    			},
    			success: {
    				DEFAULT: '#22C55E',
    				foreground: '#FFFFFF'
    			},
    			warning: {
    				DEFAULT: '#78350F',
    				foreground: '#1A1A1A'
    			},
    			error: {
    				DEFAULT: '#EF4444',
    				foreground: '#FFFFFF'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			},
    			sidebar: {
    				DEFAULT: 'hsl(var(--sidebar-background))',
    				foreground: 'hsl(var(--sidebar-foreground))',
    				primary: 'hsl(var(--sidebar-primary))',
    				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    				accent: 'hsl(var(--sidebar-accent))',
    				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    				border: 'hsl(var(--sidebar-border))',
    				ring: 'hsl(var(--sidebar-ring))'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			},
    			'fade-up': {
    				from: {
    					opacity: '0',
    					transform: 'translateY(10px)'
    				},
    				to: {
    					opacity: '1',
    					transform: 'translateY(0)'
    				}
    			},
    			'fade-down': {
    				from: {
    					opacity: '1',
    					transform: 'translateY(0)'
    				},
    				to: {
    					opacity: '0',
    					transform: 'translateY(10px)'
    				}
    			},
    			'slide-in-right': {
    				'0%': {
    					transform: 'translateX(100%)'
    				},
    				'100%': {
    					transform: 'translateX(0)'
    				}
    			},
    			'slide-out-right': {
    				'0%': {
    					transform: 'translateX(0)'
    				},
    				'100%': {
    					transform: 'translateX(100%)'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			'fade-up': 'fade-up 0.3s ease-out',
    			'fade-down': 'fade-down 0.3s ease-out',
    			'slide-in-right': 'slide-in-right 0.3s ease-out',
    			'slide-out-right': 'slide-out-right 0.3s ease-out'
    		}
    	}
    },
	plugins: [require('tailwindcss-animate')]
};

export default config;
