import React from 'react'
import {useSelector} from 'react-redux'
function UserDashboard() {
    let {userObj}=useSelector(state=>state.user)
  return (
    <>

    <img src={userObj.profileImg} width="50px" className="rounded float-end" alt=""/>
    <div>Userdashboard</div>

    </>
  )
}

export default UserDashboard;