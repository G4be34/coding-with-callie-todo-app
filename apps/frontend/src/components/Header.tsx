import { Avatar, Button, Flex, Image, Link, Spacer } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";

const links = [
  { label: 'Todos', path: '/' },
  { label: 'Graphs', path: '/data' },
  { label: 'Calendar', path: '/calendar' },
];

type HeaderPropTypes = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  showOptions: boolean,
  setShowOptions: React.Dispatch<React.SetStateAction<boolean>>,
  user: any,
  logoutUser: () => void
}

export const Header = ({ setShowModal, showOptions, setShowOptions, user, logoutUser }: HeaderPropTypes) => {

  const openModal = () => {
    setShowModal(true);
    setShowOptions(false);
  }

  const handleLogout = () => {
    logoutUser();
    setShowOptions(false);
  }

  return (
    <Flex as={"header"} borderBottom={"1px solid black"} p={4} px={[4, 8, 14]} alignItems={"center"}>
      <Image src="/logo.jpeg" alt="logo" boxSize="50px" objectFit={"contain"} borderRadius={10}/>
      <Spacer/>
      {links.map((link, idx) => (
        <Link as={ReactRouterLink} to={link.path} key={idx}>
          <Button ml={[2, 4, 6]} size={["sm", "md", "md"]}>{link.label}</Button>
        </Link>
      ))}
      <Avatar
        name={user?.username}
        src={user?.photo}
        cursor={"pointer"}
        onClick={() => setShowOptions(!showOptions)}
        ml={[2, 4, 10]} pos={"relative"} zIndex={200}
        />
      {showOptions ?
        <Flex flexDir={"column"} pos={"absolute"} right={5} top={20} border={"1px solid black"} borderRadius={10} bgColor={"white"} p={4} gap={2} zIndex={100}>
          <Button onClick={openModal}>Settings</Button>
          <Button onClick={handleLogout}>Logout</Button>
        </Flex>
        : null
      }
    </Flex>
  )
}