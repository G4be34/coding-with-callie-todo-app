import { Avatar, Button, Flex, Image, Link, Spacer } from "@chakra-ui/react"
import { Link as ReactRouterLink } from "react-router-dom"

const links = [
  { label: 'Todos', path: '/' },
  { label: 'Graphs', path: '/data' },
  { label: 'Calendar', path: '/calendar' },
]

export const Header = () => {
  return (
    <Flex as={"header"} borderBottom={"1px solid black"} p={4} alignItems={"center"}>
      <Image src="/logo.jpeg" alt="logo" boxSize="50px" objectFit={"contain"}/>
      <Spacer/>
      {links.map((link, idx) => (
        <Link as={ReactRouterLink} to={link.path} key={idx}>
          <Button ml={idx === 0 ? 0 : 2}>{link.label}</Button>
        </Link>
      ))}
      <Avatar name="test" src="https://bit.ly/dan-abramov" ml={10} />
    </Flex>
  )
}