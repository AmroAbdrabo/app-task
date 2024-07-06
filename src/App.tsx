import React from 'react';
import './App.css';
import { Box, Heading } from '@chakra-ui/react';
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
