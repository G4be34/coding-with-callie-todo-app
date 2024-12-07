import { Box, Button, Editable, EditableInput, EditablePreview, Flex, Heading, Image, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../context/useThemeContext";
import { FontType, ThemeType } from "../types";
import { EditableControls } from "./EditableControls";
import { NewPasswordModal } from "./NewPasswordModal";


type ProfilePropsType = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  user: { username: string, photo: string, email: string, _id: number, theme: ThemeType, font: FontType, background: string };
  token: string;
  setUser: React.Dispatch<React.SetStateAction<{ username: string, photo: string, email: string, _id: number, theme: ThemeType, font: FontType, background: string }>>;
  logoutUser: () => void;
}


export const ProfileModal = ({ setShowModal, showModal, user, token, setUser, logoutUser }: ProfilePropsType) => {
  const { changeTheme, changeFontStyle } = useThemeContext();
  const navigate = useNavigate();
  const toast = useToast();
  const [currentTab, setCurrentTab] = useState("Profile");
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMatch, setPwMatch] = useState(true);
  const [code, setCode] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [codeMatch, setCodeMatch] = useState(true);
  const [theme, setTheme] = useState(user.theme);
  const [font, setFont] = useState(user.font);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setShowSubmitButton] = useState(false);
  const [, setFile] = useState<string | null>(null);
  const [bgImage, setBgImage] = useState<string>(user.background);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFile(reader.result as string);
      setUser({ ...user, photo: reader.result as string });
      handleSubmit(reader.result as string);
    }
    reader.readAsDataURL(e.target.files[0]);
    setShowSubmitButton(true);
  };

  const handleSubmit = (base64: string) => {
    const params = {
      user_id: user._id,
      profile_photo_in_base64: base64.split(',')[1]
    }

    axios.post('api/image/s3_upload', params, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };

  const saveEdit = async (newItem: string) => {
    try {
      setLoading(true);
      const newUserInfo = await axios.patch(`/api/users/${user._id}`, {
        [newItem]: eval(newItem)
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser({ ...user, ...newUserInfo.data});
      setLoading(false);
      toast({
        title: 'Profile Updated',
        description: "Your profile has been updated.",
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    } catch (error) {
      if (loading) {
        setLoading(false);
      }
      toast({
        title: 'Error',
        description: "Error saving edit",
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    }
  };

  const deleteProfile = async () => {
    try {
      setLoading(true);

      await axios.delete(`/api/image/s3_delete/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      await axios.delete(`/api/users/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setShowConfirm(false);
      setShowModal(false);
      logoutUser();
      setLoading(false);
      navigate('/login');
      toast({
        title: 'Profile Deleted',
        description: "Your profile has been deleted.",
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Error',
        description: "Something went wrong, Please try again",
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    }
  };

  const sendVerificationEmail = async () => {
    try {
      setLoading(true);
      const code = await axios.post('/api/email', {
        username,
        email
      });

      setEmailCode(code.data.code);
      setLoading(false);
      setShowPwModal(true);
      toast({
        title: 'Code Sent',
        description: "Verification code has been sent",
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    } catch (error) {
      if (loading) {
        setLoading(false);
      }
      toast({
        title: 'Error',
        description: "Something went wrong, Please try again",
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    }
  };

  const submitNewPassword = async () => {
    try {
      if (password !== confirmPassword) {
        setPwMatch(false);
        return;
      }

      if (code !== emailCode) {
        setCodeMatch(false);
        return;
      }

      const newUserInfo = await axios.patch(`/api/users/${user._id}`, {
        password
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser({ ...user, ...newUserInfo.data});
      setShowPwModal(false);
      toast({
        title: 'Password Updated',
        description: "Your password has been updated.",
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: "Something went wrong, Please try again",
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    }
  };

  const changeBgImage = async (e: React.MouseEvent<HTMLImageElement>) => {
    if (bgImage === e.currentTarget.id) {
      return;
    }

    try {
      setLoading(true);

      const newBackground = e.currentTarget.id;

      const newUserInfo = await axios.patch(`/api/users/${user._id}`, {
        background: newBackground
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser({ ...user, ...newUserInfo.data});

      setBgImage(newBackground);

      setLoading(false);

      toast({
        title: 'Background Image Updated',
        description: "Your background image has been updated.",
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Error',
        description: "Error changing background image",
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    }
  };

  const changeColorTheme = async (newTheme: ThemeType) => {
    if (newTheme === theme) {
      return;
    }

    try {
      setLoading(true);

      changeTheme(newTheme);

      const newUserInfo = await axios.patch(`/api/users/${user._id}`, {
        theme: newTheme
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUser({ ...user, ...newUserInfo.data});

      setTheme(newTheme);

      setLoading(false);

      toast({
        title: 'Theme Updated',
        description: "Theme has been updated.",
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Error',
        description: "Error changing theme",
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    }
  };

  const changeFont = async (newFont: FontType) => {
    if (newFont === font) {
      return;
    }

    try {
      setLoading(true);

      changeFontStyle(newFont);

      const newUserInfo = await axios.patch(`/api/users/${user._id}`, {
        font: newFont
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUser({ ...user, ...newUserInfo.data});

      setFont(newFont);

      setLoading(false);

      toast({
        title: 'Font Updated',
        description: "Font has been updated.",
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Error',
        description: "Error changing font",
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    }
  };


  return (
    <>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} isCentered size={["sm", "lg", "2xl"]}>
        {showConfirm ?
          <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} isCentered size={"sm"}>
            <ModalOverlay />
            <ModalContent bgColor={"modalMainBg"}>
              <ModalHeader color={"modalFontColor"}>Are you sure you want to delete your profile?</ModalHeader>
              <ModalBody display={"flex"} justifyContent={"space-evenly"} marginBottom={4}>
                <Button onClick={deleteProfile} colorScheme={"red"}>Yes</Button>
                <Button onClick={() => setShowConfirm(false)}>No</Button>
              </ModalBody>
            </ModalContent>
          </Modal>
          : null}
        {showPwModal ?
          <NewPasswordModal
            showPwModal={showPwModal}
            setShowPwModal={setShowPwModal}
            password={password}
            setPassword={setPassword}
            pwMatch={pwMatch}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            codeMatch={codeMatch}
            code={code}
            setCode={setCode}
            submitNewPassword={submitNewPassword}
            />
          : null}
        <ModalOverlay />
        <ModalContent display={"flex"} flexDir={["column", "row", "row"]} bgColor={"transparent"}>
          {loading ? <Spinner color="blue.500" size="xl" position={"fixed"} top={"50%"} left={"50%"} bottom={"50%"} right={"50%"} /> : null}
          <Flex
            flexDir={"column"}
            gap={[2, 4, 4]}
            borderTopLeftRadius={"lg"}
            borderBottomLeftRadius={["none", "lg", "lg"]}
            borderTopRightRadius={["lg", "none", "none"]}
            justifyContent={"flex-start"}
            borderRight={["none", "1px solid black", "1px solid black"]}
            textDecor={"underline"}
            borderBottom={["1px solid black", "none", "none"]}
            textDecorationColor={"modalSideFont"}
            pt={5}
            bgColor={"modalSideBg"}
            >
            <Button
              variant={"ghost"}
              _hover={{ bgColor: "hoverColor"}}
              onClick={() => setCurrentTab("Profile")}
              color={"modalSideFont"}
              aria-label="Go to Profile Settings"
              >
                Profile Settings
              </Button>
            <Button
              variant={"ghost"}
              _hover={{ bgColor: "hoverColor"}}
              onClick={() => setCurrentTab("Theme")}
              color={"modalSideFont"}
              aria-label="Go to Color Themes"
              >
                Color Themes
              </Button>
            <Button
              variant={"ghost"}
              _hover={{ bgColor: "hoverColor"}}
              onClick={() => setCurrentTab("Font")}
              color={"modalSideFont"}
              aria-label="Go to Fonts Styles"
              >
                Fonts Styles
              </Button>
          </Flex>
          <Flex flexDir={"column"} flex={1} bgColor={"modalMainBg"} borderBottomLeftRadius={["lg", "none", "none"]} borderTopRightRadius={["none", "lg", "lg"]} borderBottomRightRadius={"lg"}>
            <ModalHeader textDecoration={"underline"} marginBottom={6} color={"modalFontColor"}>{currentTab}</ModalHeader>
            <ModalBody gap={6} display={"flex"} flexDir={"column"} alignItems={"center"}>
              {currentTab === "Profile" ?
                <>
                  <Flex direction="column" alignItems="center" gap={4} mb={6}>
                    <Image
                      borderRadius={"full"}
                      boxSize={["100px", "120px", "150px"]}
                      src={user.photo}
                      alt="Profile Photo"
                      border={"2px solid"}
                      borderColor={"profileBorderColor"}
                    />
                    <label htmlFor="fileInput">
                      <Button
                        as="span"
                        cursor="pointer"
                        size={["sm", "md", "md"]}
                        color={"btnFontColor"}
                        bgColor={"buttonBg"}
                        _hover={{ bgColor: "editBtnsHover" }}
                        aria-label="Upload a new profile photo"
                        >
                        Change Profile Photo
                      </Button>
                      <Input
                        type="file"
                        id="fileInput"
                        onChange={handleChange}
                        display="none"
                      />
                    </label>
                  </Flex>
                  <Heading size={["sm", "md", "md"]} mb={-2} color={"modalFontColor"}>Username:</Heading>
                  <Editable
                    defaultValue={username}
                    isPreviewFocusable={false}
                    display={"flex"}
                    onChange={(e) => setUsername(e)}
                    onSubmit={() => saveEdit("username")}
                    >
                    <EditablePreview w={["250px", "275px", "300px"]} color={"modalFontColor"} />
                    <Input as={EditableInput} w={["250px", "275px", "300px"]} mr={[8, 10, 12]} color={"modalFontColor"} />
                    <EditableControls />
                  </Editable>

                  <Heading size={["sm", "md", "md"]} mb={-2} color={"modalFontColor"}>Email:</Heading>
                  <Editable
                    onSubmit={() => saveEdit("email")}
                    defaultValue={email}
                    isPreviewFocusable={false}
                    display={"flex"}
                    onChange={(e) => setEmail(e)}
                    >
                    <EditablePreview w={["250px", "275px", "300px"]} color={"modalFontColor"} />
                    <Input as={EditableInput} w={["250px", "275px", "300px"]} mr={[8, 10, 12]} color={"modalFontColor"} />
                    <EditableControls />
                  </Editable>

                  <Heading size={["sm", "md", "md"]} mb={-2} color={"modalFontColor"}>Password:</Heading>
                  <Button
                    onClick={sendVerificationEmail}
                    bgColor={"buttonBg"}
                    color={"btnFontColor"}
                    _hover={{ bgColor: "editBtnsHover"}}
                    aria-label="Change your password"
                    >
                      Change Password
                    </Button>
                </>
                : null
              }
              {currentTab === "Theme" ?
                <>
                  <Heading size={["sm", "md", "md"]} mb={-2} color={"modalFontColor"}>Theme:</Heading>
                  <Flex justifyContent={"space-evenly"} w={"100%"} alignItems={"center"}>
                    <Button
                      variant={theme === "default" ? "solid" : "ghost"}
                      bgColor={"#023E8A"}
                      color={"#DEE2E6"}
                      onClick={() => changeColorTheme("default")}
                      _hover={{ bgColor: "#046ffb" }}
                      aria-label="Default Theme"
                      >
                        Default
                      </Button>
                    <Button
                      variant={theme === "light" ? "solid" : "ghost"}
                      bgColor={"#F5F3F4"}
                      color={"#161A1D"}
                      onClick={() => changeColorTheme("light")}
                      _hover={{ bgColor: "#ddd5da" }}
                      aria-label="Light Theme"
                      >
                        Light
                      </Button>
                    <Button
                      variant={theme === "dark" ? "solid" : "ghost"}
                      bgColor={"#6C757D"}
                      color={"#DEE2E6"}
                      onClick={() => changeColorTheme("dark")}
                      _hover={{ bgColor: "#848d94" }}
                      aria-label="Dark Theme"
                      >
                        Dark
                      </Button>
                    <Button
                      variant={theme === "rainbow" ? "solid" : "ghost"}
                      bgColor={"#FFCA3A"}
                      color={"#161A1D"}
                      onClick={() => changeColorTheme("rainbow")}
                      _hover={{ bgColor: "#ffdd80" }}
                      aria-label="Rainbow Theme"
                      >
                        Rainbow
                      </Button>
                  </Flex>
                  <Flex justifyContent={"center"} gap={[4, 4, 6]} alignItems={"center"}>
                    <Button
                      variant={theme === "purple" ? "solid" : "ghost"}
                      bgColor={"#973AA8"}
                      color={"#DEE2E6"}
                      onClick={() => changeColorTheme("purple")}
                      _hover={{ bgColor: "#bc67cb" }}
                      aria-label="Purple Theme"
                      >
                        Purple
                      </Button>
                    <Button
                      variant={theme === "red" ? "solid" : "ghost"}
                      bgColor={"#D00000"}
                      color={"#DEE2E6"}
                      onClick={() => changeColorTheme("red")}
                      _hover={{ bgColor: "#ff6666" }}
                      aria-label="Red Theme"
                      >
                        Red
                      </Button>
                  </Flex>
                  <Heading size={["sm", "md", "md"]} mt={6} color={"modalFontColor"}>Background Photo:</Heading>
                  <Flex justifyContent={"space-evenly"} w={"100%"}>
                    <Box pos={"relative"}>
                      <Image
                        id="1-GlassMorphismBg.jpg"
                        cursor={"pointer"}
                        src="1-GlassMorphismBg.jpg"
                        alt="GlassMorphismBg-1"
                        borderRadius={10}
                        border={"2px solid"}
                        borderColor={"borderColor"}
                        boxSize={["50px", "80px", "100px"]}
                        transition="box-shadow 0.2s ease-in-out"
                        _hover={{ boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.2)" }}
                        onClick={changeBgImage}
                      />
                      {bgImage === "1-GlassMorphismBg.jpg"
                        ? <IoMdCheckmarkCircle
                            color={"green"}
                            size={30}
                            style={{ position: "absolute", top: "0", left: "0", transform: "translate(-50%, -50%)" }}
                          />
                        : null}
                    </Box>
                    <Box pos={"relative"}>
                      <Image
                        id="2-GlassMorphismBg.jpg"
                        cursor={"pointer"}
                        src="2-GlassMorphismBg.jpg"
                        alt="GlassMorphismBg-2"
                        borderRadius={10}
                        border={"2px solid"}
                        borderColor={"borderColor"}
                        boxSize={["50px", "80px", "100px"]}
                        transition="box-shadow 0.2s ease-in-out"
                        _hover={{ boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.2)"}}
                        onClick={changeBgImage}
                      />
                      {bgImage === "2-GlassMorphismBg.jpg"
                        ? <IoMdCheckmarkCircle
                            color={"#0ef04a"}
                            size={30}
                            style={{ position: "absolute", top: "0", left: "0", transform: "translate(-50%, -50%)" }}
                          />
                        : null}
                    </Box>
                    <Box pos={"relative"}>
                      <Image
                        id="3-GlassMorphismBg.jpg"
                        cursor={"pointer"}
                        src="3-GlassMorphismBg.jpg"
                        alt="GlassMorphismBg-3"
                        borderRadius={10}
                        border={"2px solid"}
                        borderColor={"borderColor"}
                        boxSize={["50px", "80px", "100px"]}
                        transition="box-shadow 0.2s ease-in-out"
                        _hover={{ boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.2)" }}
                        onClick={changeBgImage}
                      />
                      {bgImage === "3-GlassMorphismBg.jpg"
                        ? <IoMdCheckmarkCircle
                            color={"green"}
                            size={30}
                            style={{ position: "absolute", top: "0", left: "0", transform: "translate(-50%, -50%)" }}
                          />
                        : null}
                    </Box>
                  </Flex>
                </>
                : null
              }
              {currentTab === "Font" ?
                <>
                  <Heading size={["sm", "md", "md"]} mb={-2} color={"modalFontColor"} textAlign={"center"}>Current Font:</Heading>
                  <Flex gap={[4, 4, 6]} alignItems={"center"} justifyContent={"center"}>
                    <Button
                      variant={font === "playfair" ? "solid" : "outline"}
                      borderColor={"buttonBg"}
                      bgColor={font === "playfair" ? "buttonBg" : "transparent"}
                      _hover={{ bgColor: "buttonBg" }}
                      color={"btnFontColor"}
                      onClick={() => changeFont("playfair")}
                      aria-label="Switch to Playfair font style"
                      >
                        Playfair
                    </Button>
                    <Button
                      variant={font === "kalam" ? "solid" : "outline"}
                      borderColor={"buttonBg"}
                      bgColor={font === "kalam" ? "buttonBg" : "transparent"}
                      _hover={{ bgColor: "buttonBg" }}
                      color={"btnFontColor"}
                      onClick={() => changeFont("kalam")}
                      aria-label="Switch to Kalam font style"
                      >
                        Kalam
                    </Button>
                    <Button
                      variant={font === "montserrat" ? "solid" : "outline"}
                      borderColor={"buttonBg"}
                      bgColor={font === "montserrat" ? "buttonBg" : "transparent"}
                      _hover={{ bgColor: "buttonBg" }}
                      color={"btnFontColor"}
                      onClick={() => changeFont("montserrat")}
                      aria-label="Switch to Montserrat font style"
                      >
                        Montserrat
                    </Button>
                  </Flex>
                </>
                : null
              }
            </ModalBody>
            <ModalFooter marginTop={["8, 10, 12"]} display={"flex"} justifyContent={"space-between"}>
              {currentTab === "Profile" ? <Button size={"sm"} colorScheme="red" onClick={() => setShowConfirm(true)} aria-label="Delete your account">Delete Account</Button> : null}
              <Button onClick={() => setShowModal(false)} aria-label="Close Settings" marginLeft={"auto"} bgColor={"buttonBg"} _hover={{ bgColor: "hoverColor" }} color={"btnFontColor"}>Close</Button>
            </ModalFooter>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  )
}