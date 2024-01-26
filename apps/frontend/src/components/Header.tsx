import { Button, Flex, Image, Link, Spacer } from "@chakra-ui/react"
import { Link as ReactRouterLink } from "react-router-dom"

const links = [
  { label: 'Todos', path: '/' },
  { label: 'Graphs', path: '/data' },
  { label: 'Calendar', path: '/calendar' },
]

export const Header = () => {
  return (
    <Flex>
      <Image src="/logo.jpeg" alt="logo" boxSize="50px" objectFit={"contain"}/>
      <Spacer/>
      {links.map((link, idx) => (
        <Link as={ReactRouterLink} to={link.path} key={idx}>
          <Button>{link.label}</Button>
        </Link>
      ))}
    </Flex>
  )
}