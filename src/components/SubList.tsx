import React from 'react';
import {
  Box, List, ListItem, Flex, IconButton, Text, useColorModeValue,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  Button, FormControl, FormLabel, Input, useDisclosure
} from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { contractSchema } from '../schemas/contractSchema';
import { AppDispatch } from '../state/store';
import { Contract, addContract, deleteContract, updateContract } from '../state/contract/contractsSlice';
import { RootState } from '../state/store';

function SubList() {
  const { contracts: subscriptions, monthlyTotal, yearlyTotal, status } = useSelector((state: RootState) => state.contracts);
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentSubscription, setCurrentSubscription] = React.useState<Contract>();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Contract>({
    resolver: zodResolver(contractSchema)
  });
  const bgHover = useColorModeValue("gray.200", "gray.700");

  const handleAddClick = () => {
    // Create random blob id and initialize empty values
    const randomId = Math.floor(Math.random() * 1000000);
    reset({
      id: randomId,
      name: '',
      cost: 0,
      duration: 0,
      cycle: 0
    });
    onOpen();
  };

  const handleItemClick = (subscription: Contract) => {
    // The current subscription is the one that will be edited, which has just been clicked
    setCurrentSubscription(subscription);
    reset(subscription);
    onOpen();
  };

  const onSubmit = (data: Contract) => {
    if (!currentSubscription) {
      // If new subscription, create random blob
      const randomId = Math.floor(Math.random() * 1000000);
      data.id = randomId; 
      dispatch(addContract(data));
    } else if (currentSubscription){
        // else, take all data from form and paste into current subscription so as to override current subscription's values
        let curSub = {...currentSubscription, ...data}
        dispatch(updateContract(curSub));
    }
    onClose();
    setCurrentSubscription(undefined);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteContract(id));
  };

  return (
    <Box p={5} bg="gray.100" boxShadow="md" borderRadius="lg">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold">Subscriptions</Text>
        <IconButton
          aria-label="Add new item"
          icon={<FaPlus />}
          isRound
          size="lg"
          colorScheme="green"
          onClick={handleAddClick}
        />
      </Flex>

      {/* Modal form for creating and editing a subscription */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent> 
          <ModalHeader>Edit Subscription</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} as="form" onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Name</FormLabel>
              <Input placeholder="Name" {...register('name')} />
              <Text color="red.500">{errors.name?.message}</Text>
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.cost}>
              <FormLabel>Cost</FormLabel>
              <Input placeholder="Cost"  type="number" {...register('cost')}  />
              <Text color="red.500">{errors.cost?.message}</Text>
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.duration}>
              <FormLabel>Duration</FormLabel>
              <Input placeholder="Duration"  type="number" {...register('duration', { valueAsNumber: true })}  />
              <Text color="red.500">{errors.duration?.message}</Text>
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.cycle}>
              <FormLabel>Cycle</FormLabel>
              <Input placeholder="Payment Cycle"  type="number" {...register('cycle', { valueAsNumber: true })}  />
              <Text color="red.500">{errors.cycle?.message}</Text>
            </FormControl>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Display list of subscriptions */}
      <List spacing={3}>
        {subscriptions.map((sub) => (
          <ListItem 
            key={sub.id} 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between"
            py={2}
            px={3}
            borderRadius="md"
            transition="background 0.2s"
            _hover={{ bg: bgHover }}
            cursor="pointer"
            onClick={() => handleItemClick(sub)}
          >
            <Flex alignItems="center">
              <Text fontWeight="bold">{sub.name}</Text>
              <Text ml={2} color="gray.600">Renews every {sub.cycle} months for {sub.duration} months</Text>
            </Flex>
            <Flex>
              <Text mr={3}>Cost: {sub.cost} CHF</Text>
              <IconButton
                aria-label="Delete subscription"
                icon={<FaTrash />}
                size="sm"
                colorScheme="red"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(sub.id);
                }}
              />
            </Flex>
          </ListItem>
        ))}
      </List>

      <Text mb={4}>Total Monthly Cost: {monthlyTotal} CHF</Text>
      <Text mb={4}>Total Yearly Cost: {yearlyTotal} CHF</Text>
      <Text mb={10}>Status: {status}</Text>
    </Box>
  );
}

export default SubList;
