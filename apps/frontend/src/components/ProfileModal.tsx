import { Button, ButtonGroup, Editable, EditableInput, EditablePreview, Flex, Heading, IconButton, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useEditableControls } from "@chakra-ui/react";
import { useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { ImCheckboxChecked } from "react-icons/im";

export const ProfileModal = ({ setShowModal, showModal }) => {
  const [currentTab, setCurrentTab] = useState("Profile");
  const [currentName, setCurrentName] = useState("test");
  const [currentEmail, setCurrentEmail] = useState("test");
  const [currentPw, setCurrentPw] = useState("test");
  const [currentTheme, setCurrentTheme] = useState("test");
  const [currentFont, setCurrentFont] = useState("test");

  const saveEdit = () => {
    console.log("Saved: ", currentName, currentEmail, currentPw, currentTheme, currentFont);
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
      <ModalOverlay />
      <ModalContent display={"flex"} flexDir={"row"} >
        <Flex flexDir={"column"} gap={4} justifyContent={"center"} borderRight={"1px solid black"}>
          <Button variant={"ghost"} onClick={() => setCurrentTab("Profile")}>Profile Settings</Button>
          <Button variant={"ghost"} onClick={() => setCurrentTab("Theme")}>Color Themes</Button>
          <Button variant={"ghost"} onClick={() => setCurrentTab("Font")}>Fonts Styles</Button>
        </Flex>
        <Flex flexDir={"column"} flex={1}>
          <ModalHeader textDecoration={"underline"}>{currentTab}</ModalHeader>
          <ModalBody gap={6} display={"flex"} flexDir={"column"} alignItems={"center"}>
            {currentTab === "Profile" ?
              <>
                <Heading size={"md"} mb={-2}>Username:</Heading>
                <Editable defaultValue={currentName} isPreviewFocusable={false} display={"flex"} onChange={(e) => setCurrentName(e)} onSubmit={() => saveEdit()} >
                  <EditablePreview w={"300px"} />
                  <Input as={EditableInput} w={"300px"} mr={12} />
                  <EditableControls />
                </Editable>

                <Heading size={"md"} mb={-2}>Email:</Heading>
                <Editable defaultValue={currentEmail} isPreviewFocusable={false} display={"flex"} onChange={(e) => setCurrentEmail(e)} >
                  <EditablePreview w={"300px"} />
                  <Input as={EditableInput} w={"300px"} mr={12} />
                  <EditableControls />
                </Editable>

                <Heading size={"md"} mb={-2}>Password:</Heading>
                <Editable defaultValue={currentPw} isPreviewFocusable={false} display={"flex"} onChange={(e) => setCurrentPw(e)} >
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
                <Editable defaultValue={currentTheme} isPreviewFocusable={false} display={"flex"} onChange={(e) => setCurrentTheme(e)} >
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
                <Editable defaultValue={currentFont} isPreviewFocusable={false} display={"flex"} onChange={(e) => setCurrentFont(e)} >
                  <EditablePreview w={"300px"} />
                  <Input as={EditableInput} w={"300px"} mr={12} />
                  <EditableControls />
                </Editable>
              </>
              : null
            }
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setShowModal(false)}>Close</Button>
          </ModalFooter>
        </Flex>
      </ModalContent>
    </Modal>
  )
}