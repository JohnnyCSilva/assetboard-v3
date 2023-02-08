import React from 'react'
import { googleSignIn } from '../config/Firebase'
import { useAuthValue } from "../config/AuthContext"



function signIn() {

    function childOfAuthProvider(){
        const {currentUser} = useAuthValue()
        //console.log(currentUser)
      }

  return (
    <div onClick={googleSignIn}>googleSignIn</div>
  )
}

export default signIn