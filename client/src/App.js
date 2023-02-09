import { useEffect, useState } from 'react'

const CLIENT_ID = "43010ef9017ddeca7ba0"

function App() {

  const [rerender, setRerender] = useState(false)
  const [user, setUser] = useState({})

  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const codeParam = urlParams.get("code")

  async function getAccessToken() {
    await fetch("http://localhost:4000/getAccessToken?code=" + codeParam, {
      method: "GET"
    }).then((response) => {
      return response.json()
    }).then((data) => {
      console.log(data)
      if (data.access_token) {
        localStorage.setItem("accessToken", data.access_token)
        setRerender(!rerender)
      }
    })
    getUserData()
  }
  
  function loginWithGithub() {
    window.location.assign("https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID)
  }

  async function getUserData() {
    await fetch("http://localhost:4000/getUserData", {
      method: "GET",
      headers: {
        "Authorization" : "Bearer " + localStorage.getItem("accessToken")
      }
    }).then((response) => {
      return response.json()
    }).then((data) => {
      console.log(data)
      setUser(data)
    })
  }

  useEffect(() => {
    if (codeParam && (localStorage.getItem("accessToken") === null)) {
      getAccessToken()
    }
  }, [])

  useEffect(() => {
    getUserData()
  }, [])

  return (
    <div className="app">
      {localStorage.getItem("accessToken") ?
        <div>
          <button onClick={() => {localStorage.removeItem("accessToken"); setRerender(!rerender) }}>
            Log Out
          </button>
          <h1>User Data:</h1>
          {console.log(user)}
          {Object.keys(user).length !== 0 ?
            <div className="user-data">
              <h4>Welcome, {user.login}</h4>
              <img width="100px" height="100px" src={user.avatar_url} />
              <a href={user.html_url}>Github profile</a>
            </div>
          :
            <div>

            </div>
          }
        </div>
      :
        <button onClick={loginWithGithub}>
          Login with Github
        </button>
      }
    </div>
  )
}

export default App
