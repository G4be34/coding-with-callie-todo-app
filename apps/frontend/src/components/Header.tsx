import { Avatar, Button, Flex, Image, Link, Spacer } from "@chakra-ui/react";
import { useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const links = [
  { label: 'Todos', path: '/' },
  { label: 'Graphs', path: '/data' },
  { label: 'Calendar', path: '/calendar' },
]

export const Header = () => {
  const { logoutUser } = useAuth();
  const [showOptions, setShowOptions] = useState(false);

  return (
    <Flex as={"header"} borderBottom={"1px solid black"} p={4} px={14} alignItems={"center"}>
      <Image src="/logo.jpeg" alt="logo" boxSize="50px" objectFit={"contain"}/>
      <Spacer/>
      {links.map((link, idx) => (
        <Link as={ReactRouterLink} to={link.path} key={idx}>
          <Button ml={idx === 0 ? 0 : 6}>{link.label}</Button>
        </Link>
      ))}
      <Avatar name="test" src="https://bit.ly/dan-abramov" cursor={"pointer"} onClick={() => setShowOptions(!showOptions)} ml={10} pos={"relative"} />
      {showOptions ?
        <Flex flexDir={"column"} pos={"absolute"} right={5} top={20} border={"1px solid black"} borderRadius={10} bgColor={"white"} p={4} gap={2}>
          <Button>Settings</Button>
          <Button onClick={logoutUser} >Logout</Button>
        </Flex>
        : null
      }
    </Flex>
  )
}