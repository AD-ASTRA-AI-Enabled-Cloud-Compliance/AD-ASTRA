// ✅ File: footer.tsx
import {
  Box,
  BoxProps,
  Container,
  Flex,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  List,
  ListItem,
  ListIcon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
} from '@chakra-ui/react'
import { Link, LinkProps } from '@saas-ui/react'
import { MdEmail } from 'react-icons/md'
import siteConfig from '@/data/config'

export interface FooterProps extends BoxProps {
  columns?: number
}

export const Footer: React.FC<FooterProps> = (props) => {
  const { columns = 2, ...rest } = props

  return (
    <Box bg="white" _dark={{ bg: 'gray.900' }} {...rest}>
      <Container maxW="container.2xl" px="8" py="8">
        <SimpleGrid columns={columns}>
          {/* Left side: description + copyright */}
          <Stack spacing="8">
            <Text fontSize="md" color="muted">
              {siteConfig.seo.description}
            </Text>
            <Copyright>{siteConfig.footer.copyright}</Copyright>
          </Stack>

          {/* Right side: footer links */}
          <HStack justify="flex-end" spacing="4" alignSelf="flex-end">
            {siteConfig.footer?.links?.map(({ href, label }) => {
              /* 👉 Contact link opens a Popover */
              if (label === 'Contact') {
                return (
                  <Popover key="contact" placement="top-end" isLazy>
                    <PopoverTrigger>
                      {/* Need a focusable element for PopoverTrigger */}
                      <Box>
                        <FooterLink as="button">{label}</FooterLink>
                      </Box>
                    </PopoverTrigger>

                    <PopoverContent w="290px">
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader fontWeight="semibold">
                        Contact Our Team
                      </PopoverHeader>
                      <PopoverBody>
                        <List spacing={3}>
                          <ListItem>
                            <ListIcon as={MdEmail} color="blue.500" />
                            Javier Cesar Marquez P – 
                            <Link href="mailto:cesarjaviermarquezp@loyalistcollege.com">
                              cesarjaviermarquezp@loyalistcollege.com
                            </Link>
                          </ListItem>
                          <ListItem>
                            <ListIcon as={MdEmail} color="blue.500" />
                            Harsimran Kaur – 
                            <Link href="mailto:harsimrankaur24@loyalistcollege.com">
                              harsimrankaur24@loyalistcollege.com
                            </Link>
                          </ListItem>
                          <ListItem>
                            <ListIcon as={MdEmail} color="blue.500" />
                            Reginald Abby-Hart – 
                            <Link href="mailto:tuminitamonuaregi@loyalistcollege.com">
                              tuminitamonuaregi@loyalistcollege.com
                            </Link>
                          </ListItem>
                          <ListItem>
                            <ListIcon as={MdEmail} color="blue.500" />
                            Deepika Mehta – 
                            <Link href="mailto:deepikamehta@loyalistcollege.com">
                              deepikamehta@loyalistcollege.com
                            </Link>
                          </ListItem>
                          <ListItem>
                            <ListIcon as={MdEmail} color="blue.500" />
                            Puneet Sharma – 
                            <Link href="mailto:puneetsharma2@loyalistcollege.com">
                              puneetsharma2@loyalistcollege.com
                            </Link>
                          </ListItem>
                        </List>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                )
              }

              /* Other footer links */
              return (
                <FooterLink key={href} href={href}>
                  {label}
                </FooterLink>
              )
            })}
          </HStack>
        </SimpleGrid>
      </Container>
    </Box>
  )
}

/* ---------------- Helper components ---------------- */

export interface CopyrightProps {
  title?: React.ReactNode
  children: React.ReactNode
}

export const Copyright: React.FC<CopyrightProps> = ({
  title,
  children,
}: CopyrightProps) => {
  let content
  if (title && !children) {
    content = `© ${new Date().getFullYear()} - ${title}`
  }
  return (
    <Text color="muted" fontSize="sm">
      {content || children}
    </Text>
  )
}

export const FooterLink: React.FC<LinkProps> = (props) => {
  const { children, ...rest } = props
  return (
    <Link
      color="muted"
      fontSize="sm"
      textDecoration="none"
      _hover={{ color: 'blue.500', transition: 'color .2s ease-in' }}
      {...rest}
    >
      {children}
    </Link>
  )
}
