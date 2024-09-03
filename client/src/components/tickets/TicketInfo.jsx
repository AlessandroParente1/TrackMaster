import {
  Alert,
  AlertIcon,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import moment from "moment/moment";
import React from "react";
import MiscellaneousService from "@/services/miscellaneous-service";
import useApi from "@/hooks/useApi";
import { usePermissions } from "@/hooks/usePermissions";
import {
  Permissions,
  createTicketStatusSelectOptions,
  createTicketTypeSelectOptions,
} from "@/util/Utils";
import { CreateTicketSchema } from "@/util/ValidationSchemas";
import RichTextEditor from "../editor/RichTextEditor";

// TicketInfo component to display and manage the ticket information form
const TicketInfo = ({
                      ticketInfo,
                      onHandleFormSubmit,
                      formRef,
                      ticketDescription,
                      setTicketDescription,
                    }) => {
  const canManageTickets = usePermissions(Permissions.canManageTickets); // Permission check to manage tickets
  const ticketTypesSWR = useApi(MiscellaneousService.getAllTicketType()); // Fetch ticket types

  return (
      <Formik
          initialValues={ticketInfo} // Initialize form with ticket info
          validationSchema={CreateTicketSchema} // Validation schema for the form
          onSubmit={onHandleFormSubmit}
          innerRef={formRef} // Reference to the form instance
          enableReinitialize // Reinitialize form when ticketInfo changes
      >
        {({ errors, touched, handleChange }) => (
            <Form>
              <Flex gap={3}>
                {/* Left side of the form (Title and Description) */}
                <Flex direction="column" flex={1} gap={3}>
                  <FormControl isInvalid={errors.title && touched.title}>
                    <FormLabel>Title</FormLabel>
                    <Field
                        as={Input}
                        name="title"
                        type="text"
                        onChange={handleChange}
                        disabled={!canManageTickets} // Disable input if user cannot manage tickets
                    />
                    <FormErrorMessage>{errors.title}</FormErrorMessage>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <RichTextEditor
                        content={ticketDescription}
                        setContent={setTicketDescription}
                        disabled={!canManageTickets} // Disable editor if user cannot manage tickets
                    />
                  </FormControl>
                </Flex>

                {/* Right side of the form (Type, Status, Estimated Time) */}
                <Flex direction="column" gap={3}>
                  <FormControl isInvalid={errors.type && touched.type}>
                    <FormLabel>Type</FormLabel>
                    <Field
                        as={Select}
                        name="type"
                        type="select"
                        onChange={handleChange}
                        disabled={!canManageTickets}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {createTicketTypeSelectOptions(ticketTypesSWR.data || [])}
                    </Field>
                    <FormErrorMessage>{errors.type}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={errors.status && touched.status}>
                    <FormLabel>Status</FormLabel>
                    <Field
                        as={Select}
                        name="status"
                        type="select"
                        onChange={handleChange}
                        disabled={!canManageTickets}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {createTicketStatusSelectOptions()}
                    </Field>
                    <FormErrorMessage>{errors.status}</FormErrorMessage>
                  </FormControl>
                  <Flex gap={4}>
                    <FormControl
                        isInvalid={errors.estimatedTime && touched.estimatedTime}
                    >
                      <FormLabel>Estimated time</FormLabel>
                      <Field
                          as={Input}
                          name="estimatedTime"
                          type="number"
                          onChange={handleChange}
                          disabled={!canManageTickets}
                      />
                      <FormErrorMessage>{errors.estimatedTime}</FormErrorMessage>
                    </FormControl>

                    <FormControl
                        isInvalid={
                            errors.estimatedTimeUnit && touched.estimatedTimeUnit
                        }
                    >
                      <FormLabel>Estimated Time Unit</FormLabel>
                      <Field
                          as={Select}
                          name="estimatedTimeUnit"
                          type="select"
                          onChange={handleChange}
                          disabled={!canManageTickets}
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        <option value="h">Hour(s)</option>
                        <option value="d">Day(s)</option>
                      </Field>
                      <FormErrorMessage>
                        {errors.estimatedTimeUnit}
                      </FormErrorMessage>
                    </FormControl>
                  </Flex>

                  {/* Display creation and update timestamps */}
                  <Flex direction="column" mt={2}>
                    <Text fontSize="sm" fontWeight={500} color="inputLabel">
                      {ticketInfo.createdOn
                          ? "Created " + moment(ticketInfo.createdOn).fromNow()
                          : ""}
                    </Text>
                    <Text fontSize="sm" fontWeight={500} color="inputLabel">
                      {ticketInfo.updatedOn
                          ? "Updated " + moment(ticketInfo.updatedOn).fromNow()
                          : ""}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Form>
        )}
      </Formik>
  );
};

export default TicketInfo;
