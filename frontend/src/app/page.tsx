'use client'

import { Box, ButtonGroup, Container, Flex, HStack, Heading, Icon, IconButton, Stack, Tag, Text, VStack, Wrap, useClipboard, useColorModeValue } from '@chakra-ui/react'
import { Br, Link } from '@saas-ui/react'
import type { Metadata, NextPage } from 'next'
import Image from 'next/image'
import {
  FiArrowRight,
  FiBox,
  FiCheck,
  FiCode,
  FiCopy,
  FiFlag,
  FiGrid,
  FiLock,
  FiSearch,
  FiSliders,
  FiSmile,
  FiTerminal,
  FiThumbsUp,
  FiToggleLeft,
  FiTrendingUp,
  FiUserPlus,
} from 'react-icons/fi'

import * as React from 'react'
import { ButtonLink } from '@/components/landing/button-link'
import { BackgroundGradient } from '@/components/landing/gradients/background-gradient'
import { Hero } from '@/components/landing/hero'
import { FallInPlace } from '@/components/landing/motion/fall-in-place'
import { Highlights, HighlightsItem, HighlightsTestimonialItem } from '@/components/landing/highlights'
import { Features } from '@/components/landing/features'
import { Testimonial, Testimonials } from '@/components/landing/testimonials'
import { Em } from '@/components/landing/typography'
import { ChakraLogo, NextjsLogo } from '@/components/landing/logos'
import { Faq } from '@/components/landing/faq'
import testimonials from '@/data/testimonials'
import faq from '@/data/faq'
import { Header } from '@/components/landing/layout/header'
import { Footer } from '@/components/landing/layout/footer'

// export const meta: Metadata = {
//   title: 'Saas UI Landingspage',
//   description: 'Free SaaS landingspage starter kit',
// }

export const meta: Metadata = {
  title: 'SkyLock – Cloud Compliance Made Easy',
  description: 'Automate cloud compliance validation and secure infrastructure with SkyLock. AI-powered Terraform generation for HIPAA, PCI-DSS, NIST, and GDPR. Trusted by cloud teams.',
}
const Home: NextPage = () => {
  return (
    <Box>
      <Header/>

      <HeroSection />

      <HighlightsSection />

      <FeaturesSection />

      <TestimonialsSection />

      <ComplianceDiagramSection />

      <FaqSection />

      <Footer />
    </Box>
  )
}

const HeroSection: React.FC = () => {
  return (
    <Box position="relative" overflow="hidden">
      <BackgroundGradient height="100%" zIndex="-1" />
      <Container maxW="container.xl" pt={{ base: 40, lg: 60 }} pb="40">
        <Stack direction={{ base: 'column', lg: 'row' }} alignItems="center">
          <Hero
            id="home"
            justifyContent="flex-start"
            px="0"
            title={
              <FallInPlace>
                Skylock <br /><br />
                Cloud Compliance
                <Br /> made easy
              </FallInPlace>
            }
            description={
              <FallInPlace delay={0.4} fontWeight="medium">
                <Em>SkyLock </Em>
                  is a tool with security at its core — tailored for startups and modern teams.
                <Br /> Designed by Cloud Engineers for Cloud Engineers<Br />{' '}
                <Br /> TF Validation. AI assisted. Easy Deployments. <Br />{' '}
              </FallInPlace>
            }
          >
            <FallInPlace delay={0.8}>
              <HStack pt="4" pb="12" spacing="8">
                <NextjsLogo height="28px" /> <ChakraLogo height="20px" />
              </HStack>

              <ButtonGroup spacing={4} alignItems="center">
                <ButtonLink colorScheme="primary" size="lg" href="/signup">
                  Sign Up
                </ButtonLink>
                <ButtonLink
                  size="lg"
                  href="https://bit.ly/Skylock-Promo"
                  variant="outline"
                  rightIcon={
                    <Icon
                      as={FiArrowRight}
                      sx={{
                        transitionProperty: 'common',
                        transitionDuration: 'normal',
                        '.chakra-button:hover &': {
                          transform: 'translate(5px)',
                        },
                      }}
                    />
                  }
                >
                  View demo
                </ButtonLink>
              </ButtonGroup>
            </FallInPlace>
          </Hero>
          <Box
            height="600px"
            position="absolute"
            display={{ base: 'none', lg: 'block' }}
            left={{ lg: '60%', xl: '55%' }}
            width="80vw"
            maxW="1100px"
            margin="0 auto"
          >
            <FallInPlace delay={1}>
              <Box overflow="hidden" height="100%">
                <Image
                  src="/static/screenshots/rules.png"
                  width={1200}
                  height={762}
                  alt="Screenshot of Skylock Compliance"
                  quality="75"
                  priority
                />
              </Box>
            </FallInPlace>
          </Box>
        </Stack>
      </Container>

      <Features
        id="benefits"
        columns={[1, 2, 4]}
        iconSize={4}
        innerWidth="container.xl"
        pt="20"
        features={[
          {
            title: 'Secure by Design',
            icon: FiSmile,
            description: 'Every component is engineered with cloud security best practices and compliance-first principles.',
            iconPosition: 'left',
            delay: 0.6,
          },
          {
            title: 'Framework-Aware',
            icon: FiSliders,
            description:
              'Automatically maps compliance rules from frameworks like PCI, HIPAA, NIST, and GDPR to cloud-native services.',
            iconPosition: 'left',
            delay: 0.8,
          },
          {
            title: 'Customizable & Extensible',
            icon: FiGrid,
            description:
              'Easily extend rules, modify baselines, or plug in new providers to suit your infrastructure setup.',
            iconPosition: 'left',
            delay: 1,
          },
          {
            title: 'Insightful & Actionable',
            icon: FiThumbsUp,
            description:
              'Generates patch-ready Terraform, flags misconfigurations, and shows improvement scores to guide remediation.',
            iconPosition: 'left',
            delay: 1.1,
          },
        ]}
        reveal={FallInPlace}
      />
    </Box>
  )
}

const HighlightsSection = () => {
  const { value, onCopy, hasCopied } = useClipboard('yarn add @saas-ui/react')

  return (
    <Highlights>
      <HighlightsItem colSpan={[1, null, 2]} title="Core Functions">
        <VStack alignItems="flex-start" spacing="8">
          <Text color="muted" fontSize="xl">
            Deploy cloud infrastructure aligned with global compliance standards including HIPAA, PCI-DSS, NIST, and more.
            <Br />
            Automated validation & Remediation: You choose what to deploy, we ensure it's compliant.
            <Br />
          </Text>

        </VStack>
      </HighlightsItem>
      <HighlightsItem title="Security in mind">
        <Text color="muted" fontSize="lg">
          Minimize the risk of data breaches and regulatory penalties by proactively verifying and securing your cloud architecture against industry standards.
        </Text>
      </HighlightsItem>
      <HighlightsTestimonialItem
        name="Emma Collins"
        description="Cloud Security Lead"
        avatar="/static/images/avatar.jpg"
        gradient={['pink.200', 'gray.500']}
        sx={{
          color: 'black !important',
          '& *': {
            color: 'black !important'
          }
        }}
      >
        "SkyLock helped us accelerate our compliance journey across AWS and Azure. The auto-generated Terraform and security validations saved us weeks of manual effort and ensured we met HIPAA and NIST standards from day one."
      </HighlightsTestimonialItem>
      <HighlightsItem
        colSpan={[1, null, 2]}
        title="Deploy & Monitor your cloud resoures"
      >
        <Text color="muted" fontSize="lg">
          We take care of all your basic compliance verification needs, 
          so you can focus on what matters most: your clients.
        </Text>
        <Wrap mt="8">
          {[
            'cybersecurity',
            'exfiltration',
            'compliance',
            'archiecture',
            'multi-tenancy',
            'monitoring',
            'hipaa',
            'information security',
            'confidentiality',
            'integrity',
            'availability',
            'ai assisted',
            'remediation',
          ].map((value) => (
            <Tag
              key={value}
              variant="subtle"
              colorScheme="purple"
              rounded="full"
              px="3"
            >
              {value}
            </Tag>
          ))}
        </Wrap>
      </HighlightsItem>
    </Highlights>
  )
}

const FeaturesSection = () => {
  return (
    <Features
      id="features"
      title={
        <Heading
          lineHeight="short"
          fontSize={['2xl', null, '4xl']}
          textAlign="left"
          as="p"
        >
          Not your standard
          <Br /> compliance tool.
        </Heading>
      }
      description={
        <>
          Skylock provides a comprehensive suite of capabilities to redefine your cloud governance and compliance. 
          <Br />
          It offers everything you need to build robust, compliant cloud infrastructure and streamline your security operations. Use Skylock as the foundational platform for your next secure cloud deployment or as the core of your enterprise's compliance design system.
        </>
      }
      align="left"
      columns={[1, 2, 3]}
      iconSize={4}
      features={[
        {
          title: 'Intelligent Policy & Rule Ingestion',
          icon: FiBox,
          description:
            'Our system ingests regulatory standards, internal policies, and cloud provider documents, converting them into actionable JSON security rules. These are then mapped to cloud-specific services, aligned with our baselines.',
          variant: 'inline',
        },
        {
          title: 'Automated Compliance Validation',
          icon: FiLock,
          description:
            'We validate your cloud services and IaC against defined security rules. Non-compliance triggers detailed reports with remediation suggestions, helping improve baseline rules continuously.',
          variant: 'inline',
        },
        {
          title: 'Dynamic Terraform Baseline Generation',
          icon: FiSearch,
          description:
            'For each framework and cloud provider, the tool generates and stores a Terraform baseline tailored to your needs, ensuring relevant configurations are always available.',
          variant: 'inline',
        },
        {
          title: 'Intuitive IaC Comparison & Configuration',
          icon: FiUserPlus,
          description:
            'Upload your Terraform files to compare with our baselines. Differences are shown as interactive checkboxes for easy review and inclusion in your final IaC.',
          variant: 'inline',
        },
        {
          title: 'Real-time Compliance Scoring',
          icon: FiFlag,
          description:
            'A compliance score is calculated instantly, showing how well your IaC aligns with security baselines.',
          variant: 'inline',
        },
        {
          title: 'Automated Remediation & Download',
          icon: FiTrendingUp,
          description:
            'After selecting changes, a patch is generated with an updated score. Download the revised Terraform file for fast remediation and improved security.',
          variant: 'inline',
        },
        // {
        //   title: 'Themes.',
        //   icon: FiToggleLeft,
        //   description:
        //     'Includes multiple themes with darkmode support, always have the perfect starting point for your next project.',
        //   variant: 'inline',
        // },
        // {
        //   title: 'Generators.',
        //   icon: FiTerminal,
        //   description:
        //     'Extend your design system while maintaininig code quality and consistency with built-in generators.',
        //   variant: 'inline',
        // },
        // {
        //   title: 'Monorepo.',
        //   icon: FiCode,
        //   description: (
        //     <>
        //       All code is available as packages in a high-performance{' '}
        //       <Link href="https://turborepo.com">Turborepo</Link>, you have full
        //       control to modify and adjust it to your workflow.
        //     </>
        //   ),
        //   variant: 'inline',
        // },
      ]}
    />
  )
}

const TestimonialsSection = () => {
  const columns = React.useMemo(() => {
    return testimonials.items.reduce<Array<typeof testimonials.items>>(
      (columns, t, i) => {
        columns[i % 3].push(t)

        return columns
      },
      [[], [], []],
    )
  }, [])

  return (
    <Testimonials
      title={testimonials.title}
      columns={[1, 2, 3]}
      innerWidth="container.xl"
    >
      <>
        {columns.map((column, i) => (
          <Stack key={i} spacing="8">
            {column.map((t, i) => (
              <Testimonial key={i} {...t} />
            ))}
          </Stack>
        ))}
      </>
    </Testimonials>
  )
}

// NEW: Compliance Diagram Section (replaces PricingSection)
const ComplianceDiagramSection = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box py={20} bg={bgColor} id="compliance-frameworks">
      <Container maxW="container.xl">
        <VStack spacing={8} textAlign="center">
          {/* Header Section */}
          <Box maxW="700px">
            <Heading
              size="xl"
              mb={4}
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
            >
             Compliance Overview
            </Heading>
            <Text fontSize="lg" color="muted">
              SkyLock integrates with major compliance frameworks 
              to secure your cloud infrastructure across Azure, AWS, and multi-cloud environments.
            </Text>
          </Box>

          {/* SVG Compliance Diagram */}
          <Box
            width="100%"
            maxW="100%"
            p={{ base: 4, md: 8 }}
            bg={cardBgColor}
            borderRadius="xl"
            border="1px"
            borderColor={borderColor}
            boxShadow="xl"
            transition="all 0.3s ease"
            _hover={{
              boxShadow: "2xl",
              transform: "translateY(-2px)"
            }}
          >
            <Image
              src="/svgs/compliance_overview.svg"
              alt="SkyLock Compliance Frameworks Integration Diagram showing HIPAA, PCI-DSS, NIST, and GDPR compliance"
              width={1200}
              height={600}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '8px',
              }}
              priority={false}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            />
          </Box>

          {/* Supporting Information */}
          <VStack spacing={4} maxW="600px">
            <Text fontSize="sm" color="muted" textAlign="center">
              <strong>Supported Frameworks:</strong> HIPAA, PCI-DSS, NIST Cybersecurity Framework, 
              GDPR and custom organizational policies.
            </Text>
            <Text fontSize="sm" color="muted" textAlign="center">
              Automated compliance validation across Azure, AWS, and hybrid cloud environments 
              with real-time scoring and remediation guidance.
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
}

/* 
// COMMENTED OUT: Original PricingSection
const PricingSection = () => {
  return (
    <Pricing {...pricing}>
      <Text p="8" textAlign="center" color="muted">
        VAT may be applicable depending on your location.
      </Text>
    </Pricing>
  )
}
*/

const FaqSection = () => {
  return <Faq {...faq} />
}

export default Home
