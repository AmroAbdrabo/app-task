import React from 'react';
import {
  Box, List, ListItem, Flex, IconButton, Text, useColorModeValue,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  Button, FormControl, FormLabel, Input, useDisclosure
} from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { AppDispatch } from '../state/store';
import { Contract, addContract, deleteContract, updateContract } from '../state/contract/contractsSlice';
import { RootState } from '../state/store';

function SubList() {
  // Directly using Redux store
  const { contracts: subscriptions, monthlyTotal, yearlyTotal, status } = useSelector((state: RootState) => state.contracts);
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentSubscription, setCurrentSubscription] = React.useState<Contract>();
  const bgHover = useColorModeValue("gray.200", "gray.700");

  const handleAddClick = () => {
    const randomId = Math.floor(Math.random() * 1000000);
    setCurrentSubscription({ id: randomId, name: '', cost: 0, duration: 0, cycle: 0 });
    onOpen();
  };

  const handleItemClick = (subscription: Contract) => {
    setCurrentSubscription({ ...subscription });
    onOpen();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;
     // For the numerical fields, make sure that the field is a positive integer
    if (field === "cost" || field === "cycle" || field === "duration"){
      if (! (/^[1-9]\d*$/.test(value))) {
        return;
      }
    }
    if (currentSubscription) {
      setCurrentSubscription({ ...currentSubscription, [field]: e.target.value });
    }
  };

  const handleSubmit = () => {
    if (currentSubscription) {
      if (currentSubscription.id > subscriptions.length) {
        dispatch(addContract(currentSubscription));
      } else {
        dispatch(updateContract(currentSubscription));
      }
    }
    onClose();
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

       {/* This modal form is opened for editing or for creating a new contract*/}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent> 
          <ModalHeader>{currentSubscription && currentSubscription.id > subscriptions.length ? 'Add New Subscription' : 'Edit Subscription'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input placeholder="Name" value={currentSubscription?.name || ''} onChange={(e) => handleChange(e, 'name')} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Cost</FormLabel>
              <Input placeholder="Cost" value={currentSubscription?.cost || ''} onChange={(e) => handleChange(e, 'cost')} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Duration</FormLabel>
              <Input placeholder="Duration" value={currentSubscription?.duration || ''} onChange={(e) => handleChange(e, 'duration')} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Cycle</FormLabel>
              <Input placeholder="Payment Cycle" value={currentSubscription?.cycle || ''} onChange={(e) => handleChange(e, 'cycle')} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Display the contracts */}
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
