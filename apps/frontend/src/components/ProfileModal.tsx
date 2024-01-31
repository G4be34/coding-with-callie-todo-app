import { Button, ButtonGroup, Editable, EditableInput, EditablePreview, Flex, IconButton, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useEditableControls } from "@chakra-ui/react";
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

  const EditableControls = () => {

    const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } = useEditableControls();

    const saveEdit = () => {
      console.log("Saved: ", currentName, currentEmail, currentPw, currentTheme, currentFont);
    }

    return isEditing ? (
      <ButtonGroup>
        <IconButton icon={<ImCheckboxChecked />} aria-label="Save" {...getSubmitButtonProps()} onClick={saveEdit} />
        <IconButton icon={<AiFillCloseSquare />} aria-label="Cancel" {...getCancelButtonProps()} />
      </ButtonGroup>
    ) : (
      <Flex>
        <IconButton icon={<FaEdit />} aria-label="Edit" {...getEditButtonProps()} />
      </Flex>
    )
  }

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)} isCentered>
      <ModalOverlay />
      <ModalContent display={"flex"} flexDir={"row"}>
        <Flex flexDir={"column"} gap={4} justifyContent={"center"} borderRight={"1px solid black"}>
          <Button variant={"ghost"} onClick={() => setCurrentTab("Profile")}>Profile Settings</Button>
          <Button variant={"ghost"} onClick={() => setCurrentTab("Theme")}>Color Themes</Button>
          <Button variant={"ghost"} onClick={() => setCurrentTab("Font")}>Fonts Styles</Button>
        </Flex>
        <Flex flexDir={"column"}>
          <ModalHeader>{currentTab}</ModalHeader>
          <ModalBody gap={4}>
            {currentTab === "Profile" ?
              <>
                <Editable defaultValue={currentName} isPreviewFocusable={false} display={"flex"}>
                  <EditablePreview />
                  <Input as={EditableInput} />
                  <EditableControls />
                </Editable>

                <Editable defaultValue={currentEmail} isPreviewFocusable={false} display={"flex"}>
                  <EditablePreview />
                  <Input as={EditableInput} />
                  <EditableControls />
                </Editable>

                <Editable defaultValue={currentPw} isPreviewFocusable={false} display={"flex"}>
                  <EditablePreview />
                  <Input as={EditableInput} />
                  <EditableControls />
                </Editable>
              </>
              : null
            }
            {currentTab === "Theme" ?
              <>
                <Editable defaultValue={currentTheme} isPreviewFocusable={false}>
                  <EditablePreview />
                  <Input as={EditableInput} />
                  <EditableControls />
                </Editable>
              </>
              : null
            }
            {currentTab === "Font" ?
              <>
                <Editable defaultValue={currentFont} isPreviewFocusable={false}>
                  <EditablePreview />
                  <Input as={EditableInput} />
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