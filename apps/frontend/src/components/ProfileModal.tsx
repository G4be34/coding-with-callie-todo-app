import { Button, ButtonGroup, Editable, EditableInput, EditablePreview, Flex, FormControl, FormErrorMessage, FormLabel, Heading, IconButton, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useEditableControls } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { ImCheckboxChecked } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export const ProfileModal = ({ setShowModal, showModal }) => {
  const { user, token, setUser, logoutUser } = useAuth();
  const navigate = useNavigate();
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
    } catch (error) {
      if (loading) {
        setLoading(false);
      }
      console.log(error);
    }
  }

  const deleteProfile = async () => {
    try {
      setLoading(true);
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
    } catch (error) {
      if (loading) {
        setLoading(false);
      }
      console.log(error);
    }
  }

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
    } catch (error) {
      if (loading) {
        setLoading(false);
      }
      console.log(error);
    }
  }

  const submitNewPassword = async () => {
    try {
      setLoading(true);
      if (password !== confirmPassword) {
        setPwMatch(false);
        setLoading(false);
        return;
      }

      if (code !== emailCode) {
        setCodeMatch(false);
        setLoading(false);
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
      setLoading(false);
      setShowPwModal(false);
    } catch (error) {
      if (loading) {
        setLoading(false);
      }
      console.log(error);
    }
  }

  const EditableControls = () => {

    const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } = useEditableControls();

    return isEditing ? (
      <ButtonGroup>
        <IconButton icon={<ImCheckboxChecked />} aria-label="Save" {...getSubmitButtonProps()} />
        <IconButton icon={<AiFillCloseSquare />} aria-label="Cancel" {...getCancelButtonProps()} />
      </ButtonGroup>
    ) : (
      <Flex>
        <IconButton icon={<FaEdit />} aria-label="Edit" {...getEditButtonProps()} />
      </Flex>
    )
  }

  return (
    <>
      {loading ? <Spinner color="blue.500" size="xl" position={"fixed"} top={"50%"} left={"50%"} bottom={"50%"} right={"50%"} /> : null}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} isCentered size={"2xl"}>
        {showConfirm ?
          <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} isCentered size={"sm"}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Are you sure you want to delete your profile?</ModalHeader>
              <ModalBody display={"flex"} justifyContent={"space-evenly"} marginBottom={4}>
                <Button onClick={deleteProfile}>Yes</Button>
                <Button onClick={() => setShowConfirm(false)}>No</Button>
              </ModalBody>
            </ModalContent>
          </Modal>
          : null}
        {showPwModal ?
          <Modal isOpen={showPwModal} onClose={() => setShowPwModal(false)} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>A verification code has been sent to your email</ModalHeader>
              <ModalBody display={"flex"} flexDir={"column"} gap={4}>
                <FormControl isRequired isInvalid={password.length < 6}>
                  <FormLabel>Enter New Password</FormLabel>
                  <Input
                    type={"password"}
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    placeholder="New Password"
                    />
                  {password.length < 6 ? <FormErrorMessage>Password must be at least 6 characters long</FormErrorMessage> : null}
                </FormControl>
                <FormControl isRequired isInvalid={!pwMatch}>
                  <FormLabel>Confirm New Password</FormLabel>
                  <Input
                    type={"password"}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    placeholder="Confirm Password"
                    />
                  {!pwMatch ? <FormErrorMessage>Passwords do not match</FormErrorMessage> : null}
                </FormControl>
                <FormControl isRequired isInvalid={!codeMatch}>
                  <FormLabel>Enter Verification Code</FormLabel>
                  <Input
                    type={"text"}
                    onChange={(e) => setCode(e.target.value)}
                    value={code}
                    placeholder="Verification Code"
                    />
                  {!codeMatch ? <FormErrorMessage>Incorrect verification code</FormErrorMessage> : null}
                </FormControl>
              </ModalBody>
              <ModalFooter display={"flex"} justifyContent={"space-evenly"}>
                <Button onClick={submitNewPassword}>Submit</Button>
                <Button onClick={() => setShowPwModal(false)}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          : null}
        <ModalOverlay />
        <ModalContent display={"flex"} flexDir={"row"} >
          <Flex flexDir={"column"} gap={4} justifyContent={"center"} borderRight={"1px solid black"}>
            <Button variant={"ghost"} onClick={() => setCurrentTab("Profile")}>Profile Settings</Button>
            <Button variant={"ghost"} onClick={() => setCurrentTab("Theme")}>Color Themes</Button>
            <Button variant={"ghost"} onClick={() => setCurrentTab("Font")}>Fonts Styles</Button>
          </Flex>
          <Flex flexDir={"column"} flex={1}>
            <ModalHeader textDecoration={"underline"} marginBottom={6}>{currentTab}</ModalHeader>
            <ModalBody gap={6} display={"flex"} flexDir={"column"} alignItems={"center"}>
              {currentTab === "Profile" ?
                <>
                  <Heading size={"md"} mb={-2}>Username:</Heading>
                  <Editable defaultValue={username} isPreviewFocusable={false} display={"flex"} onChange={(e) => setUsername(e)} onSubmit={() => saveEdit("username")} >
                    <EditablePreview w={"300px"} />
                    <Input as={EditableInput} w={"300px"} mr={12} />
                    <EditableControls />
                  </Editable>

                  <Heading size={"md"} mb={-2}>Email:</Heading>
                  <Editable onSubmit={() => saveEdit("email")} defaultValue={email} isPreviewFocusable={false} display={"flex"} onChange={(e) => setEmail(e)} >
                    <EditablePreview w={"300px"} />
                    <Input as={EditableInput} w={"300px"} mr={12} />
                    <EditableControls />
                  </Editable>

                  <Heading size={"md"} mb={-2}>Password:</Heading>
                  <Button onClick={sendVerificationEmail}>Change Password</Button>
                </>
                : null
              }
              {currentTab === "Theme" ?
                <>
                  <Heading size={"md"} mb={-2}>Current Theme:</Heading>
                  <Editable onSubmit={() => saveEdit("theme")} defaultValue={theme} isPreviewFocusable={false} display={"flex"} onChange={(e) => setTheme(e)} >
                    <EditablePreview w={"300px"} />
                    <Input as={EditableInput} w={"300px"} mr={12} />
                    <EditableControls />
                  </Editable>
                </>
                : null
              }
              {currentTab === "Font" ?
                <>
                  <Heading size={"md"} mb={-2}>Current Font:</Heading>
                  <Editable onSubmit={() => saveEdit("font")} defaultValue={font} isPreviewFocusable={false} display={"flex"} onChange={(e) => setFont(e)} >
                    <EditablePreview w={"300px"} />
                    <Input as={EditableInput} w={"300px"} mr={12} />
                    <EditableControls />
                  </Editable>
                </>
                : null
              }
            </ModalBody>
            <ModalFooter marginTop={12} display={"flex"} justifyContent={"space-between"}>
              {currentTab === "Profile" ? <Button size={"sm"} colorScheme="red" onClick={() => setShowConfirm(true)}>Delete Account</Button> : null}
              <Button onClick={() => setShowModal(false)} marginLeft={"auto"}>Close</Button>
            </ModalFooter>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  )
}