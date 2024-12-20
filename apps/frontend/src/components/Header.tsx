import { Avatar, Button, Flex, Image, Link, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Spacer } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";

const links = [
  { label: 'Todos', path: '/' },
  { label: 'Graphs', path: '/data' },
  { label: 'Calendar', path: '/calendar' },
];

type HeaderPropTypes = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  user: { username: string, photo: string },
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
        <Link as={ReactRouterLink} to={link.path} key={idx} ml={[2, 4, 6]} tabIndex={-1}>
          <Button
            size={["sm", "md", "md"]}
            bgColor={"buttonBg"}
            _hover={{ bgColor: "hoverColor" }}
            color={"btnFontColor"}
            aria-label={`Go to ${link.label} page`}
            >
              {link.label}
            </Button>
        </Link>
      ))}
      <Popover arrowSize={10}>
        <PopoverTrigger>
          <Flex
            borderRadius={"full"}
            border={"2px solid"}
            borderColor={"avatarBorderColor"}
            ml={[2, 4, 10]}
            pos={"relative"}
            zIndex={200}
          >
            <Avatar
              name={user?.username}
              src={user?.photo}
              cursor={"pointer"}
              />
          </Flex>
        </PopoverTrigger>
        <PopoverContent w={"200px"} bgColor={"headerBg"}>
          <PopoverArrow bgColor={"headerBg"}/>
          <PopoverBody display={"flex"} flexDir={"column"} justifyContent={"center"} alignItems={"center"} gap={4} py={4}>
            <Button
              onClick={() => setShowModal(true)}
              w={"70%"}
              bgColor={"buttonBg"}
              color={"btnFontColor"}
              _hover={{ bgColor: "hoverColor"}}
              aria-label="Open settings"
              >
                Settings
              </Button>
            <Button
              onClick={handleLogout}
              w={"70%"}
              bgColor={"buttonBg"}
              color={"btnFontColor"}
              _hover={{ bgColor: "hoverColor"}}
              aria-label="Logout"
              >
                Logout
              </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  )
}