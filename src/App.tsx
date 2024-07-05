import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import SubList from './components/SubList';

function App() {
  return (
    <Box className="App" p={5}>
      <Heading mb={4}>Manage Contracts and Subscriptions</Heading>
      <SubList/>
    </Box>
  );
}

export default App;
