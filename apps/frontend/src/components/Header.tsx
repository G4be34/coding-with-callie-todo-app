import { Avatar, Button, Flex, Image, Link, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Spacer } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";

const links = [
  { label: 'Todos', path: '/' },
  { label: 'Graphs', path: '/data' },
  { label: 'Calendar', path: '/calendar' },
];

type HeaderPropTypes = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  user: any,
  logoutUser: () => void
}

export const Header = ({ setShowModal, user, logoutUser }: HeaderPropTypes) => {

  const handleLogout = () => {
    logoutUser();
  }

  return (
    <Flex as={"header"} borderBottom={"1px solid black"} p={4} px={[4, 8, 14]} alignItems={"center"} bgColor={"headerBg"}>
      <Image src="/logo.jpeg" alt="logo" boxSize="50px" objectFit={"contain"} borderRadius={10}/>
      <Spacer/>
      {links.map((link, idx) => (
        <Link as={ReactRouterLink} to={link.path} key={idx}>
          <Button ml={[2, 4, 6]} size={["sm", "md", "md"]} bgColor={"headerBtnBg"}>{link.label}</Button>
        </Link>
      ))}
      <Popover arrowSize={10}>
        <PopoverTrigger>
          <Avatar
            name={user?.username}
            src={user?.photo}
            cursor={"pointer"}
            ml={[2, 4, 10]} pos={"relative"} zIndex={200}
            />
        </PopoverTrigger>
        <PopoverContent w={"200px"}>
          <PopoverArrow />
          <PopoverBody display={"flex"} flexDir={"column"} justifyContent={"center"} alignItems={"center"} gap={4} py={4}>
            <Button onClick={() => setShowModal(true)} w={"70%"}>Settings</Button>
            <Button onClick={handleLogout} w={"70%"}>Logout</Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  )
}