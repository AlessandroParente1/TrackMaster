import { useRouter } from "next/router";
import {  Alert,  AlertIcon,  Box,  Button,  Flex,  FormControl,  FormErrorMessage,  FormLabel,  Input,  Modal,  ModalBody,  ModalCloseButton,  ModalContent,  ModalFooter,  ModalHeader,  ModalOverlay,  Tab,  TabList,  TabPanel,  TabPanels,  Tabs,  useDisclosure} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import MiscellaneousService from "@/services/miscellaneous-service";
import ProjectService from "@/services/project-service";
import useApi from "@/hooks/useApi";
import useAuthStore from "@/hooks/useAuth";
import {  PROJECT_ASSIGNEES_COLUMNS,  USERS_COLUMNS} from "@/util/TableDataDisplay";
import {  CreateProjectData,  CreateProjectSchema} from "@/util/ValidationSchemas";
import RichTextEditor from "../editor/RichTextEditor";
import AlertModal from "../others/AlertModal";
import Table from "../others/Table";

const AddProject = ({ isOpen, onClose, projectInfo, mutateServer }) => {
  // retrieves the information of the authenticated user to verify the role and identify the author of the project.
  const useAuth = useAuthStore();

  //checks if projectInfo is undefined, which indicates creating a new project,
  // while a defined value indicates modifying an existing project.
  const isNewProject = projectInfo === undefined;

  //makes a request to the API to obtain available users to assign to the project.
  const allUsersSWR = useApi(MiscellaneousService.getUsers(), isOpen);

  const router = useRouter();
  const formRef = useRef();
  const deleteProjectDisclosure = useDisclosure();

  //to handle any errors while creating or editing the project.
  const [error, setError] = useState("");

  //contains the IDs of users assigned to the project.
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState([]);

  //contains the description of the project
  const [projectDescription, setProjectDescription] = useState("");
  const [projectInfoData, setProjectInfoData] = useState(CreateProjectData);

  //indicates whether the current user is the author of the project.
  const [isProjectAuthor, setIsProjectAuthor] = useState(isNewProject);


  useEffect(() => {

    //When the modal is open (isOpen) and projectInfo is present, the useEffect hook initializes the project data
    if (isOpen && projectInfo) {

      //populates ProjectInfoData with title and description
      setProjectInfoData({
        title: projectInfo.title,
        description: projectInfo.description,
        assignees: projectInfo.assignees.map((assignee) => assignee._id) || [],
      });

      setProjectDescription(projectInfo.description);

      //sets the assignees
      setSelectedAssigneeIds(
        projectInfo.assignees.map((assignee) => assignee._id)
      );

      //updates isProjectAuthor to check if the current user is the author.
      setIsProjectAuthor(useAuth.userProfile?._id === projectInfo.authorId._id);
    }
  }, [isOpen]);

  //updates selectedAssigneeIds based on the selected users.
  const onAssigneeClick = ({ selected }) => {
    setSelectedAssigneeIds(Object.keys(selected));
  };

  //delete the existing project by calling mutateServer to update the server-side data and close the modal with onCloseModal.
  const onProjectDelete = async () => {
    try {
      await mutateServer(ProjectService.deleteProject(projectInfo._id));
      onCloseModal();
      router.back();
    } catch (error) {
      setError(error);
      deleteProjectDisclosure.onClose();
    }
  };

  //resets the local states when the modal is closed, restoring the initial values.
  const onCloseModal = () => {
    setError("");
    setProjectInfoData(CreateProjectData);
    setProjectDescription("");
    setSelectedAssigneeIds([]);
    onClose();
  };

  //sends the form data to the API to create or update the project.
  const onHandleFormSubmit = async (data) => {
    try {
      const projectData = { ...data };
      projectData.assignees = selectedAssigneeIds;
      projectData.description = projectDescription;

      let apiRequestInfo;

      //If this is a new project (isNewProject), create a project by calling ProjectService.createProject.
      if (isNewProject) {
        apiRequestInfo = ProjectService.createProject(projectData);
      }
      //update the existing project with ProjectService.updateProject.
      else {
        projectData._id = projectInfo._id;
        apiRequestInfo = ProjectService.updateProject(
          projectData,
          projectInfo._id
        );
      }

      //Update the server-side data with mutateServer, thus closing the modal.
      await mutateServer(apiRequestInfo);

      onClose();
      onCloseModal();
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onCloseModal}
      size="lg"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isNewProject ? "Create" : "Update"} Project</ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody overflowY="auto" mt={-10}>
          <Tabs variant="enclosed" size="sm" colorScheme="blue" mt={10}>
            <TabList>
              <Tab>Project Info</Tab>
              <Tab>Contributors</Tab>
            </TabList>

            {error && (
              <Alert status="error" variant="left-accent" fontSize="sm" mb={2}>
                <AlertIcon />
                {error}
              </Alert>
            )}

            <TabPanels maxHeight="100%" height="100%">
              <TabPanel>
                <Formik
                  initialValues={projectInfoData}
                  validationSchema={CreateProjectSchema}
                  onSubmit={onHandleFormSubmit}
                  innerRef={formRef}
                  enableReinitialize
                >
                  {({ errors, touched }) => (
                    <Flex direction="column" justify="space-between">
                      <Form>
                        <Box>
                          <Flex direction="column" gap={3}>
                            <FormControl
                              isInvalid={errors.title && touched.title}
                            >
                              <FormLabel>Title</FormLabel>
                              {/*Input fields and the RichTextEditor are disabled for unauthorized users
                              backend side control is done thanks to onHandleFormSubmit (above)*/}
                              <Field
                                as={Input}
                                name="title"
                                type="text"
                                borderWidth="2px"
                                disabled={!isProjectAuthor}
                              />
                              <FormErrorMessage>
                                {errors.title}
                              </FormErrorMessage>
                            </FormControl>

                            <FormControl>
                              <FormLabel>Description</FormLabel>
                              <RichTextEditor
                                content={projectDescription}
                                setContent={setProjectDescription}
                                disabled={!isProjectAuthor}
                              />
                            </FormControl>
                          </Flex>
                        </Box>
                      </Form>
                    </Flex>
                  )}
                </Formik>
              </TabPanel>
              <TabPanel>
                <Table
                  tableData={
                    !isNewProject && !isProjectAuthor
                      ? projectInfo.assignees
                      : allUsersSWR.data
                  }
                  columns={
                    !isNewProject && !isProjectAuthor
                      ? PROJECT_ASSIGNEES_COLUMNS
                      : USERS_COLUMNS
                  }
                  searchPlaceholder={"Search for users"}
                  height={330}
                  hasCheckboxColumn={isProjectAuthor}
                  sortable={false}
                  selectedRowIds={selectedAssigneeIds}
                  onSelectionChange={onAssigneeClick}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter mr={3} gap={3}>
          {!isNewProject && isProjectAuthor ? (
            <Button colorScheme="red" onClick={deleteProjectDisclosure.onOpen}>
              Delete Project
            </Button>
          ) : null}

          {/*The button to save changes or create a project is shown only if isProjectAuthor is true
          backend side control is done thanks to onHandleFormSubmit (above)*/}
          {isProjectAuthor ? (
            <Button
              colorScheme="blue"
              onClick={() => {
                formRef.current?.submitForm();
              }}
            >
              {isNewProject ? "Create" : "Save Changes"}
            </Button>
          ) : null}

          {!isProjectAuthor ? <Button onClick={onClose}>Close</Button> : null}
        </ModalFooter>

        <AlertModal
          title={"Delete project"}
          body="Are you sure you to delete project?"
          isOpen={deleteProjectDisclosure.isOpen}
          onClose={deleteProjectDisclosure.onClose}
          onCTA={onProjectDelete}
        />
      </ModalContent>
    </Modal>
  );
};

export default AddProject;
