import { Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import './App.css';

const testData = {
  "name": "Josh",
  "email": "jojim@gmail.com",
  "password": "password",
  "photo": "12345.jpg",
  "theme": "Dark",
  "font": "Sans-Seriff"
}

function App() {
  const [currentUser, setCurrentUser] = useState([]);

  const fetchData = () => {
    fetch('http://localhost:3000/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      return res.json()
    }).then((data) => {
      setCurrentUser((prevUsers) => [...prevUsers, ...data])
    }).catch((err) => {
      console.log("The error is: ", err)
    })
  }

  useEffect(() => {
    fetchData()
  }, []);

  const testDatabase = async () => {
    try {
      const newUser = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      fetchData()
    } catch (error) {
      console.log("Error saving to database: ", error)
    }
  }

  return (
    <>
      <h1>Usernames:</h1>
      {currentUser.map((user, index) => (
        <p key={index}>{user.name}</p>
      ))}
      <Button onClick={testDatabase}>Click to test database</Button>
    </>
  )
}

export default App
