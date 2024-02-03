import { Button, ButtonGroup, Editable, EditableInput, EditablePreview, Flex, Heading, IconButton, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useEditableControls } from "@chakra-ui/react";
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
  const [password, setPassword] = useState(user.password);
  const [theme, setTheme] = useState(user.theme);
  const [font, setFont] = useState(user.font);
  const [showConfirm, setShowConfirm] = useState(false);

  const saveEdit = async (newItem: string) => {
    try {
      console.log("user id: ", user._id);
      const newUserInfo = await axios.patch(`http://localhost:3010/api/users/${user._id}`, {
        [newItem]: eval(newItem)
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("newUserInfo: ", newUserInfo.data);
      setUser({ ...user, ...newUserInfo.data});
    } catch (error) {
      console.log(error);
    }
  }

  const deleteProfile = async () => {
    try {
      await axios.delete(`http://localhost:3010/api/users/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setShowConfirm(false);
      setShowModal(false);
      logoutUser();
      navigate('/login');
    } catch (error) {
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
    <Modal isOpen={showModal} onClose={() => setShowModal(false)} isCentered size={"2xl"}>
      {showConfirm ?
        <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} isCentered size={"sm"}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Are you sure you want to delete your profile?</ModalHeader>
            <ModalBody display={"flex"} justifyContent={"space-evenly"}>
              <Button onClick={deleteProfile}>Yes</Button>
              <Button onClick={() => setShowConfirm(false)}>No</Button>
            </ModalBody>
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
                <Editable defaultValue={username} isPreviewFocusable={false} display={"flex"} onChange={(e) => setUsername(e)} onSubmit={() => saveEdit("name")} >
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
                <Editable onSubmit={() => saveEdit("password")} defaultValue={password} isPreviewFocusable={false} display={"flex"} onChange={(e) => setPassword(e)} >
                  <EditablePreview w={"300px"} />
                  <Input as={EditableInput} w={"300px"} mr={12} />
                  <EditableControls />
                </Editable>
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
            {currentTab === "Profile" ? <Button colorScheme="red" onClick={() => setShowConfirm(true)}>Delete Account</Button> : null}
            <Button onClick={() => setShowModal(false)} marginLeft={"auto"}>Close</Button>
          </ModalFooter>
        </Flex>
      </ModalContent>
    </Modal>
  )
}