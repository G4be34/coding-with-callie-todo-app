import { Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import './App.css';

const testData = {
  "name": "Gab",
  "email": "jimjam@gmail.com",
  "password": "password",
  "photo": "12345.jpg",
  "theme": "Dark",
  "font": "Sans-Seriff"
}

function App() {
  const [currentUser, setCurrentUser] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:3000/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      return res.text()
    }).then((data) => {
      setCurrentUser(data)
    }).catch((err) => {
      console.log("The error is: ", err)
    })
  }, []);

  const testDatabase = () => {
    fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    }).then((res) => {
      console.log("Data saved successfully")
    }).catch((err) => {
      console.log("Error saving to database: ", err)
    })
  }

  return (
    <>
      <h1>Username: {currentUser}</h1>
      <Button onClick={testDatabase}>Click to test database</Button>
    </>
  )
}

export default App
