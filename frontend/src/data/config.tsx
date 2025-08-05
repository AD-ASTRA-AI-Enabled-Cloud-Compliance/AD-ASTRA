import { FaGithub } from 'react-icons/fa'
import { FiCheck } from 'react-icons/fi'
import { NextSeoProps } from 'next-seo'

const siteConfig = {
  seo: {
    title: 'SkyLock',
    description: 'Effortless Cloud Security Compliance Tool, Engineered for Modern Teams.',
  } as NextSeoProps,
  termsUrl: '#',
  privacyUrl: '#',
  header: {
    links: [
      {
        id: 'features',
        label: 'Features',
      },
      {
        id: 'faq',
        label: 'FAQ',
      },
      {
        label: 'Login',
        href: '/login',
      },
      {
        label: 'Sign Up',
        href: '/signup',
        variant: 'primary',
      },
    ],
  },
  footer: {
    copyright: (
      <>
        Built by <strong>Team SkyLock</strong>
      </>
    ),
    links: [
      {
        href: '#', // Clicking will open modal, href unused
        label: 'Contact',
      },
      {
        href: 'https://github.com/AD-ASTRA-AI-Enabled-Cloud-Compliance/AD-ASTRA',
        label: <FaGithub size="14" />,
      },
    ],
  },
  signup: {
    title: 'Start building with Saas UI',
    features: [
      {
        icon: FiCheck,
        title: 'Accessible',
        description: 'All components strictly follow WAI-ARIA standards.',
      },
      {
        icon: FiCheck,
        title: 'Themable',
        description: 'Fully customize all components to your brand with theme support and style props.',
      },
      {
        icon: FiCheck,
        title: 'Composable',
        description: 'Compose components to fit your needs and mix them together to create new ones.',
      },
      {
        icon: FiCheck,
        title: 'Productive',
        description: 'Designed to reduce boilerplate and fully typed, build your product at speed.',
      },
    ],
  },
}

export default siteConfig
